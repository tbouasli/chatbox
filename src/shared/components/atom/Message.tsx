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
        <div
            className={`p-2 w-fit max-w-[60%] rounded-md items-end
            ${fromSelf ? 'bg-primary text-primary-foreground self-end' : 'bg-primary-foreground text-primary'}`}
        >
            <span className="text-sm break-words">{content}</span>
            <span className="text-xs text-gray-400 self-end">
                {format(createdAt.toDate())}
                <span className="text-gray-400 inline-block">{read ? <CheckCheck size={10} /> : <Check size={10} />}</span>
            </span>
        </div>
    );
}
export default Message;
