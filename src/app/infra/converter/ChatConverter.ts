import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

import { Chat } from '@/app/infra/models/Chat';

class ChatConverter implements FirestoreDataConverter<Chat> {
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions | undefined): Chat {
        const data = snapshot.data(options);
        return Chat.existing({
            id: snapshot.id,
            members: data.members,
        });
    }

    toFirestore(chat: Chat): DocumentData {
        return {
            members: chat.members,
        };
    }
}

export const chatConverter = new ChatConverter();
