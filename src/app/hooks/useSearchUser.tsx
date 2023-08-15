import { and, collection, doc, getDoc, getDocs, limit, or, query, where } from 'firebase/firestore';
import React from 'react';

import { firestore } from '@/lib/firebase';

import { friendRequestMapper } from '@/app/infra/mappers/FriendRequestMapper';
import { indexMapper } from '@/app/infra/mappers/IndexMapper';
import { userMapper } from '@/app/infra/mappers/UserMapper';
import { FriendRequest } from '@/app/infra/models/FriendRequest';
import { User } from '@/app/infra/models/User';

import useAppData from './useAppData';

export default function useSearchUser() {
    const { user } = useAppData();
    const [foundUser, setFoundUser] = React.useState<User | undefined>();
    const [friendRequest, setFriendRequest] = React.useState<FriendRequest | undefined>();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [nickname, setNickname] = React.useState<string>('');

    const searchUser = React.useCallback(async () => {
        setLoading(true);

        if (!user.data?.nickname || !user.data.id) return;

        if (nickname === user.data.nickname) return;

        const indexDocRef = doc(firestore, 'index', 'user', 'nickname', nickname).withConverter(indexMapper);
        const indexDoc = await getDoc(indexDocRef);

        if (!indexDoc.exists()) return;

        const authUserDocRef = doc(firestore, 'users', user.data?.id);
        const userDocRef = indexDoc.data().ref.withConverter(userMapper);
        const userDoc = await getDoc(userDocRef);

        setFoundUser(userDoc.data());

        if (!userDoc.exists()) return;

        const friendRequestsCollectionRef = collection(firestore, 'friendRequests').withConverter(friendRequestMapper);
        const friendRequestsQuery = query(
            friendRequestsCollectionRef,
            and(
                or(where('sender', '==', userDocRef), where('receiver', '==', userDocRef)),
                or(where('sender', '==', authUserDocRef), where('receiver', '==', authUserDocRef)),
            ),
            limit(1),
        );

        const friendRequests = await getDocs(friendRequestsQuery);

        setFriendRequest(friendRequests.docs[0]?.data());
    }, [nickname, user.data?.nickname, user.data?.id]);

    React.useEffect(() => {
        setFoundUser(undefined);
        setFriendRequest(undefined);

        const timeout = setTimeout(() => {
            if (nickname.length > 3) {
                searchUser().finally(() => setLoading(false));
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchUser, nickname]);

    return { foundUser, friendRequest, loading, setNickname };
}
