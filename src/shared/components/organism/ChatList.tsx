import { useNavigate } from 'react-router-dom';

import useAppData from '@/app/hooks/useAppData';

import ChatItem from '../molecule/ChatItem';

function ChatList() {
    const { chats, user } = useAppData();
    const navigate = useNavigate();

    return chats.data?.map((chat) => {
        if (!user.data?.id) return;

        const visual = chat.getVisual(user.data?.id);

        return (
            <ChatItem
                key={chat.id}
                displayName={visual?.displayName}
                lastMessage={chat.lastMessage?.content}
                lastMessageTimestamp={chat.lastMessage?.timestamp}
                photoURL={visual?.photoURL}
                onClick={() => navigate(`/app/chat/${chat.id}`)}
                unreadMessages={visual?.unreadMessages}
            />
        );
    });
}
export default ChatList;
