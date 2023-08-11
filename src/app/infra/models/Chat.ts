import { DocumentReference } from 'firebase/firestore';

interface ChatProps {
    id: string;
    members?: DocumentReference[];
    messages?: DocumentReference[];
}

export class Chat implements ChatProps {
    id: string;
    members?: DocumentReference[];
    messages?: DocumentReference[];

    constructor(props: ChatProps) {
        this.id = props.id;
        this.members = props.members || [];
        this.messages = props.messages || [];
    }
}
