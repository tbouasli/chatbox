import { addDoc, collection } from 'firebase/firestore';
import { getToken } from 'firebase/messaging';
import React from 'react';
import { Link } from 'react-router-dom';

import { firestore, messaging } from '@/lib/firebase';

import { Button } from '@/shared/components/ui/button';

import ChatList from '@/app/components/organism/ChatList';
import ChatsHeader from '@/app/components/organism/ChatsHeader';
import useAppData from '@/app/hooks/useAppData';

function HomePage() {
    const { user } = useAppData();

    React.useEffect(() => {
        if (!user.data && !user.loading) return;

        const notify = localStorage.getItem('notify');

        if (!notify || new Date().toISOString() > notify) {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    new Notification('Welcome to Chat App', {
                        body: 'You can send message to your friends',
                        icon: '/assets/icon/chat-light.svg',
                    });

                    getToken(messaging, {
                        vapidKey: 'BJvafJPTL1fBaCyiIbi8W2n8FIh5Tr28iZaiEBZGCutGwB2JExrLg8dmVRY-N5hqmROvI2jKC7BDk2LCEr1a668',
                    }).then((currentToken) => {
                        if (currentToken) {
                            const tokenCollection = collection(firestore, 'users', user.data?.id as string, 'tokens');

                            addDoc(tokenCollection, {
                                timestamp: new Date().toISOString(),
                                token: currentToken,
                            }).then(() => {
                                console.log('Token added to database', currentToken);
                                localStorage.setItem('notify', new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString());
                            });
                        } else {
                            console.log('No registration token available. Request permission to generate one.');
                        }
                    });
                }
            });
        }
    }, [user]);

    return (
        <main className="h-full w-full flex flex-col">
            <ChatsHeader />
            <Link to="/app/friends">
                <Button className="rounded-full absolute bottom-4 right-4 p-4 h-fit">
                    <img className="text-primary-foreground" src="/assets/icon/chat-light.svg" alt="Back" height={24} width={24} />
                </Button>
            </Link>
            <ChatList />
        </main>
    );
}

export default HomePage;
