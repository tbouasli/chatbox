import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

import { FriendRequest } from '@/app/infra/models/FriendRequest';

class FriendRequestMapper implements FirestoreDataConverter<FriendRequest> {
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions | undefined): FriendRequest {
        const data = snapshot.data(options);
        return new FriendRequest({
            id: snapshot.id,
            senderPhotoURL: data.senderPhotoURL,
            senderDisplayName: data.senderDisplayName,
            senderNickname: data.senderNickname,
            receiver: data.receiver,
            sender: data.sender,
            status: data.status,
        });
    }

    toFirestore(friendRequest: FriendRequest): DocumentData {
        return {
            senderPhotoURL: friendRequest.senderPhotoURL,
            senderDisplayName: friendRequest.senderDisplayName,
            senderNickname: friendRequest.senderNickname,
            receiver: friendRequest.receiver,
            sender: friendRequest.sender,
            status: friendRequest.status,
        };
    }
}

export const friendRequestMapper = new FriendRequestMapper();
