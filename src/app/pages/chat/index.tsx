import { useParams } from 'react-router-dom';

import AppHeaderWithBackButton from '@/shared/components/molecule/AppHeaderWithBackButton';
import ChatMessages from '@/shared/components/molecule/ChatMessages';
import UserItem from '@/shared/components/molecule/UserItem';
import ChatFooter from '@/shared/components/organism/ChatFooter';

import useChatData from '@/app/hooks/useChatData';

function Chat() {
    const { id } = useParams<{ id: string }>();

    const { data } = useChatData(id ?? 'as');

    return (
        <main className="h-[100dvh] w-full flex flex-col">
            <AppHeaderWithBackButton>
                <UserItem displayName={data?.displayName ?? 'Loading...'} photoURL={data?.photoURL ?? ''} nickname={data?.nickname ?? ''} />
            </AppHeaderWithBackButton>
            <div className="flex grow">
                <ChatMessages messages={data?.messages} />
            </div>
            <ChatFooter id={data?.id} />
        </main>
    );
}
export default Chat;
