import { Timestamp, getDoc } from 'firebase/firestore';
import { doc, writeBatch } from 'firebase/firestore';
import { Check, CheckCheck } from 'lucide-react';
import React from 'react';

import { firestore } from '@/lib/firebase';

import useAppData from '@/app/hooks/useAppData';
import { chatMapper } from '@/app/infra/mappers/ChatMapper';
import { messageMapper } from '@/app/infra/mappers/MessageMapper';

interface MessageProps {
    id: string;
    chatId: string;
    content: string;
    createdAt: Timestamp;
    fromSelf: boolean;
    read?: boolean;
}

const { format } = Intl.DateTimeFormat('pt-BR', {
    hour: 'numeric',
    minute: 'numeric',
});

function Message({ id, chatId, content, createdAt, fromSelf, read }: MessageProps) {
    const { user } = useAppData();

    const updateReadState = React.useCallback(async () => {
        if (fromSelf || read || !user?.data?.id) return;

        const chatRef = doc(firestore, 'chats', chatId).withConverter(chatMapper);
        const messageRef = doc(chatRef, 'messages', id).withConverter(messageMapper);

        const chatDoc = await getDoc(chatRef);
        const messageDoc = await getDoc(messageRef);

        if (!chatDoc.exists() || !messageDoc.exists()) return; //TODO handle error

        const chat = chatDoc.data();

        const batch = writeBatch(firestore);

        batch.update(messageRef, {
            read: true,
        });

        batch.update(chatRef, {
            visual: {
                ...chat.visual,
                [user?.data?.id]: {
                    ...chat.visual[user?.data?.id],
                    unreadMessages: 0,
                },
            },
        });

        await batch.commit();
    }, [chatId, fromSelf, id, read, user?.data?.id]);

    React.useEffect(() => {
        updateReadState();
    }, [updateReadState]);

    return (
        <div className={`relative flex flex-col gap-1 ${fromSelf ? 'items-end' : 'items-start'}`}>
            <div
                className={`flex gap-1 p-2 rounded-md items-end ${
                    fromSelf ? 'bg-primary text-primary-foreground' : 'bg-primary-foreground text-primary'
                }`}
            >
                <span className="text-sm">{content}</span>
                <span className="text-xs text-gray-400">{format(createdAt.toDate())}</span>
                <span className="text-gray-400">{read ? <CheckCheck size={10} /> : <Check size={10} />}</span>
            </div>
        </div>
    );
}
export default Message;
