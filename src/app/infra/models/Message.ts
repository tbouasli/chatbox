import { Timestamp } from 'firebase/firestore';
import { v4 as UUID } from 'uuid';

interface MessageProps {
    id?: string;
    content: string;
    senderId: string;
    read: boolean;
    createdAt: Timestamp;
}

export class Message implements MessageProps {
    id: string;
    content: string;
    senderId: string;
    read: boolean;
    createdAt: Timestamp;

    constructor(props: MessageProps) {
        this.id = props.id || UUID();
        this.content = props.content;
        this.senderId = props.senderId;
        this.read = props.read;
        this.createdAt = props.createdAt;
    }
}
