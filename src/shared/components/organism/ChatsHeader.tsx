import { Link } from 'react-router-dom';

import AppHeader from '@/shared/components/molecule/AppHeader';
import ChatBoxLogoWithTitle from '@/shared/components/molecule/ChatBoxLogoWithTitle';

function ChatsHeader() {
    return (
        <AppHeader className="justify-between">
            <ChatBoxLogoWithTitle />
            <div className="flex items-center gap-2">
                <img className="text-primary-foreground opacity-50" src="/assets/icon/search.svg" alt="Search" height={24} width={24} />
                <Link to="/app/settings">
                    <img src="/assets/icon/settings.svg" alt="Settings" height={24} width={24} />
                </Link>
            </div>
        </AppHeader>
    );
}

export default ChatsHeader;
