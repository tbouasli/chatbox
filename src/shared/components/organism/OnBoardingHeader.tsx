import { auth } from '@/lib/firebase';

import Title from '@/shared/components/atom/Title';
import AppHeaderWithBackButton from '@/shared/components/molecule/AppHeaderWithBackButton';

function OnBoardingHeader() {
    return (
        <AppHeaderWithBackButton onClick={() => auth.signOut()}>
            <Title text="Create Profile" />
        </AppHeaderWithBackButton>
    );
}

export default OnBoardingHeader;
