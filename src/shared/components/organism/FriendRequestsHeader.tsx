import Title from '@/shared/components/atom/Title';
import AppHeaderWithBackButton from '@/shared/components/molecule/AppHeaderWithBackButton';

function FriendsRequestsHeader() {
    return (
        <AppHeaderWithBackButton>
            <Title text="Friend Requests" />
        </AppHeaderWithBackButton>
    );
}

export default FriendsRequestsHeader;
