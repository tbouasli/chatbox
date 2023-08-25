import { auth } from '@/lib/firebase';

import Title from '@/shared/components/atom/Title';

import HeaderWithBackButton from '@/app/components/molecule/HeaderWithBackButton';

function OnBoardingHeader() {
    return (
        <HeaderWithBackButton onClick={() => auth.signOut()}>
            <Title text="Create Profile" />
        </HeaderWithBackButton>
    );
}

export default OnBoardingHeader;
