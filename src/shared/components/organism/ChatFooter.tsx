import { Timestamp, doc, getDoc, writeBatch } from 'firebase/firestore';
import React from 'react';

import { firestore } from '@/lib/firebase';

import useAppData from '@/app/hooks/useAppData';
import { chatMapper } from '@/app/infra/mappers/ChatMapper';
import { messageMapper } from '@/app/infra/mappers/MessageMapper';
import { Message } from '@/app/infra/models/Message';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface ChatFooterProps {
    id?: string;
}

function ChatFooter({ id }: ChatFooterProps) {
    const [content, setContent] = React.useState('');
    const { user } = useAppData();

    const sendMessage = async () => {
        if (!id || !user.data?.id) {
            return;
        }

        const chatRef = doc(firestore, 'chats', id);
        const userRef = doc(firestore, 'users', user.data?.id);

        const chatDoc = await getDoc(chatRef.withConverter(chatMapper));

        if (!chatDoc.exists()) {
            return;
        }

        const chat = chatDoc.data();

        const message = new Message({
            chat: chatRef,
            content: content,
            createdAt: Timestamp.now(),
            sender: userRef,
        });

        const messageRef = doc(firestore, 'messages', message.id);

        chat.addMessage(messageRef);

        const batch = writeBatch(firestore);

        batch.set(messageRef.withConverter(messageMapper), message);

        batch.set(chatRef.withConverter(chatMapper), chat);

        await batch.commit();

        setContent('');
    };

    return (
        <div className="flex gap-4 w-full p-3">
            <Input placeholder="Type a message" value={content} onChange={(e) => setContent(e.target.value)} />
            <Button onClick={sendMessage}>Send</Button>
        </div>
    );
}
export default ChatFooter;
