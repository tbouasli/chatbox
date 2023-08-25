import { useParams } from 'react-router-dom';

import ChatFooter from '@/app/components/molecule/ChatFooter';
import ChatMessages from '@/app/components/molecule/ChatMessages';
import ChatHeader from '@/app/components/organism/ChatHeader';

function ChatPage() {
    const { chatId } = useParams<{ chatId: string }>();

    return (
        <main className="page">
            <ChatHeader id={chatId} />
            <ChatMessages id={chatId} />
            <ChatFooter id={chatId} />
        </main>
    );
}
export default ChatPage;
