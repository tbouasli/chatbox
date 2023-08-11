import UserItem from '@/shared/components/molecule/UserItem';
import AddFriendsHeader from '@/shared/components/organism/AddFriendsHeader';

import useSearchUser from '@/app/hooks/useSearchUser';

function AddFriends() {
    const { setNickname, user, loading } = useSearchUser();

    return (
        <main className="h-full w-full flex flex-col">
            <AddFriendsHeader setNickname={setNickname} />
            <UserItem user={user} loading={loading} />
        </main>
    );
}

export default AddFriends;
