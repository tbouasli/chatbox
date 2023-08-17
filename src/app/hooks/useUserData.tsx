import { doc, getDocFromCache, getDocFromServer, onSnapshot } from 'firebase/firestore';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, firestore } from '@/lib/firebase';

import { userMapper } from '@/app/infra/mappers/UserMapper';

import { User } from '../infra/models/User';

export default function useUserData() {
    const [dataLoading, setDataLoading] = React.useState(true);
    const [data, setData] = React.useState<User>();
    const [authUser, authUserLoading] = useAuthState(auth);
    const userDocRef = React.useMemo(() => doc(firestore, 'users', authUser?.uid ?? 'loading'), [authUser]);

    const getData = React.useCallback(
        async (from: 'cache' | 'server') => {
            const userDoc =
                from === 'cache'
                    ? await getDocFromCache(userDocRef.withConverter(userMapper))
                    : await getDocFromServer(userDocRef.withConverter(userMapper));

            if (userDoc.exists()) {
                setData(userDoc.data());
            }
        },
        [userDocRef],
    );

    const getInitialData = React.useCallback(async () => {
        try {
            setDataLoading(true);
            await getData('cache');
        } catch (error) {
            await getData('server');
        } finally {
            setDataLoading(false);
        }
    }, [getData]);

    const getDataUpdates = React.useCallback(() => {
        return onSnapshot(userDocRef.withConverter(userMapper), (userDoc) => {
            if (userDoc.exists()) {
                setData(userDoc.data());
            }
        });
    }, [userDocRef]);

    React.useEffect(() => {
        if (authUser) {
            getInitialData();
            const unsub = getDataUpdates();
            return () => unsub();
        } else {
            setData(undefined);
        }
    }, [authUser, getInitialData, getDataUpdates]);

    const loading = authUserLoading || dataLoading;

    return { data, loading };
}
