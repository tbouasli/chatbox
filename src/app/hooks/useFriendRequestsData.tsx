import { getDoc } from 'firebase/firestore';
import React from 'react';

import { friendRequestMapper } from '@/app/infra/mappers/FriendRequestMapper';
import { FriendRequest } from '@/app/infra/models/FriendRequest';

import useAppData from './useAppData';

export default function useFriendRequestsData() {
    const [friendRequests, setFriendRequests] = React.useState<FriendRequest[]>();
    const [loading, setLoading] = React.useState<boolean>(false);
    const { user } = useAppData();

    const getFriendRequests = React.useCallback(async () => {
        if (!user.data) return setFriendRequests(undefined);

        const refs = user.data.friendRequestsReceived;

        const getFriendRequests = refs.map(async (ref) => {
            const doc = await getDoc(ref.withConverter(friendRequestMapper));
            return doc.data();
        });

        const friendRequests = await Promise.all(getFriendRequests);

        const filteredFriendRequests = friendRequests.filter((friendRequest) => friendRequest) as FriendRequest[];

        setFriendRequests(filteredFriendRequests);
    }, [user.data]);

    React.useEffect(() => {
        if (!user.data) return;

        setLoading(true);

        getFriendRequests().then(() => setLoading(false));
    }, [user.data, getFriendRequests]);

    return { data: friendRequests, loading };
}
