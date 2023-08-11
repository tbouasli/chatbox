import { DocumentReference } from 'firebase/firestore';

interface UserProps {
    id: string;
    displayName: string;
    nickname: string;
    photoURL: string;
    chats?: DocumentReference[];
    friends?: DocumentReference[];
    friendRequests?: DocumentReference[];
}

export class User implements UserProps {
    id: string;
    displayName: string;
    nickname: string;
    photoURL: string;
    chats?: DocumentReference[];
    friends?: DocumentReference[];
    friendRequests?: DocumentReference[];

    constructor(props: UserProps) {
        this.id = props.id;
        this.displayName = props.displayName;
        this.nickname = props.nickname;
        this.photoURL = props.photoURL;
        this.chats = props.chats || [];
        this.friends = props.friends || [];
        this.friendRequests = props.friendRequests || [];
    }
}
