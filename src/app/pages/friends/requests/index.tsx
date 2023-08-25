import FriendRequestList from '@/app/components/organism/FriendRequestList';
import FriendsRequestsHeader from '@/app/components/organism/FriendRequestsHeader';

function FriendRequestsPage() {
    return (
        <main className="page">
            <FriendsRequestsHeader />
            <FriendRequestList />
        </main>
    );
}
export default FriendRequestsPage;
