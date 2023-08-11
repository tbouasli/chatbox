import React from 'react';

import BackButton from '@/shared/components/atom/BackButton';

import AppHeader from './AppHeader';

interface AppHeaderProps extends Pick<React.HTMLProps<HTMLDivElement>, 'className'> {
    children?: React.ReactNode;
}

function AppHeaderWithBackButton({ children, className }: AppHeaderProps) {
    return (
        <AppHeader className={className}>
            <BackButton />
            {children}
        </AppHeader>
    );
}

export default AppHeaderWithBackButton;
