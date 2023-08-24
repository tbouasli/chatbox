import { httpsCallable } from 'firebase/functions';

import { functions } from '@/lib/firebase';

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
    const createChat = httpsCallable<createChatRequest, Response>(functions, 'createChat');
    const sendMessage = httpsCallable<SendMessageRequest, Response>(functions, 'sendMessage');

    return { createChat, sendMessage };
}
