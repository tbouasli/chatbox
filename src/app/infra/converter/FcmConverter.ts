import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

import { FcmToken } from '@/app/infra/models/FcmToken';

class FcmTokenConverter implements FirestoreDataConverter<FcmToken> {
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions | undefined): FcmToken {
        const data = snapshot.data(options);
        return new FcmToken({
            id: snapshot.id,
            token: data.token,
            timestamp: data.timestamp,
        });
    }

    toFirestore(FcmToken: FcmToken): DocumentData {
        return {
            token: FcmToken.token,
            timestamp: FcmToken.timestamp,
        };
    }
}

export const fcmTokenConverter = new FcmTokenConverter();
