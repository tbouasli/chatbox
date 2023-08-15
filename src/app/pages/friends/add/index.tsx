import UserFoundItem from '@/shared/components/molecule/UserFoundItem';
import AddFriendsHeader from '@/shared/components/organism/AddFriendsHeader';

import useSearchUser from '@/app/hooks/useSearchUser';

function AddFriends() {
    const { foundUser, friendRequest, loading, setNickname } = useSearchUser();

    return (
        <main className="h-full w-full flex flex-col">
            <AddFriendsHeader setNickname={setNickname} />
            <UserFoundItem user={foundUser} loading={loading} friendRequest={friendRequest} />
        </main>
    );
}

export default AddFriends;
