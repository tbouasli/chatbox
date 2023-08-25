import React from 'react';
import { Navigate } from 'react-router-dom';

import useChatData, { ChatsData } from '@/app/hooks/useChatData';
import useFriendshipData, { FriendshipsData } from '@/app/hooks/useFriendshipData';
import useUserData, { UserData } from '@/app/hooks/useUserData';

interface AppDataProps {
    user: UserData;
    chats: ChatsData;
    friendships: FriendshipsData;
}

const defaultData = {
    data: null,
    loading: true,
};

const AppDataContext = React.createContext<AppDataProps>({
    user: defaultData,
    chats: defaultData,
    friendships: defaultData,
});

export function AppDataProvider({ children }: { children: React.ReactNode }) {
    const userData = useUserData();
    const chatsData = useChatData();
    const friendshipsData = useFriendshipData();

    if (!userData.data && !userData.loading) {
        return <Navigate to="/app/on-boarding" />;
    }

    return (
        <AppDataContext.Provider value={{ user: userData, chats: chatsData, friendships: friendshipsData }}>
            {children}
        </AppDataContext.Provider>
    );
}

export default AppDataContext;
