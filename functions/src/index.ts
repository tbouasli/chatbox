import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { onCall } from 'firebase-functions/v2/https';

admin.initializeApp();

const firestore = admin.firestore();
const fcm = admin.messaging();

interface requestFriendshipRequest {
    friendUid: string;
}

export const requestFriendship = onCall<requestFriendshipRequest>(async (request) => {
    const uid = request.auth?.uid;
    const friendUid = request.data?.friendUid;

    if (!uid) {
        return {
            message: `You must be authenticated to request a friendship`,
        };
    }

    if (!friendUid) {
        return {
            message: `You must provide a friendUid`,
        };
    }

    const youDoc = await firestore.doc(`users/${uid}`).get();
    const friendDoc = await firestore.doc(`users/${friendUid}`).get();

    if (!youDoc.exists || !friendDoc.exists) {
        return {
            message: `Server Error`,
        };
    }

    const you = youDoc.data();
    const friend = friendDoc.data();

    const id = [uid, friendUid].sort().join('_');

    const friendshipDoc = await firestore.doc(`friendships/${id}`).get();

    const notification: admin.messaging.Message = {
        notification: {
            title: 'Friendship Request',
            body: `${you?.displayName} sent you a friendship request`,
        },
        token: friend?.fcmToken,
    };

    if (friendshipDoc.exists) {
        const friendship = friendshipDoc.data();

        if (friendship?.status === 'pending') {
            return {
                message: `Friendship request already sent to ${friendUid}`,
            };
        }

        if (friendship?.status === 'accepted') {
            return {
                message: `You are already friends with ${friendUid}`,
            };
        }

        if (friendship?.status === 'rejected') {
            await friendshipDoc.ref.update({
                status: 'pending',
                createdAt: Timestamp.now(),
            });

            await fcm.send(notification);

            return {
                message: `Friendship request sent to ${friendUid}`,
            };
        }
    }

    const friendship = {
        users: [uid, friendUid],
        status: 'pending',
        createdAt: Timestamp.now(),
    };

    await firestore.doc(`friendships/${id}`).set(friendship);

    await fcm.send(notification);

    return {
        message: `Friendship request sent to ${friendUid}`,
    };
});

interface acceptFriendshipRequest {
    friendshipId: string;
}

export const acceptFriendship = onCall<acceptFriendshipRequest>(async (request) => {
    const uid = request.auth?.uid;
    const friendshipId = request.data?.friendshipId;

    if (!uid) {
        return {
            message: `You must be authenticated to accept a friendship`,
        };
    }

    if (!friendshipId) {
        return {
            message: `You must provide a friendshipId`,
        };
    }

    const friendshipDoc = await firestore.doc(`friendships/${friendshipId}`).get();

    if (!friendshipDoc.exists) {
        return {
            message: `Friendship does not exist`,
        };
    }

    const friendship = friendshipDoc.data();

    if (friendship?.status === 'accepted') {
        return {
            message: `Friendship already accepted`,
        };
    }

    if (friendship?.status === 'rejected') {
        return {
            message: `Friendship already rejected`,
        };
    }

    if (friendship?.status !== 'pending') {
        return {
            message: `Friendship request not pending`,
        };
    }

    if (!friendship.users.includes(uid)) {
        return {
            message: `You are not part of this friendship`,
        };
    }

    const friendId = friendship.users.find((id: string) => id !== uid);

    if (!friendId) {
        await firestore.doc(`friendships/${friendshipId}`).delete();

        return {
            message: 'Invalid friendship, friend not found',
        };
    }

    const friendDoc = await firestore.doc(`users/${friendId}`).get();

    if (!friendDoc.exists) {
        await firestore.doc(`friendships/${friendshipId}`).delete();

        return {
            message: 'Invalid friendship, friend not found',
        };
    }

    const friend = friendDoc.data();

    if (!friend?.fcmToken && friend?.fcmToken !== 'no-token') {
        const notification: admin.messaging.Message = {
            notification: {
                title: 'Friendship Accepted',
                body: `${friend?.displayName} accepted your friendship request`,
            },
            token: friend?.fcmToken,
        };

        await fcm.send(notification);
    }

    await friendshipDoc.ref.update({
        status: 'accepted',
        updatedAt: Timestamp.now(),
    });

    return {
        message: `Friendship accepted`,
    };
});

interface rejectFriendshipRequest {
    friendshipId: string;
}

