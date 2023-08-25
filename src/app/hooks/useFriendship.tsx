import { HttpsCallable, HttpsCallableResult, httpsCallable } from 'firebase/functions';

import { functions } from '@/lib/firebase';

import { useToast } from '@/shared/components/ui/use-toast';

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

    const requestFriendship = errorHandlingWrapper(httpsCallable<requestFriendshipRequest, Response>(functions, 'requestFriendship'));
    const acceptFriendship = errorHandlingWrapper(httpsCallable<acceptFriendshipRequest, Response>(functions, 'acceptFriendship'));
    const rejectFriendship = errorHandlingWrapper(httpsCallable<rejectFriendshipRequest, Response>(functions, 'rejectFriendship'));

    return { requestFriendship, acceptFriendship, rejectFriendship };
}
