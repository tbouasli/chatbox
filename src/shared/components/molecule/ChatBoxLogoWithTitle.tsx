import ChatBoxLogo from "@/shared/components/atom/ChatBoxLogo";
import Title from "@/shared/components/atom/Title";

function ChatBoxLogoWithTitle() {
  return (
    <div className="flex items-center gap-2">
      <ChatBoxLogo />
      <div>
        <Title className="leading-5" text="chat" />
        <Title className="leading-5" text="box" />
      </div>
    </div>
  );
}

export default ChatBoxLogoWithTitle;
