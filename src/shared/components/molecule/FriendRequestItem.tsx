import { Button } from '@/shared/components/ui/button';

import useAnswerFriendRequest from '@/app/hooks/useAnswerFriendRequest';
import { FriendRequest as FriendRequestModel } from '@/app/infra/models/FriendRequest';

import UserItem from './UserItem';

interface UserFoundProps {
    friendRequest: FriendRequestModel;
    loading: boolean;
}

function FriendRequestItem({ loading, friendRequest }: UserFoundProps) {
    const { acceptFriendRequest, rejectFriendRequest } = useAnswerFriendRequest(friendRequest);

    return (
        <UserItem
            displayName={friendRequest?.senderDisplayName}
            nickname={friendRequest?.senderNickname}
            photoURL={friendRequest?.senderPhotoURL}
            loading={loading}
        >
            <Button size="sm" variant="destructive" onClick={rejectFriendRequest}>
                Reject
            </Button>
            <Button size="sm" onClick={acceptFriendRequest}>
                Accept
            </Button>
        </UserItem>
    );
}
export default FriendRequestItem;
