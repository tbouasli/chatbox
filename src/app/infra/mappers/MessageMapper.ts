import { Message } from "@/app/infra/models/Message";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

class MessageMapper implements FirestoreDataConverter<Message> {
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>,
    options?: SnapshotOptions | undefined
  ): Message {
    const data = snapshot.data(options);
    return new Message({
      id: snapshot.id,
      content: data.content,
      chat: data.chat,
      sender: data.sender,
      createdAt: data.createdAt.toDate(),
    });
  }

  toFirestore(message: Message): DocumentData {
    return {
      content: message.content,
      chat: message.chat,
      sender: message.sender,
      createdAt: message.createdAt,
    };
  }
}

export const messageMapper = new MessageMapper();
