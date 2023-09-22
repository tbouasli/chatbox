import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onCall } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2/options';

admin.initializeApp();

const firestore = admin.firestore();
const messaging = admin.messaging();

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
    deviceId: string;
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
        const deviceId = request.data?.deviceId;

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

        if (!deviceId) {
            return {
                message: `You must provide a deviceId`,
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
        };

        await firestore.doc(`users/${uid}`).set(user);

        if (fcmToken) {
            const token = {
                token: fcmToken,
                deviceId,
                createdAt: Timestamp.now(),
                lastUsedAt: Timestamp.now(),
            };

            await firestore.doc(`users/${uid}/fcm_tokens/${fcmToken}`).set(token);
        }

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

export const onMessageSent = onDocumentCreated('/chats/{chatId}/messages/{messageId}', async (event) => {
    const chatId = event.params.chatId;

    const chatDoc = await firestore.doc(`chats/${chatId}`).get();

    if (!chatDoc.exists) {
        return;
    }

    const chat = chatDoc.data();

    const membersIds = chat?.members;

    if (!membersIds) {
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

    const filteredMembersIds = membersIds.filter((id: string) => id !== senderId);

    messaging.sendEachForMulticast({
        tokens: filteredMembersIds,
        data: {
            title: sender.displayName,
            body: message.text,
        },
        notification: {
            body: message.text,
            title: sender.displayName,
        },
    });

    return;
});
