import React from 'react';

import useAppData from '@/app/hooks/useAppData';
import { ChatData } from '@/app/hooks/useChatData';

import AppHeaderWithBackButton from '../molecule/AppHeaderWithBackButton';
import UserItem from '../molecule/UserItem';

interface ChatHeaderProps {
    id?: string;
}

function ChatHeader({ id }: ChatHeaderProps) {
    const [chat, setChat] = React.useState<ChatData>();
    const { chats } = useAppData();

    React.useEffect(() => {
        const found = chats.data?.find((chat) => chat.id === id);

        if (found) {
            setChat(found);
        }
    }, [chats.data, id]);

    return (
        <AppHeaderWithBackButton>
            <UserItem displayName={chat?.displayName} photoURL={chat?.photoURL} loading={chats.loading} />
        </AppHeaderWithBackButton>
    );
}
export default ChatHeader;
