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

        const chatRef = doc(firestore, 'chats', id).withConverter(chatMapper);

        const message = new Message({
            content: content,
            createdAt: Timestamp.now(),
            senderId: user.data?.id,
            read: false,
        });

        const chatDoc = await getDoc(chatRef);

        if (!chatDoc.exists()) return; //TODO handle error

        const chat = chatDoc.data();

        const otherMemberId = chat.getOtherMemberId(user.data?.id);

        if (!otherMemberId) return; //TODO handle error

        const messageRef = doc(firestore, 'chats', id, 'messages', message.id).withConverter(messageMapper);

        const batch = writeBatch(firestore);

        batch.set(messageRef, message);

        batch.update(chatRef, {
            //TODO fix this shit, use the domain model to perform this
            lastMessage: {
                senderId: message.senderId,
                content: message.content,
                timestamp: message.createdAt,
            },
            visual: {
                ...chat.visual,
                [otherMemberId]: {
                    ...chat.visual[otherMemberId],
                    unreadMessages: chat.visual[otherMemberId].unreadMessages + 1,
                },
            },
        });

        await batch.commit();

        //TODO dispatch push notification

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
