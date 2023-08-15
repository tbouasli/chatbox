import ChatBoxLogo from '@/shared/components/atom/ChatBoxLogo';
import Title from '@/shared/components/atom/Title';

function ChatBoxLogoWithTitle() {
    return (
        <div className="flex items-center gap-2">
            <ChatBoxLogo />
            <div>
                <Title translate="no" className="leading-5 select-none" text="chat" />
                <Title translate="no" className="leading-5 select-none" text="box" />
            </div>
        </div>
    );
}

export default ChatBoxLogoWithTitle;
