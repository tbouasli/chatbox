import { Timestamp } from 'firebase/firestore';

interface MessageProps {
    content: string;
    createdAt: Timestamp;
    fromSelf: boolean;
}

const { format } = Intl.DateTimeFormat('pt-BR', {
    hour: 'numeric',
    minute: 'numeric',
});

function Message({ content, createdAt, fromSelf }: MessageProps) {
    return (
        <div className={`relative flex flex-col gap-1 ${fromSelf ? 'items-end' : 'items-start'}`}>
            <div
                className={`flex gap-1 p-2 rounded-md ${
                    fromSelf ? 'bg-primary text-primary-foreground items-end' : 'bg-primary-foreground text-primary items-start'
                }`}
            >
                <span className="text-sm">{content}</span>
                <span className="text-xs text-gray-400">{format(createdAt)}</span>
            </div>
        </div>
    );
}
export default Message;
