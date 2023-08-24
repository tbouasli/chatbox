import { signOut } from 'firebase/auth';

import { auth } from '@/lib/firebase';

import SettingsItem from '@/shared/components/molecule/SettingsItem';
import SettingsHeader from '@/shared/components/organism/SettingsHeader';

function SettingsPage() {
    return (
        <main className="page">
            <SettingsHeader />
            <SettingsItem iconSrc="/assets/icon/smile.svg" content="Change Profile Info" href="/app/settings/profile" />
            <SettingsItem iconSrc="/assets/icon/chat.svg" content="Notifications" href="/app/settings/notifications" />
            <SettingsItem iconSrc="/assets/icon/exit.svg" content="Sign Out" onClick={() => signOut(auth)} />
        </main>
    );
}
export default SettingsPage;
