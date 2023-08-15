import { DocumentReference } from 'firebase/firestore';
import { v4 as UUID } from 'uuid';

interface ChatProps {
    id?: string;
    members?: DocumentReference[];
    messages?: DocumentReference[];
}

export class Chat implements ChatProps {
    id: string;
    members?: DocumentReference[];
    messages?: DocumentReference[];

    constructor(props: ChatProps) {
        this.id = props.id ?? UUID();
        this.members = props.members || [];
        this.messages = props.messages || [];
    }

    addMessage(message: DocumentReference) {
        this.messages?.push(message);
    }
}
