import React from 'react';

import useChat from '@/app/hooks/useChat';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface ChatFooterProps {
    id?: string;
}

function ChatFooter({ id }: ChatFooterProps) {
    const { sendMessage } = useChat();

    const handleSubmit = React.useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            if (!id) return;

            e.preventDefault();

            const content = e.currentTarget.content.value;

            sendMessage({
                chatId: id,
                content,
            });

            e.currentTarget.reset();
        },
        [id, sendMessage],
    );

    return (
        <form onSubmit={handleSubmit} className="flex gap-4 w-full p-3">
            <Input name="content" placeholder="Type a message" />
            <Button>Send</Button>
        </form>
    );
}
export default ChatFooter;
