import React from 'react';

import BackButton from '@/shared/components/atom/BackButton';

import AppHeader from './AppHeader';

interface AppHeaderProps extends Pick<React.HTMLProps<HTMLDivElement>, 'className'> {
    children?: React.ReactNode;
    onClick?: () => void;
}

function AppHeaderWithBackButton({ children, onClick, className }: AppHeaderProps) {
    return (
        <AppHeader className={className}>
            <BackButton onClick={onClick} />
            {children}
        </AppHeader>
    );
}

export default AppHeaderWithBackButton;
