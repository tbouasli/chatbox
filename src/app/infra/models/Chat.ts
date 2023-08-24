import { v4 as UUID } from 'uuid';

interface ChatProps {
    id?: string;
    members: string[];
}

export class Chat implements ChatProps {
    id: string;
    members: string[];

    private constructor(props: ChatProps) {
        this.id = props.id ?? UUID();
        this.members = props.members;
    }

    static existing(props: ChatProps): Chat {
        return new Chat(props);
    }
}
