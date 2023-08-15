import { DocumentReference } from 'firebase/firestore';

interface UserProps {
    id: string;
    displayName: string;
    nickname: string;
    photoURL: string;
    chats?: DocumentReference[];
    friends?: DocumentReference[];
    friendRequestsReceived?: DocumentReference[];
}

export class User implements UserProps {
    id: string;
    displayName: string;
    nickname: string;
    photoURL: string;
    chats: DocumentReference[];
    friends: DocumentReference[];
    friendRequestsReceived: DocumentReference[];

    constructor(props: UserProps) {
        this.id = props.id;
        this.displayName = props.displayName;
        this.nickname = props.nickname;
        this.photoURL = props.photoURL;
        this.chats = props.chats || [];
        this.friends = props.friends || [];
        this.friendRequestsReceived = props.friendRequestsReceived || [];
    }

    addFriendRequestReceived(friendRequest: DocumentReference): void {
        this.friendRequestsReceived.push(friendRequest);
    }

    removeFriendRequestReceived(friendRequest: DocumentReference): void {
        this.friendRequestsReceived = this.friendRequestsReceived.filter((fr) => fr.id !== friendRequest.id);
    }

    addFriend(friend: DocumentReference): void {
        this.friends.push(friend);
    }
}
