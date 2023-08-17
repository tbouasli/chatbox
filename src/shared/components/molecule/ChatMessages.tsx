import { Loader2 } from 'lucide-react';

import MessageComponent from '@/shared/components/atom/Message';

import useAppData from '@/app/hooks/useAppData';
import { Message } from '@/app/infra/models/Message';

interface ChatMessagesProps {
    messages?: Message[];
    loading?: boolean;
}

function ChatMessages({ messages, loading }: ChatMessagesProps) {
    const { user } = useAppData();

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center">
                <Loader2 size={64} className="text-gray-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 p-2 w-full">
            {messages?.map((message) => (
                <MessageComponent
                    key={message.id}
                    content={message.content}
                    createdAt={message.createdAt}
                    fromSelf={message.sender.id == user.data?.id}
                />
            ))}
        </div>
    );
}
export default ChatMessages;
