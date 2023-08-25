import Title from '@/shared/components/atom/Title';

import HeaderWithBackButton from '@/app/components/molecule/HeaderWithBackButton';

function FriendsRequestsHeader() {
    return (
        <HeaderWithBackButton>
            <Title text="Friend Requests" />
        </HeaderWithBackButton>
    );
}

export default FriendsRequestsHeader;
