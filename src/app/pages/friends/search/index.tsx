import { collection, getDocs, query, where } from 'firebase/firestore';
import React from 'react';

import { firestore } from '@/lib/firebase';

import UserFoundItem from '@/shared/components/molecule/UserFoundItem';
import SearchUserHeader from '@/shared/components/organism/AddFriendsHeader';
import useLoadingBuffer from '@/shared/hooks/useLoadingBuffer';

import useAppData from '@/app/hooks/useAppData';
import { userConverter } from '@/app/infra/converter/UserConverter';
import { User } from '@/app/infra/models/User';

function SearchUserPage() {
    const {
        user: { data: userData },
    } = useAppData();
    const { loading, setLoading } = useLoadingBuffer();
    const [user, setUser] = React.useState<User>();
    const [nickname, setNickname] = React.useState('');

    const searchUser = React.useCallback(async () => {
        try {
            setLoading(true);
            const collectionRef = collection(firestore, 'users').withConverter(userConverter);
            const queryRef = query(collectionRef, where('nickname', '==', nickname));

            const snapshot = await getDocs(queryRef);

            if (snapshot.empty) {
                setUser(undefined);
                return;
            }

            const user = snapshot.docs[0].data();

            if (user.id === userData?.id) {
                setUser(undefined);
                return;
            }

            setUser(user);
        } finally {
            setLoading(false);
        }
    }, [nickname, setLoading]);

    React.useEffect(() => {
        searchUser();
    }, [searchUser]);

    return (
        <main className="page">
            <SearchUserHeader setNickname={setNickname} />
            <UserFoundItem user={user} loading={loading} />
        </main>
    );
}
export default SearchUserPage;
