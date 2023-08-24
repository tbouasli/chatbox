import { httpsCallable } from 'firebase/functions';

import { functions } from '@/lib/firebase';

interface OnBoardUserRequest {
    displayName: string;
    nickname: string;
    photoURL: string;
    fcmToken?: string;
    deviceId: string;
}

interface Response {
    message: string;
}

export default function useUser() {
    const onBoardUser = httpsCallable<OnBoardUserRequest, Response>(functions, 'onBoardUser');

    return { onBoardUser };
}
