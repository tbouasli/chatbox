import React from 'react';

import AppDataContext from '@/app/provider/AppData';

function useAppData() {
    const { user, chats } = React.useContext(AppDataContext);

    return { user, chats };
}

export default useAppData;
