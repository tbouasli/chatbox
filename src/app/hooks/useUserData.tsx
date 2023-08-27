import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, firestore } from '@/lib/firebase';

import { userConverter } from '@/app/infra/converter/UserConverter';

import { User } from '../infra/models/User';

export interface UserData {
    data?: User | null;
    loading: boolean;
}

export default function useUserData() {
    const [dataLoading, setDataLoading] = React.useState<boolean>(true);
    const [data, setData] = React.useState<User>();
    const [authUser, authUserLoading] = useAuthState(auth);

    const initiallyLoadUser = React.useCallback(async () => {
        setDataLoading(true);
        if (!authUser?.uid) return;

        const docRef = doc(firestore, 'users', authUser.uid).withConverter(userConverter);

        const userDoc = await getDoc(docRef);

        if (userDoc.exists()) {
            setData(userDoc.data());
        }

        setDataLoading(false);
    }, [authUser?.uid, setDataLoading]);

    const subscribeToUser = React.useCallback(() => {
        if (!authUser?.uid) return;
        setDataLoading(true);

        const docRef = doc(firestore, 'users', authUser.uid);

        return onSnapshot(
            docRef.withConverter(userConverter),
            async (userDoc) => {
                if (userDoc.exists()) {
                    setData(userDoc.data());
                }
                setDataLoading(false);
            },
            () => {
                setDataLoading(false);
            },
        );
    }, [authUser?.uid, setDataLoading]);

    React.useEffect(() => {
        initiallyLoadUser();
    }, [initiallyLoadUser]);

    React.useEffect(() => {
        const unsubscribe = subscribeToUser();

        return () => {
            unsubscribe && unsubscribe();
        };
    }, [authUser, subscribeToUser]);

    const loading = authUserLoading || dataLoading;

    return { data, loading };
}
