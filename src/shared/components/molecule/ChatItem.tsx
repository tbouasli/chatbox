import { Timestamp } from 'firebase/firestore';

import UserImage from '@/shared/components/atom/UserImage';

import ListItem from './ListItem';

interface ChatItemProps {
    onClick?: () => void;
    photoURL?: string;
    displayName?: string;
    lastMessage?: string;
    lastMessageTimestamp?: Timestamp;
    loading?: boolean;
    children?: React.ReactNode;
    unreadMessages?: number;
}

const { format } = Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
});

function ChatItem({ displayName, lastMessage, lastMessageTimestamp, photoURL, loading, children, onClick, unreadMessages }: ChatItemProps) {
    if (loading)
        return (
            <ListItem className="animate-pulse">
                <UserImage loading={loading} />
                <div className="flex flex-col grow overflow-hidden gap-1">
                    <div className="bg-gray-300 rounded h-4 w-4/5" />
                    <div className="bg-gray-300 rounded h-4 w-2/5" />
                </div>
            </ListItem>
        );

    if (!displayName) return null;

    return (
        <ListItem onClick={onClick}>
            <UserImage src={photoURL} loading={loading} />
            <div className="flex flex-col grow overflow-hidden">
                <div className="flex items-center justify-between">
                    <span className="text-base font-semibold truncate">{displayName}</span>
                    {lastMessageTimestamp && <span className="text-xs text-gray-500">{format(lastMessageTimestamp.toDate())}</span>}
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{lastMessage ?? 'New chat!'}</span>
                    {unreadMessages !== undefined && unreadMessages > 0 && (
                        <span className="bg-primary rounded-full text-primary-foreground text-xs px-1">{unreadMessages}</span>
                    )}
                </div>
            </div>
            {children}
        </ListItem>
    );
}
export default ChatItem;
