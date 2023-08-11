import { User } from '@/app/infra/models/User';

import UserImage from '../atom/UserImage';
import { Button } from '../ui/button';
import ListItem from './ListItem';

interface UserItemProps {
    user?: User;
    loading?: boolean;
}

function UserItem({ user, loading }: UserItemProps) {
    if (loading)
        return (
            <ListItem className="animate-pulse">
                <UserImage loading={loading} />
                <div className="flex flex-col grow overflow-hidden gap-1">
                    <div className="bg-gray-300 rounded h-4 w-4/5" />
                    <div className="bg-gray-300 rounded h-4 w-2/5" />
                </div>
            </ListItem>
        );

    if (!user) return null;

    return (
        <ListItem>
            <UserImage src={user?.photoURL} loading={loading} />
            <div className="flex flex-col grow overflow-hidden">
                <p className="text-base font-semibold truncate">{user?.displayName}</p>
                <p className="text-sm text-gray-500">@{user?.nickname}</p>
            </div>
            <Button size="sm">Add</Button>
        </ListItem>
    );
}
export default UserItem;
