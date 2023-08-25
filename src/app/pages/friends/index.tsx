import FriendRequestsNotification from '@/app/components/molecule/FriendRequests';
import FriendList from '@/app/components/organism/FriendList';
import FriendsHeader from '@/app/components/organism/FriendsHeader';

function FriendsPage() {
    return (
        <main className="page">
            <FriendsHeader />
            <FriendRequestsNotification />
            <FriendList />
        </main>
    );
}
export default FriendsPage;
