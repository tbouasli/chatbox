import { Link } from 'react-router-dom';

import ChatList from '@/shared/components/organism/ChatList';
import ChatsHeader from '@/shared/components/organism/ChatsHeader';
import { Button } from '@/shared/components/ui/button';

function Home() {
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

export default Home;
