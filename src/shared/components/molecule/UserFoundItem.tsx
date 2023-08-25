import { Check, Clock, Trash, UserCheck2, UserPlus } from 'lucide-react';
import React from 'react';

import useAppData from '@/app/hooks/useAppData';
import useFriendship from '@/app/hooks/useFriendship';
import { FriendshipData } from '@/app/hooks/useFriendshipData';
import { User } from '@/app/infra/models/User';

import { Button } from '../ui/button';
import UserItem from './UserItem';

interface UserFoundItemProps {
    user?: User;
    loading: boolean;
}

function UserFoundItem({ user, loading }: UserFoundItemProps) {
    const { user: userData, friendships } = useAppData();
    const [friendship, setFriendship] = React.useState<FriendshipData>();

    React.useEffect(() => {
        if (!user || !userData) {
            return;
        }

        const friendship = friendships?.data?.find((friendship) => friendship.friendId === user.id);

        setFriendship(friendship);

        return () => {
            setFriendship(undefined);
        };
    }, [friendships, user, userData]);

    if (!user && !loading) {
        return null;
    }

    return (
        <UserItem displayName={user?.displayName} nickname={user?.nickname} photoURL={user?.photoURL} loading={loading}>
            <UserItemContent friendship={friendship} user={user} />
        </UserItem>
    );
}

function UserItemContent({ friendship, user }: { friendship?: FriendshipData; user?: User }) {
    const { requestFriendship, acceptFriendship, rejectFriendship } = useFriendship();

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
        return (
            <Button onClick={requestFriendshipHandler}>
                <UserPlus className="text-primary-foreground" height={16} width={16} />
            </Button>
        );
    }

    if (friendship.status === 'pending') {
        if (friendship.type === 'received') {
            return (
                <div className="flex gap-2">
                    <Button
                        className="h-8 aspect-square p-2"
                        variant="destructive"
                        onClick={() => rejectFriendship({ friendshipId: friendship.id })}
                    >
                        <Trash className="text-primary-foreground" height={16} width={16} />
                    </Button>
                    <Button className="h-8 aspect-square p-2" onClick={() => acceptFriendship({ friendshipId: friendship.id })}>
                        <Check className="text-primary-foreground" height={16} width={16} />
                    </Button>
                </div>
            );
        }

        return (
            <Button disabled={true}>
                <Clock className="text-primary-foreground" height={16} width={16} />
            </Button>
        );
    }

    if (friendship.status === 'accepted') {
        return (
            <Button disabled={true}>
                <UserCheck2 className="text-primary-foreground" height={16} width={16} />
            </Button>
        );
    }
}

export default UserFoundItem;
