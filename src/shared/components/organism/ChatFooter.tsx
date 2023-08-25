import React from 'react';
import * as z from 'zod';

import useChat from '@/app/hooks/useChat';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';

interface ChatFooterProps {
    id?: string;
}

const schema = z.string().nonempty().min(1).max(255);

function ChatFooter({ id }: ChatFooterProps) {
    const { sendMessage } = useChat();
    const { toast } = useToast();

    const handleSubmit = React.useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            try {
                if (!id) return;

                e.preventDefault();

                const content = e.currentTarget.content.value;

                schema.parse(content);

                sendMessage({
                    chatId: id,
                    content,
                });

                e.currentTarget.reset();
            } catch (error) {
                if (error instanceof z.ZodError) {
                    toast({
                        title: 'Error',
                        description: error.issues[0].message,
                        duration: 2000,
                    });
                }
            }
        },
        [id, sendMessage, toast],
    );

    return (
        <form onSubmit={handleSubmit} className="flex gap-4 w-full p-3">
            <Input minLength={1} maxLength={255} name="content" placeholder="Type a message" />
            <Button>Send</Button>
        </form>
    );
}
export default ChatFooter;
