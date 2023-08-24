import { useParams } from 'react-router-dom';

import ChatMessages from '@/shared/components/molecule/ChatMessages';
import ChatFooter from '@/shared/components/organism/ChatFooter';
import ChatHeader from '@/shared/components/organism/ChatHeader';

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
