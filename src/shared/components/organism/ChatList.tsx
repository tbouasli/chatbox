import { useNavigate } from 'react-router-dom';

import useAppData from '@/app/hooks/useAppData';

import ChatItem from '../molecule/ChatItem';

function ChatList() {
    const { chats } = useAppData();
    const navigate = useNavigate();

    return chats.data?.map((chat) => (
        <ChatItem
            key={chat.id}
            displayName={chat.displayName}
            lastMessage={chat.lastMessage}
            lastMessageTimestamp={chat.lastMessageTimestamp}
            photoURL={chat.photoURL}
            onClick={() => navigate(`/app/chat/${chat.id}`)}
        />
    ));
}
export default ChatList;
