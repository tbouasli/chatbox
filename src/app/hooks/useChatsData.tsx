import { Timestamp, collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
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
    const [data, setData] = React.useState<ChatDTO[] | null>(null);
    const [authUser, authUserLoading] = useAuthState(auth);

    const userRef = doc(firestore, 'users', authUser?.uid ?? 'loading');
    const chatsCollectionRef = collection(firestore, 'chats');

    const chatsQuery = query(chatsCollectionRef, where('members', 'array-contains', userRef));

    const [chatData, chatDataLoading] = useCollectionData(chatsQuery?.withConverter(chatMapper));

    const getData = React.useCallback(
        async (chat: Chat): Promise<ChatDTO> => {
            const memberRef = chat.members?.find((member) => member.id !== authUser?.uid);

            if (!memberRef) {
                throw new Error('Member not found');
            }

            const memberDoc = await getDoc(memberRef.withConverter(userMapper));

            if (!memberDoc.exists()) {
                throw new Error('Member not found');
            }

            const memberData = memberDoc.data();

            const chatRef = doc(firestore, 'chats', chat.id);
            const messageCollectionRef = collection(firestore, 'messages').withConverter(messageMapper);
            const messageQuery = query(messageCollectionRef, where('chat', '==', chatRef), orderBy('createdAt', 'desc'), limit(1));

            const messageDocs = await getDocs(messageQuery);

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

    React.useEffect(() => {
        if (!chatData) {
            return;
        }

        const getMemberDataPromises = chatData.map(getData);

        Promise.all(getMemberDataPromises).then((chats) => {
            setData(chats);
        });
    }, [chatData, getData]);

    const loading = authUserLoading || chatDataLoading;

    return { data, loading };
}
