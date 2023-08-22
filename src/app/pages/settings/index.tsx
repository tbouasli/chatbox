import { signOut } from 'firebase/auth';

import { auth } from '@/lib/firebase';

import SettingsItem from '@/shared/components/molecule/SettingsItem';
import SettingsHeader from '@/shared/components/organism/SettingsHeader';

import { version } from '../../../../package.json';

function Settings() {
    return (
        <main className="h-full w-full flex flex-col">
            <SettingsHeader />
            <SettingsItem href="/app/settings/profile" iconSrc="/assets/icon/smile.svg" content="Change Profile Info" />
            <SettingsItem href="/app/settings/notifications" iconSrc="/assets/icon/chat.svg" content="Notifications" />
            <SettingsItem onClick={() => signOut(auth)} iconSrc="/assets/icon/exit.svg" content="Sign Out" />

            <span className="self-center mt-auto">v{version}</span>
        </main>
    );
}

export default Settings;
