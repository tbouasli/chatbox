import { Timestamp, collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, firestore } from '@/lib/firebase';

import { chatConverter } from '@/app/infra/converter/ChatConverter';
import { messageConverter } from '@/app/infra/converter/MessageConverter';
import { Chat } from '@/app/infra/models/Chat';
import { Message } from '@/app/infra/models/Message';

export interface ChatData {
    id: string;
    displayName: string;
    photoURL: string;
    lastMessage: string;
    lastMessageTimestamp: Timestamp;
    unreadMessages: number;
}
export interface ChatsData {
    data?: ChatData[] | null;
    loading: boolean;
}

export default function useChatData(): ChatsData {
    const [dataLoading, setDataLoading] = React.useState<boolean>(true);
    const [data, setData] = React.useState<ChatData[] | null>(null);
    const [authUser, authUserLoading] = useAuthState(auth);

    const subscribeToUserChats = React.useCallback(() => {
        if (!authUser?.uid) return;

        setDataLoading(true);

        const chatsRef = collection(firestore, 'chats').withConverter(chatConverter);

        const chatsQuery = query(chatsRef, where('members', 'array-contains', authUser?.uid));

        return onSnapshot(
            chatsQuery,
            async (snapshot) => {
                const chats = snapshot.docs.filter((doc) => doc.exists()).map((doc) => doc.data());

                const data = chats.map(async (chat: Chat) => {
                    const friendId = chat.members.find((member) => member !== authUser?.uid);

                    if (!friendId) return;

                    const friendRef = doc(firestore, 'users', friendId);

                    const friendDoc = await getDoc(friendRef);

                    const friend = friendDoc.data();

                    const messageCollection = collection(firestore, 'chats', chat.id, 'messages').withConverter(messageConverter);

                    const messageQuery = query(messageCollection, orderBy('createdAt', 'desc'), limit(1));

                    const messageSnapshot = await getDocs(messageQuery);

                    const lastMessage = messageSnapshot.docs[0]?.data() as Message;

                    const unreadQuery = query(messageCollection, where('read', '==', false), where('sender', '!=', authUser?.uid));

                    const unreadSnapshot = await getDocs(unreadQuery);

                    const unreadMessages = unreadSnapshot.docs.length;

                    return {
                        id: chat.id,
                        displayName: friend?.displayName,
                        photoURL: friend?.photoURL,
                        lastMessage: lastMessage?.content,
                        lastMessageTimestamp: lastMessage?.createdAt,
                        unreadMessages: unreadMessages,
                    };
                });

                try {
                    const chatsData = await Promise.all(data);

                    const filteredChats = chatsData.filter((chat) => chat !== undefined) as unknown as ChatData[];

                    setData(filteredChats);
                    setDataLoading(false);
                } catch (e) {
                    console.log(e);
                    setDataLoading(false);
                }
            },
            (e) => {
                console.log(e);
                setDataLoading(false);
            },
        );
    }, [authUser?.uid]);

    React.useEffect(() => {
        const unsubscribe = subscribeToUserChats();

        return () => {
            unsubscribe && unsubscribe();
        };
    }, [subscribeToUserChats]);

    const loading = authUserLoading || dataLoading;

    return { data, loading };
}
