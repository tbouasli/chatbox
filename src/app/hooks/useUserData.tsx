import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { getToken } from 'firebase/messaging';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, firestore, messaging } from '@/lib/firebase';

import { userConverter } from '@/app/infra/converter/UserConverter';

import { User } from '../infra/models/User';
import useUser from './useUser';

export interface UserData {
    data?: User | null;
    loading: boolean;
}

export default function useUserData() {
    const { updateUserFcmToken } = useUser();
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

    const updateFcmToken = React.useCallback(async () => {
        const token = await getToken(messaging, {
            vapidKey: 'BJvafJPTL1fBaCyiIbi8W2n8FIh5Tr28iZaiEBZGCutGwB2JExrLg8dmVRY-N5hqmROvI2jKC7BDk2LCEr1a668',
        });

        if (!token) return;

        updateUserFcmToken({ fcmToken: token });
    }, []);

    React.useEffect(() => {
        initiallyLoadUser();
    }, [initiallyLoadUser]);

    React.useEffect(() => {
        const unsubscribe = subscribeToUser();

        return () => {
            unsubscribe && unsubscribe();
        };
    }, [authUser, subscribeToUser]);

    React.useEffect(() => {
        if (Notification.permission === 'granted') {
            updateFcmToken();
        }
    }, [updateFcmToken]);

    const loading = authUserLoading || dataLoading;

    return { data, loading };
}
