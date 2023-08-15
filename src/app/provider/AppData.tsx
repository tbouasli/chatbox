import React from 'react';
import { Navigate } from 'react-router-dom';

import useChatsData, { ChatDTO } from '@/app/hooks/useChatsData';
import useUserData from '@/app/hooks/useUserData';
import { User } from '@/app/infra/models/User';

interface AppDataProps {
    user: {
        data?: User | null;
        loading: boolean;
    };
    chats: {
        data?: ChatDTO[] | null;
        loading: boolean;
    };
}

const defaultData = {
    data: null,
    loading: true,
};

const AppDataContext = React.createContext<AppDataProps>({
    user: defaultData,
    chats: defaultData,
});

export function AppDataProvider({ children }: { children: React.ReactNode }) {
    const userData = useUserData();
    const chatsData = useChatsData();

    if (!userData.data && !userData.loading) {
        return <Navigate to="/on-boarding" />;
    }

    return <AppDataContext.Provider value={{ user: userData, chats: chatsData }}>{children}</AppDataContext.Provider>;
}

export default AppDataContext;
