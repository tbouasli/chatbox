import Title from '@/shared/components/atom/Title';

import HeaderWithBackButton from '@/app/components/molecule/HeaderWithBackButton';

function SettingsPageHeader() {
    return (
        <HeaderWithBackButton>
            <Title text="Settings" />
        </HeaderWithBackButton>
    );
}

export default SettingsPageHeader;
