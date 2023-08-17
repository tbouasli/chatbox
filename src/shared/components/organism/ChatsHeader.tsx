import { Link } from 'react-router-dom';

import AppHeader from '@/shared/components/molecule/AppHeader';
import ChatBoxLogoWithTitle from '@/shared/components/molecule/ChatBoxLogoWithTitle';

function ChatsHeader() {
    return (
        <AppHeader className="justify-between">
            <ChatBoxLogoWithTitle />
            <div className="flex items-center gap-2">
                <img src="/assets/icon/search.svg" alt="Search" height={20} width={20} />
                <Link to="/app/settings">
                    <img src="/assets/icon/settings.svg" alt="Settings" height={20} width={20} />
                </Link>
            </div>
        </AppHeader>
    );
}

export default ChatsHeader;
