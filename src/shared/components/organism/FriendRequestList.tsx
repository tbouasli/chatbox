import useAppData from '@/app/hooks/useAppData';

import FriendRequestItem from '../molecule/FriendRequestItem';

function FriendRequestList() {
    const { friendships } = useAppData();

    return friendships.data
        ?.filter((friend) => friend.status === 'pending')
        .map((friendRequest) => <FriendRequestItem friendRequest={friendRequest} key={friendRequest.id} loading={friendships.loading} />);
}
export default FriendRequestList;
