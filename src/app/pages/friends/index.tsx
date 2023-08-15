import FriendRequests from '@/shared/components/molecule/FriendRequests';
import FriendList from '@/shared/components/organism/FriendList';
import FriendsHeader from '@/shared/components/organism/FriendsHeader';

function Friends() {
    return (
        <main className="h-full w-full flex flex-col">
            <FriendsHeader />
            <FriendRequests />
            <FriendList />
        </main>
    );
}

export default Friends;
