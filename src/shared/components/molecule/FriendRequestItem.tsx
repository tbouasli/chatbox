import { Button } from '@/shared/components/ui/button';

import useFriendship from '@/app/hooks/useFriendship';
import { FriendshipData } from '@/app/hooks/useFriendshipData';

import UserItem from './UserItem';

interface UserFoundProps {
    friendRequest: FriendshipData;
    loading: boolean;
}

function FriendRequestItem({ loading, friendRequest }: UserFoundProps) {
    const { acceptFriendship, rejectFriendship } = useFriendship();

    return (
        <UserItem
            displayName={friendRequest?.displayName}
            nickname={friendRequest?.nickname}
            photoURL={friendRequest?.photoURL}
            loading={loading}
        >
            <Button
                size="sm"
                variant="destructive"
                onClick={() =>
                    rejectFriendship({
                        friendshipId: friendRequest.id,
                    })
                }
            >
                Reject
            </Button>
            <Button
                size="sm"
                onClick={() =>
                    acceptFriendship({
                        friendshipId: friendRequest.id,
                    })
                }
            >
                Accept
            </Button>
        </UserItem>
    );
}
export default FriendRequestItem;
