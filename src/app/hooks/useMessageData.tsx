import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React from 'react';

import { firestore } from '@/lib/firebase';

import { messageMapper } from '@/app/infra/mappers/MessageMapper';
import { Message } from '@/app/infra/models/Message';

export default function useChatMessages(id: string) {
    const [data, setData] = React.useState<Message[]>([]);

    const messagesCollectionRef = collection(firestore, 'chats', id, 'messages').withConverter(messageMapper);

    const subscribeToNewMessages = React.useCallback(() => {
        return onSnapshot(query(messagesCollectionRef, orderBy('createdAt', 'desc')), (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    setData((prev) => prev.concat(change.doc.data()).sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()));
                }
            });
        });
    }, [messagesCollectionRef]);

    React.useEffect(() => {
        const unsubscribe = subscribeToNewMessages();

        return () => {
            unsubscribe();
        };
    }, []);

    return { data };
}
