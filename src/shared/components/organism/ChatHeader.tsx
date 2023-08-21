import useAppData from '@/app/hooks/useAppData';
import useChatData from '@/app/hooks/useChatData';

import AppHeaderWithBackButton from '../molecule/AppHeaderWithBackButton';
import UserItem from '../molecule/UserItem';

interface ChatHeaderProps {
    id?: string;
}

function ChatHeader({ id }: ChatHeaderProps) {
    const { data, loading } = useChatData(id ?? 'loading');
    const { user } = useAppData();

    const visual = data?.getVisual(user?.data?.id ?? 'loading');

    return (
        <AppHeaderWithBackButton>
            <UserItem
                displayName={visual?.displayName ?? 'Loading...'}
                photoURL={visual?.photoURL ?? ''}
                loading={loading || user.loading}
            />
        </AppHeaderWithBackButton>
    );
}
export default ChatHeader;
