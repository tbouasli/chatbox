import UserItem from '@/shared/components/molecule/UserItem';

import useCreateChat from '@/app/hooks/useCreateChat';
import useFriendsData from '@/app/hooks/useFriendsData';

function FriendList() {
    const { data, loading } = useFriendsData();
    const { createChat } = useCreateChat();

    if (loading) {
        return Array.from({ length: 5 }).map((_, index) => <UserItem key={index} loading />);
    }

    return data?.map((friend) => (
        <UserItem
            key={friend.id}
            displayName={friend.displayName}
            nickname={friend.nickname}
            photoURL={friend.photoURL}
            onClick={() => createChat(friend)}
        />
    ));
}
export default FriendList;
