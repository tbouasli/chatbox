import Title from '@/shared/components/atom/Title';
import AppHeaderWithBackButton from '@/shared/components/molecule/AppHeaderWithBackButton';

function SettingsHeader() {
    return (
        <AppHeaderWithBackButton>
            <Title text="Settings" />
        </AppHeaderWithBackButton>
    );
}

export default SettingsHeader;
