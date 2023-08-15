import { doc, writeBatch } from 'firebase/firestore';
import React from 'react';

import { firestore } from '@/lib/firebase';

import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/use-toast';

import useAppData from '@/app/hooks/useAppData';
import { friendRequestMapper } from '@/app/infra/mappers/FriendRequestMapper';
import { userMapper } from '@/app/infra/mappers/UserMapper';
import { FriendRequest } from '@/app/infra/models/FriendRequest';
import { User } from '@/app/infra/models/User';

import UserItem from './UserItem';

interface UserFoundProps {
    user?: User;
    loading: boolean;
    friendRequest?: FriendRequest;
}

function UserFound({ user, loading, friendRequest }: UserFoundProps) {
    const [sent, setSent] = React.useState<boolean>(false);
    const {
        user: { data: userData, loading: userLoading },
    } = useAppData();

    const { toast } = useToast();

    async function sendFriendRequest() {
        if (!userData || !user) return;

        const senderDocRef = doc(firestore, 'users', userData?.id);
        const receiverDocRef = doc(firestore, 'users', user?.id);

        const friendRequest = new FriendRequest({
            senderPhotoURL: userData?.photoURL,
            senderDisplayName: userData?.displayName,
            senderNickname: userData?.nickname,
            sender: senderDocRef,
            receiver: receiverDocRef,
            status: 'pending',
        });

        const batch = writeBatch(firestore);

        const friendRequestDocRef = doc(firestore, 'friendRequests', friendRequest.id);

        batch.set(friendRequestDocRef.withConverter(friendRequestMapper), friendRequest);

        user.addFriendRequestReceived(friendRequestDocRef);

        batch.update(receiverDocRef, userMapper.toFirestore(user));

        setSent(true);

        try {
            await batch.commit();
        } catch (error) {
            setSent(false);
            toast({
                title: 'Error',
                description: 'Something went wrong, please try again later.',
            });
        }
    }

    function getMessage() {
        if (sent) return 'Sent';

        if (friendRequest?.sender.id !== userData?.id) {
            if (friendRequest?.status === 'pending') {
                return 'Received';
            }
        }

        switch (friendRequest?.status) {
            case 'pending':
                return 'Sent';
            case 'accepted':
                return 'Added';
            default:
            case 'rejected':
                return 'Add';
        }
    }

    return (
        <UserItem displayName={user?.displayName} nickname={user?.nickname} photoURL={user?.photoURL} loading={loading}>
            <Button
                size="sm"
                disabled={sent || userLoading || loading || (friendRequest && friendRequest?.status !== 'rejected')}
                onClick={sendFriendRequest}
            >
                {getMessage()}
            </Button>
        </UserItem>
    );
}
export default UserFound;
