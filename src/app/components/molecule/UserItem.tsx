import UserImage from '@/shared/components/atom/UserImage';

import ListItem from '../atom/ListItem';

interface UserItemProps {
    onClick?: () => void;
    photoURL?: string;
    displayName?: string;
    nickname?: string;
    loading?: boolean;
    children?: React.ReactNode;
}

function UserItem({ displayName, nickname, photoURL, loading, children, onClick }: UserItemProps) {
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

    return (
        <ListItem onClick={onClick}>
            <UserImage src={photoURL} loading={loading} />
            <div className="flex flex-col grow overflow-hidden">
                <p className="text-base font-semibold truncate">{displayName}</p>
                {nickname && <p className="text-sm text-gray-500">@{nickname}</p>}
            </div>
            {children}
        </ListItem>
    );
}
export default UserItem;
