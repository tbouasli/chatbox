import { collection, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { auth, firestore } from '@/lib/firebase';

import { chatMapper } from '@/app/infra/mappers/ChatMapper';

export default function useChatsData() {
    const [authUser, authUserLoading] = useAuthState(auth);

    const chatsCollectionRef = collection(firestore, 'chats');

    const chatsQuery = query(chatsCollectionRef, where('members', 'array-contains', authUser?.uid ?? 'loading'));

    const [data, dataLoading] = useCollectionData(chatsQuery?.withConverter(chatMapper));

    const loading = authUserLoading || dataLoading;

    return { data, loading };
}
