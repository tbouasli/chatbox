import { doc, getDoc, writeBatch } from 'firebase/firestore';
import React from 'react';

import { firestore } from '@/lib/firebase';

import { friendRequestMapper } from '@/app/infra/mappers/FriendRequestMapper';
import { userMapper } from '@/app/infra/mappers/UserMapper';
import { FriendRequest } from '@/app/infra/models/FriendRequest';

function useAnswerFriendRequest(friendRequest: FriendRequest) {
    const acceptFriendRequest = React.useCallback(async () => {
        if (friendRequest.status !== 'pending') {
            return;
        }

        const batch = writeBatch(firestore);

        const friendRequestRef = doc(firestore, 'friendRequests', friendRequest.id);

        friendRequest.accept();

        batch.update(friendRequestRef, friendRequestMapper.toFirestore(friendRequest));

        const senderRef = friendRequest.sender.withConverter(userMapper);
        const receiverRef = friendRequest.receiver.withConverter(userMapper);

        const senderDoc = await getDoc(senderRef);
        const receiverDoc = await getDoc(receiverRef);

        if (!senderDoc.exists() || !receiverDoc.exists()) {
            return;
        }

        const sender = senderDoc.data();
        const receiver = receiverDoc.data();

        sender.addFriend(receiverRef);
        receiver.addFriend(senderRef);
        receiver.removeFriendRequestReceived(friendRequestRef);

        batch.update(senderRef, userMapper.toFirestore(sender));
        batch.update(receiverRef, userMapper.toFirestore(receiver));

        await batch.commit();
    }, [friendRequest]);

    const rejectFriendRequest = React.useCallback(async () => {
        if (friendRequest.status !== 'pending') {
            return;
        }

        const batch = writeBatch(firestore);

        const friendRequestRef = doc(firestore, 'friendRequests', friendRequest.id);

        friendRequest.reject();

        batch.update(friendRequestRef, friendRequestMapper.toFirestore(friendRequest));

        const senderRef = friendRequest.sender.withConverter(userMapper);
        const receiverRef = friendRequest.receiver.withConverter(userMapper);

        const senderDoc = await getDoc(senderRef);
        const receiverDoc = await getDoc(receiverRef);

        if (!senderDoc.exists() || !receiverDoc.exists()) {
            return;
        }

        const sender = senderDoc.data();
        const receiver = receiverDoc.data();

        sender.addFriend(receiverRef);
        receiver.addFriend(senderRef);
        receiver.removeFriendRequestReceived(friendRequestRef);

        batch.update(senderRef, userMapper.toFirestore(sender));
        batch.update(receiverRef, userMapper.toFirestore(receiver));

        await batch.commit();
    }, [friendRequest]);

    return {
        acceptFriendRequest,
        rejectFriendRequest,
    };
}

export default useAnswerFriendRequest;
