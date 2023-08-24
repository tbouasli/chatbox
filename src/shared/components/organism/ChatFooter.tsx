import React from 'react';

import useChat from '@/app/hooks/useChat';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface ChatFooterProps {
    id?: string;
}

function ChatFooter({ id }: ChatFooterProps) {
    const [content, setContent] = React.useState('');
    const { sendMessage } = useChat();

    const handleSubmit = React.useCallback(async () => {
        if (!id) return;

        sendMessage({
            chatId: id,
            content,
        });
    }, [id, content, sendMessage]);

    return (
        <div className="flex gap-4 w-full p-3">
            <Input placeholder="Type a message" value={content} onChange={(e) => setContent(e.target.value)} />
            <Button onClick={handleSubmit}>Send</Button>
        </div>
    );
}
export default ChatFooter;
