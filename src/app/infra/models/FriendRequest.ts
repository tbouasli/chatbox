import { DocumentReference } from 'firebase/firestore';
import { v4 as UUID } from 'uuid';

interface FriendRequestProps {
    id?: string;
    senderPhotoURL: string;
    senderDisplayName: string;
    senderNickname: string;
    sender: DocumentReference;
    receiver: DocumentReference;
    status: 'pending' | 'accepted' | 'rejected';
}

export class FriendRequest implements FriendRequestProps {
    id: string;
    senderPhotoURL: string;
    senderDisplayName: string;
    senderNickname: string;
    sender: DocumentReference;
    receiver: DocumentReference;
    status: 'pending' | 'accepted' | 'rejected';

    constructor(props: FriendRequestProps) {
        this.id = props.id || UUID();
        this.senderPhotoURL = props.senderPhotoURL;
        this.senderDisplayName = props.senderDisplayName;
        this.senderNickname = props.senderNickname;
        this.sender = props.sender;
        this.receiver = props.receiver;
        this.status = props.status;
    }

    accept(): void {
        if (this.status !== 'pending') return;
        this.status = 'accepted';
    }

    reject(): void {
        if (this.status !== 'pending') return;
        this.status = 'rejected';
    }
}
