import { useNavigate } from 'react-router-dom';

import NotificationBadge from '@/shared/components/atom/NotificationBadge';

import useAppData from '@/app/hooks/useAppData';

import ListItem from './ListItem';

function FriendRequests() {
    const { friendships } = useAppData();
    const navigate = useNavigate();

    if (!friendships.data?.filter((friend) => friend.status === 'pending').length) {
        return null;
    }

    return (
        <ListItem className="py-4 border-y border-primary/40" onClick={() => navigate('/app/friends/requests')}>
            <NotificationBadge count={friendships.data?.filter((friend) => friend.status === 'pending').length} />
            <span>Friend Requests</span>
        </ListItem>
    );
}
export default FriendRequests;
