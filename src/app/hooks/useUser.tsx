import { HttpsCallable, HttpsCallableResult, httpsCallable } from 'firebase/functions';

import { functions } from '@/lib/firebase';

import { useToast } from '@/shared/components/ui/use-toast';

interface OnBoardUserRequest {
    displayName: string;
    nickname: string;
    photoURL: string;
    fcmToken?: string;
}

interface UpdateUserFcmTokenRequest {
    fcmToken: string;
}

interface Response {
    message: string;
}

export default function useUser() {
    const { toast } = useToast();

    function errorHandlingWrapper<I, O>(callable: HttpsCallable<I, O>) {
        return async (data: I): Promise<HttpsCallableResult<O>> => {
            try {
                return await callable(data);
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Something went wrong',
                });

                throw error;
            }
        };
    }

    const onBoardUser = errorHandlingWrapper(httpsCallable<OnBoardUserRequest, Response>(functions, 'onBoardUser'));
    const updateUserFcmToken = errorHandlingWrapper(httpsCallable<UpdateUserFcmTokenRequest, Response>(functions, 'updateUserFcmToken'));

    return { onBoardUser, updateUserFcmToken };
}
