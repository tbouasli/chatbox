import FriendRequestList from '@/shared/components/organism/FriendRequestList';
import FriendsRequestsHeader from '@/shared/components/organism/FriendRequestsHeader';

function FriendRequestsPage() {
    return (
        <main className="page">
            <FriendsRequestsHeader />
            <FriendRequestList />
        </main>
    );
}
export default FriendRequestsPage;
