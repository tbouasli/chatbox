import { addDoc, collection } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import React from 'react';

import { firestore, functions } from '@/lib/firebase';

import { messageConverter } from '../infra/converter/MessageConverter';
import { Message } from '../infra/models/Message';
import useAppData from './useAppData';

interface createChatRequest {
    friendshipId: string;
}

interface Response {
    message: string;
}

interface SendMessageRequest {
    chatId: string;
    content: string;
}

export default function useChat() {
    const { user } = useAppData();
    const createChat = httpsCallable<createChatRequest, Response>(functions, 'createChat');

    const sendMessage = React.useCallback(
        async ({ chatId, content }: SendMessageRequest) => {
            if (!user.data) return;

            const message = Message.create({
                chatId,
                content,
                senderId: user.data?.id,
            });

            const collectionRef = collection(firestore, 'chats', chatId, 'messages').withConverter(messageConverter);

            await addDoc(collectionRef, message);
        },
        [user.data],
    );

    return { createChat, sendMessage };
}
