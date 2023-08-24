import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

import { Index } from '@/app/infra/models/Index';

class IndexConverter implements FirestoreDataConverter<Index> {
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions | undefined): Index {
        const data = snapshot.data(options);
        return new Index({
            id: data.id,
            ref: data.ref,
        });
    }

    toFirestore(index: Index): DocumentData {
        return {
            ref: index.ref,
        };
    }
}

export const indexConverter = new IndexConverter();