export const rejectFriendship = onCall<rejectFriendshipRequest>(async (request) => {
    const uid = request.auth?.uid;
    const friendshipId = request.data?.friendshipId;

    if (!uid) {
        return {
            message: `You must be authenticated to accept a friendship`,
        };
    }

    if (!friendshipId) {
        return {
            message: `You must provide a friendshipId`,
        };
    }

    const friendshipDoc = await firestore.doc(`friendships/${friendshipId}`).get();

    if (!friendshipDoc.exists) {
        return {
            message: `Friendship does not exist`,
        };
    }

    const friendship = friendshipDoc.data();

    if (friendship?.status === 'accepted') {
        return {
            message: `Friendship already accepted`,
        };
    }

    if (friendship?.status === 'rejected') {
        return {
            message: `Friendship already rejected`,
        };
    }

    if (friendship?.status !== 'pending') {
        return {
            message: `Friendship request not pending`,
        };
    }

    if (!friendship.users.includes(uid)) {
        return {
            message: `You are not part of this friendship`,
        };
    }

    const friendId = friendship.users.find((id: string) => id !== uid);

    if (!friendId) {
        await firestore.doc(`friendships/${friendshipId}`).delete();

        return {
            message: 'Invalid friendship, friend not found',
        };
    }

    const friendDoc = await firestore.doc(`users/${friendId}`).get();

    if (!friendDoc.exists) {
        await firestore.doc(`friendships/${friendshipId}`).delete();

        return {
            message: 'Invalid friendship, friend not found',
        };
    }

    await friendshipDoc.ref.update({
        status: 'rejected',
        updatedAt: Timestamp.now(),
    });

    return {
        message: `Friendship rejected`,
    };
});

interface createChatRequest {
    friendshipId: string;
}

export const createChat = onCall<createChatRequest>(async (request) => {
    const uid = request.auth?.uid;
    const friendshipId = request.data?.friendshipId;

    if (!uid) {
        return {
            message: `You must be authenticated to create a chat`,
        };
    }

    if (!friendshipId) {
        return {
            message: `You must provide a friendshipId`,
        };
    }

    const friendshipDoc = await firestore.doc(`friendships/${friendshipId}`).get();

    if (!friendshipDoc.exists) {
        return {
            message: `Friendship does not exist`,
        };
    }

    const friendship = friendshipDoc.data();

    if (friendship?.status !== 'accepted') {
        return {
            message: `Friendship not accepted`,
        };
    }

    if (!friendship.users.includes(uid)) {
        return {
            message: `You are not part of this friendship`,
        };
    }

    const chatDoc = await firestore.doc(`chats/${friendshipId}`).get();

    if (chatDoc.exists) {
        return {
            message: `Chat already exists`,
        };
    }

    const chat = {
        members: friendship.users,
        createdAt: Timestamp.now(),
    };

    await firestore.doc(`chats/${friendshipId}`).set(chat);

    return {
        message: `Chat created`,
    };
});

interface SendMessageRequest {
    chatId: string;
    content: string;
}

export const sendMessage = onCall<SendMessageRequest>(async (request) => {
    const uid = request.auth?.uid;
    const chatId = request.data?.chatId;
    const content = request.data?.content;

    if (!uid) {
        return {
            message: `You must be authenticated to send a message`,
        };
    }

    if (!chatId) {
        return {
            message: `You must provide a chatId`,
        };
    }

    if (!content) {
        return {
            message: `You must provide a content`,
        };
    }

    if (content.length > 255) {
        return {
            message: `Content must be less than 255 characters`,
        };
    }

    if (content.trim().length === 0) {
        return {
            message: `Content must not be empty`,
        };
    }

    const chatDoc = await firestore.doc(`chats/${chatId}`).get();

    if (!chatDoc.exists) {
        return {
            message: `Chat does not exist`,
        };
    }

    const chat = chatDoc.data();

    if (!chat?.members.includes(uid)) {
        return {
            message: `You are not part of this chat`,
        };
    }

    const otherMemberId = chat.members.find((id: string) => id !== uid);

    if (!otherMemberId) {
        return {
            message: `Invalid chat, other member not found`,
        };
    }

    const otherMemberDoc = await firestore.doc(`users/${otherMemberId}`).get();

    if (!otherMemberDoc.exists) {
        return {
            message: `Invalid chat, other member not found`,
        };
    }

    const otherMember = otherMemberDoc.data();

    const message = {
        content,
        chatId,
        senderId: uid,
        read: false,
        createdAt: Timestamp.now(),
    };

    await firestore.collection(`messages`).add(message);

    if (otherMember?.fcmToken && otherMember?.fcmToken !== 'no-token') {
        const notification: admin.messaging.Message = {
            notification: {
                title: 'New Message',
                body: `${otherMember?.displayName} sent you a message`,
            },
            token: otherMember?.fcmToken,
        };

        await fcm.send(notification);
    }

    return {
        message: `Message sent`,
    };
});
