import { Link } from 'react-router-dom';

import SearchIcon from '@/shared/assets/icon/search.svg';
import SettingsIcon from '@/shared/assets/icon/settings.svg';
import AppHeader from '@/shared/components/molecule/AppHeader';
import ChatBoxLogoWithTitle from '@/shared/components/molecule/ChatBoxLogoWithTitle';

function ChatsHeader() {
    return (
        <AppHeader className="justify-between">
            <ChatBoxLogoWithTitle />
            <div className="flex items-center gap-2">
                <img src={SearchIcon} alt="Search" height={20} width={20} />
                <Link to="/app/settings">
                    <img src={SettingsIcon} alt="Settings" height={20} width={20} />
                </Link>
            </div>
        </AppHeader>
    );
}

export default ChatsHeader;
