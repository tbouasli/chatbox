import { signOut } from 'firebase/auth';
import { getToken } from 'firebase/messaging';
import React from 'react';

import { auth, messaging } from '@/lib/firebase';

import SettingsItem from '@/shared/components/molecule/SettingsItem';
import SettingsHeader from '@/shared/components/organism/SettingsHeader';

import { version } from '../../../../package.json';

function Settings() {
    const [token, setToken] = React.useState('');

    React.useEffect(() => {
        getToken(messaging, {
            vapidKey: 'BF_gjWmSkWDlFdiqWaETTzcCF7jxrBvcTVqimY6FU6-71S2qkKvRGNERvWD8Ap9RgSEzayfYXLz67sSeTfl8a0c',
        }).then((currentToken) => {
            setToken(currentToken);
        });
    }, []);
    return (
        <main className="h-full w-full flex flex-col">
            <SettingsHeader />
            <SettingsItem href="/app/settings/profile" iconSrc="/assets/icon/smile.svg" content="Change Profile Info" />
            <SettingsItem href="/app/settings/notifications" iconSrc="/assets/icon/chat.svg" content="Notifications" />
            <SettingsItem onClick={() => signOut(auth)} iconSrc="/assets/icon/exit.svg" content="Sign Out" />
            <div className="p-2 w-full" onClick={() => navigator.clipboard.writeText(token)}>
                <span className="break-words">{token}</span>
            </div>
            <span className="self-center mt-auto">v{version}</span>
        </main>
    );
}

export default Settings;
