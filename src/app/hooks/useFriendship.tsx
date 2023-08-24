import { httpsCallable } from 'firebase/functions';

import { functions } from '@/lib/firebase';

interface requestFriendshipRequest {
    friendUid: string;
}

interface Response {
    message: string;
}

interface acceptFriendshipRequest {
    friendshipId: string;
}

interface rejectFriendshipRequest {
    friendshipId: string;
}

export default function useFriendship() {
    const requestFriendship = httpsCallable<requestFriendshipRequest, Response>(functions, 'requestFriendship');
    const acceptFriendship = httpsCallable<acceptFriendshipRequest, Response>(functions, 'acceptFriendship');
    const rejectFriendship = httpsCallable<rejectFriendshipRequest, Response>(functions, 'rejectFriendship');

    return { requestFriendship, acceptFriendship, rejectFriendship };
}
