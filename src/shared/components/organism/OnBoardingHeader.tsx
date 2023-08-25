import { signOut } from 'firebase/auth';

import { auth } from '@/lib/firebase';

import Title from '@/shared/components/atom/Title';
import AppHeaderWithBackButton from '@/shared/components/molecule/AppHeaderWithBackButton';

function OnBoardingHeader() {
    return (
        <AppHeaderWithBackButton onClick={() => signOut(auth)}>
            <Title text="Create Profile" />
        </AppHeaderWithBackButton>
    );
}

export default OnBoardingHeader;
