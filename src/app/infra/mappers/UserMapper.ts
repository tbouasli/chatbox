import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

import { User } from '@/app/infra/models/User';

class UserMapper implements FirestoreDataConverter<User> {
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions | undefined): User {
        const data = snapshot.data(options);
        return new User({
            id: snapshot.id,
            displayName: data.displayName,
            nickname: data.nickname,
            photoURL: data.photoURL,
            chats: data.chats,
            friends: data.friends,
            friendRequests: data.friendRequests,
        });
    }

    toFirestore(user: User): DocumentData {
        return {
            displayName: user.displayName,
            nickname: user.nickname,
            photoURL: user.photoURL,
            chats: user.chats,
            friends: user.friends,
            friendRequests: user.friendRequests,
        };
    }
}

export const userMapper = new UserMapper();
