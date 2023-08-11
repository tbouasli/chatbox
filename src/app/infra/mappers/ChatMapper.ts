import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

import { Chat } from '@/app/infra/models/Chat';

class ChatMapper implements FirestoreDataConverter<Chat> {
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions | undefined): Chat {
        const data = snapshot.data(options);
        return new Chat({
            id: snapshot.id,
            members: data.members,
            messages: data.messages,
        });
    }

    toFirestore(chat: Chat): DocumentData {
        return {
            members: chat.members,
            messages: chat.messages,
        };
    }
}

export const chatMapper = new ChatMapper();
