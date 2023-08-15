import { useNavigate } from 'react-router-dom';

import NotificationBadge from '@/shared/components/atom/NotificationBadge';

import useAppData from '@/app/hooks/useAppData';

import ListItem from './ListItem';

function FriendRequests() {
    const { user } = useAppData();
    const navigate = useNavigate();

    if (!user.data?.friendRequestsReceived?.length) return null;

    return (
        <ListItem className="py-4 border-y border-primary/40" onClick={() => navigate('/app/friends/requests')}>
            <NotificationBadge count={user.data?.friendRequestsReceived?.length} />
            <span>Friend Requests</span>
        </ListItem>
    );
}
export default FriendRequests;
