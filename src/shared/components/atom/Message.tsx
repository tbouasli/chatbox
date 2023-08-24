import { Timestamp } from 'firebase/firestore';
import { Check, CheckCheck } from 'lucide-react';

interface MessageProps {
    id: string;
    chatId: string;
    content: string;
    createdAt: Timestamp;
    fromSelf: boolean;
    read?: boolean;
}

const { format } = Intl.DateTimeFormat('pt-BR', {
    hour: 'numeric',
    minute: 'numeric',
});

function Message({ content, createdAt, fromSelf, read }: MessageProps) {
    return (
        <div className={`relative flex flex-col gap-1 ${fromSelf ? 'items-end' : 'items-start'}`}>
            <div
                className={`flex gap-1 p-2 rounded-md items-end ${
                    fromSelf ? 'bg-primary text-primary-foreground' : 'bg-primary-foreground text-primary'
                }`}
            >
                <span className="text-sm">{content}</span>
                <span className="text-xs text-gray-400">{format(createdAt.toDate())}</span>
                <span className="text-gray-400">{read ? <CheckCheck size={10} /> : <Check size={10} />}</span>
            </div>
        </div>
    );
}
export default Message;
