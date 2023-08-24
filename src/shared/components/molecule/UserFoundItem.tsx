import React from 'react';

import useFriendship from '@/app/hooks/useFriendship';
import { User } from '@/app/infra/models/User';

import { Button } from '../ui/button';
import UserItem from './UserItem';

interface UserFoundItemProps {
    user?: User;
    loading: boolean;
}

function UserFoundItem({ user, loading }: UserFoundItemProps) {
    const { requestFriendship } = useFriendship();

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

    if (!user && !loading) {
        return null;
    }

    return (
        <UserItem displayName={user?.displayName} nickname={user?.nickname} photoURL={user?.photoURL} loading={loading}>
            <Button onClick={requestFriendshipHandler}>Add Friend</Button>
        </UserItem>
    );
}
export default UserFoundItem;
