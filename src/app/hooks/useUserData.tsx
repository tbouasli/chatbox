import { doc, getDocFromCache, getDocFromServer, onSnapshot, updateDoc } from 'firebase/firestore';
import { getToken } from 'firebase/messaging';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, firestore, messaging } from '@/lib/firebase';

import { userMapper } from '@/app/infra/mappers/UserMapper';

import { User } from '../infra/models/User';

export default function useUserData() {
    const [dataLoading, setDataLoading] = React.useState(true);
    const [data, setData] = React.useState<User>();
    const [authUser, authUserLoading] = useAuthState(auth);
    const userDocRef = React.useMemo(() => doc(firestore, 'users', authUser?.uid ?? 'loading'), [authUser]);

    async function getFCMToken() {
        try {
            return await getToken(messaging, {
                vapidKey: 'BJvafJPTL1fBaCyiIbi8W2n8FIh5Tr28iZaiEBZGCutGwB2JExrLg8dmVRY-N5hqmROvI2jKC7BDk2LCEr1a668',
            });
        } catch (e) {
            return 'no-token';
        }
    }

    const getData = React.useCallback(
        async (from: 'cache' | 'server') => {
            const userDoc =
                from === 'cache'
                    ? await getDocFromCache(userDocRef.withConverter(userMapper))
                    : await getDocFromServer(userDocRef.withConverter(userMapper));

            if (userDoc.exists()) {
                setData(userDoc.data());

                const token = await getFCMToken(); //TODO: move to a better place and allow for multiple device tokens

                await updateDoc(userDocRef, {
                    fcmToken: token,
                });
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
