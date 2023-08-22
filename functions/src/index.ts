import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as logger from 'firebase-functions/logger';

admin.initializeApp();

const fcm = admin.messaging();

async function getChat(id: string) {
    const chatRef = admin.firestore().collection('chats').doc(id);

    const chatSnapshot = await chatRef.get();

    const chat = chatSnapshot.data();

    if (!chat) {
        logger.error(`Chat with id ${id} does not exist`);
        return;
    }

    return chat;
}

async function getChatMembers(chat: admin.firestore.DocumentData) {
    const members = [];

    for (const memberId of chat.members) {
        const memberRef = admin.firestore().collection('users').doc(memberId);

        const memberSnapshot = await memberRef.get();

        let member = memberSnapshot.data();

        if (!member) {
            logger.error(`User with id ${memberId} does not exist`);
            return;
        }

        member.id = memberId;

        members.push(member);
    }

    return members;
}

export const onMessageSent = functions.firestore.document('chats/{chatId}/messages/{messageId}').onCreate(async (snapshot, context) => {
    const chat = await getChat(context.params.chatId);

    if (!chat) {
        logger.error(`Chat with id ${context.params.chatId} does not exist`);
        return;
    }

    const members = await getChatMembers(chat);

    if (!members) {
        logger.error(`Could not get members of chat with id ${context.params.chatId}`);
        return;
    }

    const message = snapshot.data();

    const senderId = message.senderId;

    const recipient = members.find((member) => member.id !== senderId);
    const sender = members.find((member) => member.id === senderId);

    if (!recipient || !sender) {
        logger.error(`Could not find sender or recipient of message with id ${context.params.messageId}`);
        return;
    }

    const notification: admin.messaging.Message = {
        token: recipient.fcmToken,
        notification: {
            title: sender.displayName,
            body: message.content,
            imageUrl: sender.photoURL,
        },
    };

    await fcm.send(notification);
});
