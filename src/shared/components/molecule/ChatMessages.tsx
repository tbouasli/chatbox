import React from 'react';

import MessageComponent from '@/shared/components/atom/Message';

import useAppData from '@/app/hooks/useAppData';
import useMessages from '@/app/hooks/useMessages';

interface ChatMessagesProps {
    id?: string;
}

function ChatMessages({ id }: ChatMessagesProps) {
    const topRef = React.useRef<HTMLDivElement>(null);
    const { user } = useAppData();
    const { messages, getMoreMessages } = useMessages(id);

    React.useEffect(() => {
        if (!topRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                getMoreMessages();
            }
        });

        observer.observe(topRef.current);

        return () => {
            observer.disconnect();
        };
    }, [messages, getMoreMessages]);

    return (
        <div className="flex flex-col-reverse grow gap-2 p-2 w-full overflow-y-scroll overflow-x-hidden">
            {messages?.map((message) => (
                <MessageComponent
                    key={message.id}
                    id={message.id}
                    chatId={id ?? 'loading'}
                    content={message.content}
                    createdAt={message.createdAt}
                    fromSelf={message.senderId === user?.data?.id}
                    read={message.read}
                />
            ))}
            <div ref={topRef} />
        </div>
    );
}
export default ChatMessages;
