import { doc } from 'firebase/firestore';
import React from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { firestore } from '@/lib/firebase';

import useLoadingBuffer from '@/shared/hooks/useLoadingBuffer';

import { userMapper } from '@/app/infra/mappers/UserMapper';

import { indexMapper } from '../infra/mappers/IndexMapper';

export default function useSearchUser() {
    const { buffer, setLoading } = useLoadingBuffer();
    const [nickname, setNickname] = React.useState<string>('');

    const indexDocRef = doc(firestore, 'index', 'user', 'nickname', nickname.length === 0 ? 'loading' : nickname);

    const [indexData, indexLoading] = useDocumentData(indexDocRef.withConverter(indexMapper));
    const [userData, userLoading] = useDocumentData(indexData?.ref.withConverter(userMapper));

    const loading = indexLoading || userLoading;

    React.useEffect(() => {
        setLoading(loading);
    }, [loading, setLoading]);

    return {
        setNickname,
        user: userData,
        loading: buffer,
    };
}
