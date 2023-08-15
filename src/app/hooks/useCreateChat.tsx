import { addDoc, collection, doc, getDocs, query, where } from 'firebase/firestore';
import React from 'react';

import { firestore } from '@/lib/firebase';

import { Chat } from '@/app/infra/models/Chat';
import { User } from '@/app/infra/models/User';

import { chatMapper } from '../infra/mappers/ChatMapper';
import useAppData from './useAppData';

export default function useCreateChat() {
    const { user } = useAppData();

    const createChat = React.useCallback(
        async (friend: User) => {
            if (!user.data?.id) return;

            const friendRef = doc(firestore, 'users', friend.id);
            const selfRef = doc(firestore, 'users', user.data?.id);

            const chatQuery = query(collection(firestore, 'chats'), where('members', 'array-contains-any', [friendRef, selfRef]));

            const chatQuerySnapshot = await getDocs(chatQuery);

            if (chatQuerySnapshot.docs.length > 0) return;

            const chat = new Chat({
                members: [friendRef, selfRef],
            });

            const docRef = collection(firestore, 'chats').withConverter(chatMapper);

            await addDoc(docRef, chat);
        },
        [user.data?.id],
    );

    return { createChat };
}
