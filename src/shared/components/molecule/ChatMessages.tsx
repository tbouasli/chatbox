import MessageComponent from '@/shared/components/atom/Message';

import useAppData from '@/app/hooks/useAppData';
import { Message } from '@/app/infra/models/Message';

interface ChatMessagesProps {
    messages?: Message[];
}

function ChatMessages({ messages }: ChatMessagesProps) {
    const { user } = useAppData();

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
