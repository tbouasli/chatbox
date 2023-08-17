import {
    Timestamp,
    collection,
    doc,
    getDocFromCache,
    getDocFromServer,
    getDocsFromCache,
    getDocsFromServer,
    limit,
    orderBy,
    query,
    where,
} from 'firebase/firestore';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { auth, firestore } from '@/lib/firebase';

import { chatMapper } from '@/app/infra/mappers/ChatMapper';
import { userMapper } from '@/app/infra/mappers/UserMapper';
import { Chat } from '@/app/infra/models/Chat';

import { messageMapper } from '../infra/mappers/MessageMapper';

export interface ChatDTO {
    id: string;
    displayName: string;
    nickname: string;
    photoURL: string;
    lastMessage?: string;
    lastMessageTimestamp?: Timestamp;
}

export default function useChatsData() {
    const [dataLoading, setDataLoading] = React.useState(true);
    const [data, setData] = React.useState<ChatDTO[] | null>(null);
    const [authUser, authUserLoading] = useAuthState(auth);

    const userRef = doc(firestore, 'users', authUser?.uid ?? 'loading');
    const chatsCollectionRef = collection(firestore, 'chats');

    const chatsQuery = query(chatsCollectionRef, where('members', 'array-contains', userRef));

    const [chatData, chatDataLoading] = useCollectionData(chatsQuery?.withConverter(chatMapper));

    const getChatData = React.useCallback(
        async (chat: Chat, from: 'cache' | 'server'): Promise<ChatDTO> => {
            const memberRef = chat.members?.find((member) => member.id !== authUser?.uid);

            if (!memberRef) {
                throw new Error('Member not found');
            }

            const memberDoc =
                from === 'cache'
                    ? await getDocFromCache(memberRef.withConverter(userMapper))
                    : await getDocFromServer(memberRef.withConverter(userMapper));

            if (!memberDoc.exists()) {
                throw new Error('Member not found');
            }

            const memberData = memberDoc.data();

            const chatRef = doc(firestore, 'chats', chat.id);
            const messageCollectionRef = collection(firestore, 'messages').withConverter(messageMapper);
            const messageQuery = query(messageCollectionRef, where('chat', '==', chatRef), orderBy('createdAt', 'desc'), limit(1));

            const messageDocs = from === 'cache' ? await getDocsFromCache(messageQuery) : await getDocsFromServer(messageQuery);

            const lastMessageDoc = messageDocs.docs[0]?.data();

            const lastMessageData = lastMessageDoc?.content ?? undefined;
            const lastMessageTimestamp = lastMessageDoc?.createdAt ?? undefined;

            return {
                id: chat.id,
                displayName: memberData.displayName,
                nickname: memberData.nickname,
                photoURL: memberData.photoURL,
                lastMessage: lastMessageData,
                lastMessageTimestamp: lastMessageTimestamp,
            };
        },
        [authUser?.uid],
    );

    const getData = React.useCallback(async () => {
        try {
            setDataLoading(true);
            if (!chatData) {
                throw new Error('Chat data not found');
            }

            const getMemberDataPromises = chatData.map((chat) => getChatData(chat, 'cache'));
            const chats = await Promise.all(getMemberDataPromises);

            setData(chats);
        } catch {
            const getMemberDataPromises = chatData?.map((chat) => getChatData(chat, 'server'));
            const chats = await Promise.all(getMemberDataPromises ?? []);

            setData(chats);
        } finally {
            setDataLoading(false);
        }
    }, [chatData, getChatData]);

    React.useEffect(() => {
        getData();
    }, [getData]);

    const loading = authUserLoading || chatDataLoading || dataLoading;

    return { data, loading };
}
