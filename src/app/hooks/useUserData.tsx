import { doc } from 'firebase/firestore';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { auth, firestore } from '@/lib/firebase';

import { userMapper } from '@/app/infra/mappers/UserMapper';

export default function useUserData() {
    const [authUser, authUserLoading] = useAuthState(auth);

    const userDocRef = React.useMemo(() => doc(firestore, 'users', authUser?.uid ?? 'loading'), [authUser]);

    const { '0': data, '1': dataLoading } = useDocumentData(userDocRef.withConverter(userMapper));

    const loading = authUserLoading || dataLoading;

    return { data, loading };
}
