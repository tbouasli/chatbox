import { DocumentReference } from 'firebase/firestore';

interface MessageProps {
    id: string;
    content: string;
    chat: DocumentReference;
    sender: DocumentReference;
    createdAt: Date;
}

export class Message implements MessageProps {
    id: string;
    content: string;
    chat: DocumentReference;
    sender: DocumentReference;
    createdAt: Date;

    constructor(props: MessageProps) {
        this.id = props.id;
        this.content = props.content;
        this.chat = props.chat;
        this.sender = props.sender;
        this.createdAt = props.createdAt;
    }
}
