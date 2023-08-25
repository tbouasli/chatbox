import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, firestore } from '@/lib/firebase';

import useLoadingBuffer from '@/shared/hooks/useLoadingBuffer';

import { friendshipConverter } from '@/app/infra/converter/FriendshipConverter';
import { userConverter } from '@/app/infra/converter/UserConverter';
import { FriendshipStatus } from '@/app/infra/models/Friendship';
import { User } from '@/app/infra/models/User';

export interface FriendshipData {
    id: string;
    friendId: string;
    displayName: string;
    nickname: string;
    photoURL: string;
    status: FriendshipStatus;
    type: 'sent' | 'received';
}

export interface FriendshipsData {
    data?: FriendshipData[] | null;
    loading: boolean;
}

export default function useFriendshipData(): FriendshipsData {
    const { loading: dataLoading, setLoading: setDataLoading } = useLoadingBuffer();
    const [data, setData] = React.useState<FriendshipData[] | null>(null);
    const [authUser, authUserLoading] = useAuthState(auth);

    const subscribeToUserFriendships = React.useCallback(() => {
        if (!authUser?.uid) return;

        setDataLoading(true);

        const friendshipsCollectionRef = collection(firestore, 'friendships').withConverter(friendshipConverter);

        const friendshipsQuery = query(friendshipsCollectionRef, where('users', 'array-contains', authUser?.uid));

        return onSnapshot(
            friendshipsQuery,
            async (snapshot) => {
                const friendship = snapshot.docs.filter((doc) => doc.exists()).map((doc) => doc.data());

                const friendshipsDocs = friendship.map(async (friendship) => {
                    const friendId = friendship.users.find((userId) => userId !== authUser?.uid) as string; //TODO add error handling and logging

                    const user = await getDoc(doc(firestore, 'users', friendId).withConverter(userConverter));

                    return {
                        user,
                        friendship,
                    };
                });

                const friendships = await Promise.all(friendshipsDocs);

                const friendshipsData = friendships
                    .filter(({ user: docRef }) => docRef.exists())
                    .map(({ friendship, user }) => {
                        const data = user.data() as User;

                        const friendshipData: FriendshipData = {
                            id: friendship.id,
                            friendId: user.id,
                            displayName: data.displayName,
                            nickname: data.nickname,
                            photoURL: data.photoURL,
                            status: friendship.status,
                            type: friendship.users[0] === authUser?.uid ? 'sent' : 'received',
                        };

                        return friendshipData;
                    });

                setData(friendshipsData);
                setDataLoading(false);
            },
            (e) => {
                console.error(e);
                setDataLoading(false);
            },
        );
    }, [authUser?.uid, setDataLoading]);

    React.useEffect(() => {
        const unsubscribe = subscribeToUserFriendships();

        return () => {
            unsubscribe && unsubscribe();
        };
    }, [subscribeToUserFriendships]);

    const loading = authUserLoading || dataLoading;

    return { data, loading };
}
