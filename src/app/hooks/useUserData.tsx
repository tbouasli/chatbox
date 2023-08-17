import { doc, getDoc, onSnapshot } from 'firebase/firestore';
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

    const getData = React.useCallback(async () => {
        const userDoc = await getDoc(userDocRef.withConverter(userMapper));

        if (userDoc.exists()) {
            setData(userDoc.data());
        }
    }, [userDocRef]);

    const getDataUpdates = React.useCallback(() => {
        return onSnapshot(userDocRef.withConverter(userMapper), (userDoc) => {
            console.log(userDoc.metadata.fromCache ? 'Cached' : 'Server');
            console.log(userDoc.data());

            if (userDoc.exists()) {
                setData(userDoc.data());
            }
        });
    }, [userDocRef]);

    React.useEffect(() => {
        if (authUser) {
            setDataLoading(true);
            getData().finally(() => setDataLoading(false));
            const unsub = getDataUpdates();
            return () => unsub();
        } else {
            setData(undefined);
        }
    }, [authUser, getData, getDataUpdates]);

    const loading = authUserLoading || dataLoading;

    return { data, loading };
}
