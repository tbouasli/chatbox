import {
    DocumentData,
    DocumentReference,
    collection,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    startAfter,
    where,
} from 'firebase/firestore';
import React from 'react';

import { firestore } from '@/lib/firebase';

import { messageConverter } from '@/app/infra/converter/MessageConverter';
import { Message } from '@/app/infra/models/Message';

export default function useMessages(chatId?: string) {
    const PAGE_SIZE = 20;
    const sort = (a: Message, b: Message) => b.createdAt.toMillis() - a.createdAt.toMillis();

    const [lastMessageDocRef, setLastMessageDocRef] = React.useState<DocumentData | DocumentReference | null>(null);
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [loading, setLoading] = React.useState(false);

    const subscribeToMessages = React.useCallback(() => {
        try {
            if (!chatId) return;

            const messagesQuery = query(
                collection(firestore, 'chats', chatId, 'messages').withConverter(messageConverter),
                orderBy('createdAt', 'desc'),
                limit(PAGE_SIZE),
            );

            const subscription = onSnapshot(messagesQuery, (snapshot) => {
                const messagesData = snapshot.docs.map((doc) => doc.data());

                setMessages(messagesData.sort(sort));

                if (messagesData.length > 0) {
                    setLastMessageDocRef(snapshot.docs[snapshot.docs.length - 1]);
                }
            });

            return () => subscription();
        } catch (e) {
            console.log(e);
        }
    }, [chatId]);

    const getMoreMessages = React.useCallback(async () => {
        if (!chatId || !lastMessageDocRef) return;

        setLoading(true);

        const messagesQuery = query(
            collection(firestore, 'chats', chatId, 'messages').withConverter(messageConverter),
            where('chatId', '==', chatId),
            orderBy('createdAt', 'desc'),
            startAfter(lastMessageDocRef),
            limit(PAGE_SIZE),
        );

        const messagesSnapshot = await getDocs(messagesQuery);

        const messagesData = messagesSnapshot.docs.map((doc) => doc.data());

        setMessages((prevMessages) => [...prevMessages, ...messagesData].sort(sort));

        if (messagesData.length > 0) {
            setLastMessageDocRef(messagesSnapshot.docs[messagesSnapshot.docs.length - 1]);
        }

        setLoading(false);
    }, [chatId, lastMessageDocRef]);

    React.useEffect(() => {
        const unsubscribe = subscribeToMessages();

        return () => unsubscribe && unsubscribe();
    }, [subscribeToMessages]);

    return { messages, loading, getMoreMessages };
}
