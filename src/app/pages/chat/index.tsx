import React from 'react';
import { useParams } from 'react-router-dom';

import ChatMessages from '@/shared/components/molecule/ChatMessages';
import ChatFooter from '@/shared/components/organism/ChatFooter';
import ChatHeader from '@/shared/components/organism/ChatHeader';

function Chat() {
    const { id } = useParams<{ id: string }>();

    React.useEffect(() => {
        const root = document.getElementById('root');
        const main = document.getElementById('main');

        const onResize = () => {
            if (!main || !root) {
                return;
            }

            main.style.height = `${window.visualViewport?.height ?? window.innerHeight}px`;
            root.style.height = `${window.visualViewport?.height ?? window.innerHeight}px`;
        };

        window.addEventListener('resize', onResize);

        return () => {
            if (main && root) {
                main.style.height = '100dvh';
                root.style.height = '100dvh';
            }

            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <main className="h-[100dvh] w-full flex flex-col" id="main">
            <ChatHeader id={id} />
            <div className="flex grow overflow-scroll">
                <ChatMessages id={id} />
            </div>
            <ChatFooter id={id} />
        </main>
    );
}
export default Chat;
