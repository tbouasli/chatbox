import FriendRequestItem from '@/shared/components/molecule/FriendRequestItem';
import FriendsRequestsHeader from '@/shared/components/organism/FriendRequestsHeader';

import useFriendRequestsData from '@/app/hooks/useFriendRequestsData';

function FriendRequests() {
    const { data } = useFriendRequestsData();

    return (
        <main className="h-full w-full flex flex-col">
            <FriendsRequestsHeader />
            <div>{data?.map((d) => <FriendRequestItem friendRequest={d} loading={false} />)}</div>
        </main>
    );
}
export default FriendRequests;
