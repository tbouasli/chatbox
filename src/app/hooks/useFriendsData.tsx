import { DocumentReference, doc, getDoc } from 'firebase/firestore';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, firestore } from '@/lib/firebase';

import useLoadingBuffer from '@/shared/hooks/useLoadingBuffer';

import { userMapper } from '@/app/infra/mappers/UserMapper';
import { User } from '@/app/infra/models/User';

export default function useFriendsData() {
    const [data, setData] = React.useState<User[]>();
    const { buffer, setLoading } = useLoadingBuffer();
    const [authUser, authUserLoading] = useAuthState(auth);

    const getFriendsData = React.useCallback(async () => {
        if (!authUser) return;

        const userDoc = await getDoc(doc(firestore, 'users', authUser?.uid).withConverter(userMapper));

        if (!userDoc.exists()) return;

        const friends = userDoc.data().friends;

        const friendsData = await Promise.all(
            friends.map(async (friend: DocumentReference) => {
                const friendDoc = await getDoc(friend.withConverter(userMapper));

                if (!friendDoc.exists()) return;

                return friendDoc.data();
            }),
        );

        const filteredFriendsData = friendsData.filter((friend: User | undefined) => friend) as User[];

        setData(filteredFriendsData);
    }, [authUser]);

    React.useEffect(() => {
        setLoading(true);
        getFriendsData().finally(() => setLoading(false));
    }, [getFriendsData, setLoading]);

    const loading = authUserLoading || buffer;

    return { data, loading };
}
