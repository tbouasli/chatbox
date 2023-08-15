import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, firestore } from '@/lib/firebase';

import { chatMapper } from '@/app/infra/mappers/ChatMapper';
import { messageMapper } from '@/app/infra/mappers/MessageMapper';
import { userMapper } from '@/app/infra/mappers/UserMapper';
import { Message } from '@/app/infra/models/Message';

export interface ChatDTO {
    id: string;
    displayName: string;
    nickname: string;
    photoURL: string;
    messages?: Message[];
}

export default function useChatData(id: string) {
    const [data, setData] = React.useState<ChatDTO>();
    const [authUser, authUserLoading] = useAuthState(auth);

    const getChatData = React.useCallback(async () => {
        const chatRef = doc(firestore, 'chats', id);
        const chatDoc = await getDoc(chatRef.withConverter(chatMapper));

        if (!chatDoc.exists()) {
            throw new Error('Chat not found');
        }

        const chat = chatDoc.data();

        const memberRef = chat.members?.find((member) => member.id !== authUser?.uid);

        if (!memberRef) {
            throw new Error('Member not found');
        }

        const memberDoc = await getDoc(memberRef.withConverter(userMapper));

        if (!memberDoc.exists()) {
            throw new Error('Member not found');
        }

        const memberData = memberDoc.data();

        const messageRef = chat.messages;

        const messageData = await Promise.all(
            messageRef?.map(async (message) => {
                const messageDoc = await getDoc(message.withConverter(messageMapper));

                if (!messageDoc.exists()) {
                    return;
                }

                return messageDoc.data();
            }) ?? [],
        );

        const filteredMessageData = messageData.filter((message) => message !== undefined) as Message[];

        setData({
            id: chat.id,
            displayName: memberData.displayName,
            nickname: memberData.nickname,
            photoURL: memberData.photoURL,
            messages: filteredMessageData,
        });
    }, [id, authUser?.uid]);

    React.useEffect(() => {
        getChatData();
    }, [getChatData]);

    React.useEffect(() => {
        const unsubscribe = onSnapshot(doc(firestore, 'chats', id).withConverter(chatMapper), async (chatDoc) => {
            if (!chatDoc.exists()) {
                throw new Error('Chat not found');
            }

            const chatData = chatDoc.data();

            const messageRef = chatData.messages;

            const messageData = await Promise.all(
                messageRef?.map(async (message) => {
                    const messageDoc = await getDoc(message.withConverter(messageMapper));

                    if (!messageDoc.exists()) {
                        return;
                    }

                    return messageDoc.data();
                }) ?? [],
            );

            const filteredMessageData = messageData.filter((message) => message !== undefined) as Message[];

            setData((prevData) => {
                if (!prevData) {
                    return;
                }

                return {
                    ...prevData,
                    messages: filteredMessageData,
                };
            });
        });

        return () => {
            unsubscribe();
        };
    }, [id]);

    return { data, loading: authUserLoading };
}
