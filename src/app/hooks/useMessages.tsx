import { DocumentData, DocumentReference, collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
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

    const getInitialMessages = React.useCallback(async () => {
        if (!chatId) return;

        setLoading(true);

        const messagesQuery = query(
            collection(firestore, 'messages').withConverter(messageConverter),
            where('chatId', '==', chatId),
            orderBy('createdAt', 'desc'),
            limit(PAGE_SIZE),
        );

        const messagesSnapshot = await getDocs(messagesQuery);

        const messagesData = messagesSnapshot.docs.map((doc) => doc.data());

        setMessages(messagesData);

        console.log('ran getInitialMessages');

        if (messagesData.length > 0) {
            setLastMessageDocRef(messagesSnapshot.docs[messagesSnapshot.docs.length - 1]);
        }

        setLoading(false);
    }, [chatId]);

    const getMoreMessages = React.useCallback(async () => {
        if (!chatId || !lastMessageDocRef) return;

        setLoading(true);

        const messagesQuery = query(
            collection(firestore, 'messages').withConverter(messageConverter),
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

        console.log('ran getMoreMessages');
    }, [chatId, lastMessageDocRef]);

    React.useEffect(() => {
        getInitialMessages();
    }, [getInitialMessages]);

    return { messages, loading, getMoreMessages };
}
