import { DocumentReference, Timestamp } from 'firebase/firestore';
import { v4 as UUID } from 'uuid';

interface MessageProps {
    id?: string;
    content: string;
    chat: DocumentReference;
    sender: DocumentReference;
    createdAt: Timestamp;
}

export class Message implements MessageProps {
    id: string;
    content: string;
    chat: DocumentReference;
    sender: DocumentReference;
    createdAt: Timestamp;

    constructor(props: MessageProps) {
        this.id = props.id || UUID();
        this.content = props.content;
        this.chat = props.chat;
        this.sender = props.sender;
        this.createdAt = props.createdAt;
    }
}
