import React from 'react';

import AppDataContext from '@/app/provider/AppData';

function useAppData() {
    const { user, chats, friendships } = React.useContext(AppDataContext);

    return { user, chats, friendships };
}

export default useAppData;
