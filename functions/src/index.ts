import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onCall } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2/options';

admin.initializeApp();

const firestore = admin.firestore();

setGlobalOptions({ maxInstances: 10, region: 'southamerica-east1' });

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

    const id = [uid, friendUid].sort().join('_');

    const friendshipDoc = await firestore.doc(`friendships/${id}`).get();

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

            return {
                message: `Friendship request sent to ${friendUid}`,
            };
        }
    }

    const friendship = {
        users: [uid, friendUid],
        status: 'pending',
        senderId: uid,
        createdAt: Timestamp.now(),
    };

    await firestore.doc(`friendships/${id}`).set(friendship);

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

    if (friendship?.senderId === uid) {
        return {
            message: `You cannot accept your own friendship request`,
        };
    }

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

    if (friendship?.senderId === uid) {
        return {
            message: `You cannot reject your own friendship request`,
        };
    }

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

interface OnBoardUserRequest {
    displayName: string;
    nickname: string;
    photoURL: string;
    fcmToken?: string;
}

export const onBoardUser = onCall<OnBoardUserRequest>(async (request) => {
    try {
        const uid = request.auth?.uid;

        if (!uid) {
            return {
                message: `You must be authenticated to onboard a user`,
            };
        }

        const displayName = request.data?.displayName;
        const nickname = request.data?.nickname;
        const photoURL = request.data?.photoURL;
        const fcmToken = request.data?.fcmToken;

        if (!displayName) {
            return {
                message: `You must provide a displayName`,
            };
        }

        if (!nickname) {
            return {
                message: `You must provide a nickname`,
            };
        }

        if (!photoURL) {
            return {
                message: `You must provide a photoURL`,
            };
        }

        const userDoc = await firestore.doc(`users/${uid}`).get();

        if (userDoc.exists) {
            return {
                message: `User already boarded`,
            };
        }

        const user = {
            displayName,
            nickname,
            photoURL,
            fcmToken,
        };

        await firestore.doc(`users/${uid}`).set(user);

        return {
            message: `User boarded`,
        };
    } catch (error) {
        console.log(error);
        return {
            message: `Error onboarding user`,
        };
    }
});

interface UpdateUserFcmTokenRequest {
    fcmToken: string;
}

export const updateUserFcmToken = onCall<UpdateUserFcmTokenRequest>(async (request) => {
    try {
        const uid = request.auth?.uid;

        if (!uid) {
            return {
                message: `You must be authenticated to update a user's FCM token`,
            };
        }

        const fcmToken = request.data?.fcmToken;

        if (!fcmToken) {
            return {
                message: `You must provide a fcmToken`,
            };
        }

        const userDoc = await firestore.doc(`users/${uid}`).get();

        if (!userDoc.exists) {
            return {
                message: `User not found`,
            };
        }

        await userDoc.ref.update({
            fcmToken,
        });

        return {
            message: `User FCM token updated`,
        };
    } catch (error) {
        console.log(error);
        return {
            message: `Error updating user FCM token`,
        };
    }
});

export const onMessageSent = onDocumentCreated('chats/{chatId}/messages/{messageId}', async (event) => {
    //send notification to all members of the chat except the sender

    const chatId = event.params.chatId;

    const chatDoc = await firestore.doc(`chats/${chatId}`).get();

    if (!chatDoc.exists) {
        return;
    }

    const chat = chatDoc.data();

    if (!chat) {
        return;
    }

    const message = event.data?.data();

    if (!message) {
        return;
    }

    const senderId = message.senderId;

    if (!senderId) {
        return;
    }

    const senderDoc = await firestore.doc(`users/${senderId}`).get();

    if (!senderDoc.exists) {
        return;
    }

    const sender = senderDoc.data();

    if (!sender) {
        return;
    }

    const members = chat.members;

    if (!members) {
        return;
    }

    const notification: admin.messaging.Notification = {
        title: sender.nickname,
        body: message.text,
    };

    //for each member of the chat, send a notification except the sender

    for (const memberId of members) {
        if (memberId === senderId) {
            continue;
        }

        const memberDoc = await firestore.doc(`users/${memberId}`).get();

        if (!memberDoc.exists) {
            continue;
        }

        const member = memberDoc.data();

        if (!member) {
            continue;
        }

        const fcmToken = member.fcmToken;

        if (!fcmToken) {
            continue;
        }

        const message: admin.messaging.Message = {
            notification,
            token: fcmToken,
        };

        await admin.messaging().send(message);
    }
});
