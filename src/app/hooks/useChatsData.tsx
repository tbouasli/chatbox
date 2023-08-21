import { collection, getDocsFromCache, getDocsFromServer, onSnapshot, query, where } from 'firebase/firestore';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, firestore } from '@/lib/firebase';

import { chatMapper } from '@/app/infra/mappers/ChatMapper';
import { Chat } from '@/app/infra/models/Chat';

export default function useChatsData() {
    const [dataLoading, setDataLoading] = React.useState(true);
    const [data, setData] = React.useState<Chat[] | null>(null);
    const [authUser, authUserLoading] = useAuthState(auth);

    const getChats = React.useCallback(
        async (from: 'cache' | 'server') => {
            const chatsRef = collection(firestore, 'chats').withConverter(chatMapper);

            const chatsQuery = query(chatsRef, where('members', 'array-contains', authUser?.uid));

            const chatsSnapshot = from === 'cache' ? await getDocsFromCache(chatsQuery) : await getDocsFromServer(chatsQuery);

            const chats = chatsSnapshot.docs.filter((doc) => doc.exists()).map((doc) => doc.data());

            setData(chats);
        },
        [authUser?.uid],
    );

    const getData = React.useCallback(async () => {
        try {
            setDataLoading(true);
            await getChats('cache');
        } catch (error) {
            await getChats('server');
        } finally {
            setDataLoading(false);
        }
    }, [getChats]);

    const subscribeToChatUpdates = React.useCallback(() => {
        return onSnapshot(collection(firestore, 'chats').withConverter(chatMapper), (snapshot) => {
            const chats = snapshot.docs.filter((doc) => doc.exists()).map((doc) => doc.data());
            setData(chats);
        });
    }, []);

    React.useEffect(() => {
        getData();
    }, [getData]);

    React.useEffect(() => {
        const unsubscribe = subscribeToChatUpdates();

        return () => {
            unsubscribe();
        };
    }, [subscribeToChatUpdates]);

    const loading = authUserLoading || dataLoading;

    return { data, loading };
}
