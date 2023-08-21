import {
    DocumentData,
    QueryDocumentSnapshot,
    collection,
    getDocs,
    getDocsFromCache,
    limit,
    onSnapshot,
    orderBy,
    query,
    startAfter,
} from 'firebase/firestore';
import React from 'react';

import { firestore } from '@/lib/firebase';

import useLoadingBuffer from '@/shared/hooks/useLoadingBuffer';

import { messageMapper } from '@/app/infra/mappers/MessageMapper';
import { Message } from '@/app/infra/models/Message';

export default function useChatMessages(id: string) {
    const oldestMessageReference = React.useRef();
    const PAGE_SIZE = 50;

    const [lastVisible, setLastVisible] = React.useState<QueryDocumentSnapshot<Message, DocumentData>>();
    const [data, setData] = React.useState<Message[]>([]);
    const { buffer: dataLoading, setLoading: setDataLoading } = useLoadingBuffer();

    const messagesCollectionRef = collection(firestore, 'chats', id, 'messages').withConverter(messageMapper);

    const fetchPaginatedMessages = React.useCallback(
        async (from: 'cache' | 'server') => {
            const queryRef = query(messagesCollectionRef, limit(PAGE_SIZE), startAfter(lastVisible), orderBy('createdAt', 'desc'));

            const messagesSnapshot = from === 'cache' ? await getDocsFromCache(queryRef) : await getDocs(queryRef);

            const messages = messagesSnapshot.docs.filter((doc) => doc.exists()).map((doc) => doc.data());

            setData((prev) => prev.concat(messages).sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()));

            const _lastVisible = messagesSnapshot.docs[messagesSnapshot.docs.length - 1];
            setLastVisible(_lastVisible);
        },
        [lastVisible, messagesCollectionRef],
    );

    const subscribeToNewMessages = React.useCallback(() => {
        return onSnapshot(query(messagesCollectionRef, limit(PAGE_SIZE), orderBy('createdAt', 'desc')), (snapshot) => {
            const messages = snapshot.docs.map((doc) => doc.data());
            setData((prev) => prev.concat(messages).sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()));
        });
    }, [messagesCollectionRef]);

    const getData = React.useCallback(async () => {
        try {
            setDataLoading(true);
            await fetchPaginatedMessages('cache');
        } catch (e) {
            await fetchPaginatedMessages('server');
        } finally {
            setDataLoading(false);
        }
    }, [fetchPaginatedMessages, setDataLoading]);

    React.useEffect(() => {
        const unsubscribe = subscribeToNewMessages();

        return () => {
            unsubscribe();
        };
    }, []);

    React.useEffect(() => {
        if (!oldestMessageReference.current) return;

        const observer = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting) {
                await getData();
            }
        });

        observer.observe(oldestMessageReference.current);

        return () => {
            observer.disconnect();
        };
    }, [getData, oldestMessageReference]);

    return { data, loading: dataLoading };
}
