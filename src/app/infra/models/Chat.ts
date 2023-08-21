import { Timestamp } from 'firebase/firestore';
import { v4 as UUID } from 'uuid';

interface ChatVisual {
    [key: string]: {
        photoURL: string;
        displayName: string;
        unreadMessages: number;
    };
}

interface ChatLastMessage {
    senderId: string;
    content: string;
    timestamp: Timestamp;
}
interface ChatProps {
    id?: string;
    members?: string[];
    visual: ChatVisual;
    lastMessage?: ChatLastMessage;
}

export class Chat implements ChatProps {
    id: string;
    members?: string[];
    visual: ChatVisual;
    lastMessage?: ChatLastMessage;

    constructor(props: ChatProps) {
        this.id = props.id ?? UUID();
        this.members = props.members || [];
        this.visual = props.visual;
        this.lastMessage = props.lastMessage;
    }

    getVisual(memberId: string) {
        return this.visual[memberId];
    }

    getOtherMemberId(memberId: string) {
        return this.members?.find((member) => member !== memberId);
    }
}
