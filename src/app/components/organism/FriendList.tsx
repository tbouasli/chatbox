import UserItem from '@/app/components/molecule/UserItem';
import useAppData from '@/app/hooks/useAppData';
import useChat from '@/app/hooks/useChat';

function FriendList() {
    const { createChat } = useChat();

    const { friendships } = useAppData();
    const { loading, data } = friendships;

    if (loading) {
        return Array.from({ length: 3 }).map((_, index) => <UserItem key={index} loading />);
    }

    return data
        ?.filter((friendship) => friendship.status === 'accepted')
        .map((friendship) => (
            <UserItem
                key={friendship.id}
                displayName={friendship.displayName}
                nickname={friendship.nickname}
                photoURL={friendship.photoURL}
                onClick={() => createChat({ friendshipId: friendship.id })}
            />
        ));
}
export default FriendList;
