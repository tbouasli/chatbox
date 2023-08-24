import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

import { Friendship } from '@/app/infra/models/Friendship';

class FriendshipConverter implements FirestoreDataConverter<Friendship> {
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions | undefined): Friendship {
        const data = snapshot.data(options);
        return Friendship.existing({
            id: snapshot.id,
            status: data.status,
            senderId: data.senderId,
            users: data.users,
            createdAt: data.createdAt?.toDate(),
        });
    }

    toFirestore(friendship: Friendship): DocumentData {
        return {
            status: friendship.status,
            senderId: friendship.senderId,
            users: friendship.users,
            createdAt: friendship.createdAt,
        };
    }
}

export const friendshipConverter = new FriendshipConverter();
