import FriendRequests from '@/shared/components/molecule/FriendRequests';
import FriendsHeader from '@/shared/components/organism/FriendsHeader';

function Friends() {
    return (
        <main className="h-full w-full flex flex-col">
            <FriendsHeader />
            <FriendRequests />
        </main>
    );
}

export default Friends;
