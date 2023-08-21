import { doc, getDocFromCache, getDocFromServer } from 'firebase/firestore';
import React from 'react';

import { firestore } from '@/lib/firebase';

import useLoadingBuffer from '@/shared/hooks/useLoadingBuffer';

import { chatMapper } from '../infra/mappers/ChatMapper';
import { Chat } from '../infra/models/Chat';

export default function useChatData(id: string) {
    const [data, setData] = React.useState<Chat>();
    const { buffer: dataLoading, setLoading: setDataLoading } = useLoadingBuffer();

    const getChatData = React.useCallback(
        async (from: 'cache' | 'server') => {
            const chatRef = doc(firestore, 'chats', id).withConverter(chatMapper);

            const chatSnapshot = from === 'cache' ? await getDocFromCache(chatRef) : await getDocFromServer(chatRef);

            if (!chatSnapshot.exists()) return; //TODO add error handling

            const chat = chatSnapshot.data();

            setData(chat);
        },
        [id],
    );

    const getData = React.useCallback(async () => {
        try {
            setDataLoading(true);
            await getChatData('cache');
        } catch (e) {
            await getChatData('server');
        } finally {
            setDataLoading(false);
        }
    }, [getChatData, setDataLoading]);

    React.useEffect(() => {
        getData();
    }, [getData]);

    return { data, loading: dataLoading };
}
