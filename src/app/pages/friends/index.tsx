import FriendRequests from '@/shared/components/molecule/FriendRequests';
import FriendList from '@/shared/components/organism/FriendList';
import FriendsHeader from '@/shared/components/organism/FriendsHeader';

function FriendsPage() {
    return (
        <main className="page">
            <FriendsHeader />
            <FriendRequests />
            <FriendList />
        </main>
    );
}
export default FriendsPage;
