import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

import { Message } from '@/app/infra/models/Message';

class MessageMapper implements FirestoreDataConverter<Message> {
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions | undefined): Message {
        const data = snapshot.data(options);
        return new Message({
            id: snapshot.id,
            content: data.content,
            senderId: data.senderId,
            read: data.read ?? false,
            createdAt: data.createdAt,
        });
    }

    toFirestore(message: Message): DocumentData {
        return {
            content: message.content,
            senderId: message.senderId,
            read: message.read,
            createdAt: message.createdAt,
        };
    }
}

export const messageMapper = new MessageMapper();
