import { and, collection, onSnapshot, query, where } from 'firebase/firestore';
import React from 'react';

import { firestore } from '@/lib/firebase';

import useAppData from '@/app/hooks/useAppData';
import useFriendship from '@/app/hooks/useFriendship';
import { friendshipConverter } from '@/app/infra/converter/FriendshipConverter';
import { Friendship } from '@/app/infra/models/Friendship';
import { User } from '@/app/infra/models/User';

import { Button } from '../ui/button';
import UserItem from './UserItem';

interface UserFoundItemProps {
    user?: User;
    loading: boolean;
}

function UserFoundItem({ user, loading }: UserFoundItemProps) {
    const { user: userData } = useAppData();
    const [friendship, setFriendship] = React.useState<Friendship>();

    React.useEffect(() => {
        if (!user || !userData.data?.id) return;

        const collectionRef = collection(firestore, 'friendships').withConverter(friendshipConverter);
        const queryRef = query(
            collectionRef,
            and(where('users', 'array-contains', user?.id), where('users', 'array-contains', userData.data?.id)),
        );

        const unsubscribe = onSnapshot(queryRef, (snapshot) => {
            if (snapshot.empty) {
                return;
            }

            const friendship = snapshot.docs[0].data();

            setFriendship(friendship);
        });

        return () => {
            unsubscribe();
        };
    }, [user, userData.data?.id]);

    if (!user && !loading) {
        return null;
    }

    return (
        <UserItem displayName={user?.displayName} nickname={user?.nickname} photoURL={user?.photoURL} loading={loading}>
            <UserItemContent friendship={friendship} />
        </UserItem>
    );
}

function UserItemContent({ friendship, user }: { friendship?: Friendship; user?: User }) {
    const { requestFriendship, acceptFriendship } = useFriendship();

    const requestFriendshipHandler = React.useCallback(async () => {
        if (!user) {
            return;
        }

        try {
            await requestFriendship({ friendUid: user.id });
        } catch (error) {
            console.error(error);
        }
    }, [requestFriendship, user]);

    if (!friendship || friendship?.status === 'rejected') {
        return <Button onClick={requestFriendshipHandler}>Add Friend</Button>;
    }

    if (friendship.status === 'pending') {
        if (friendship.senderId !== user?.id) {
            return (
                <>
                    <Button onClick={() => acceptFriendship({ friendshipId: friendship.id })}>Accept</Button>
                    <Button onClick={() => acceptFriendship({ friendshipId: friendship.id })}>Reject</Button>
                </>
            );
        }

        return <Button disabled={true}>Pending</Button>;
    }

    if (friendship.status === 'accepted') {
        return <Button disabled={true}>Friends</Button>;
    }
}

export default UserFoundItem;
