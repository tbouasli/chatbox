import { Timestamp } from 'firebase/firestore';
import { v4 as UUID } from 'uuid';

interface MessageProps {
    id: string;
    content: string;
    senderId: string;
    chatId: string;
    read: boolean;
    createdAt: Timestamp;
}

export class Message implements MessageProps {
    id: string;
    content: string;
    senderId: string;
    chatId: string;
    read: boolean;
    createdAt: Timestamp;

    private constructor(props: MessageProps) {
        this.id = props.id;
        this.content = props.content;
        this.senderId = props.senderId;
        this.chatId = props.chatId;
        this.read = props.read;
        this.createdAt = props.createdAt;
    }

    static create(props: Omit<MessageProps, 'id' | 'createdAt' | 'read'>): Message {
        return new Message({
            id: UUID(),
            createdAt: Timestamp.now(),
            read: false,
            ...props,
        });
    }

    static existing(props: MessageProps): Message {
        return new Message(props);
    }
}
