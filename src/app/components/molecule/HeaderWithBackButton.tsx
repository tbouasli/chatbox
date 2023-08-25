import React from 'react';

import BackButton from '@/shared/components/atom/BackButton';

import Header, { HeaderProps } from '@/app/components/atom/Header';

export interface HeaderWithBackButtonProps extends HeaderProps {
    children?: React.ReactNode;
    onClick?: () => void;
}

function HeaderWithBackButton({ children, onClick, className }: HeaderWithBackButtonProps) {
    return (
        <Header className={className}>
            <BackButton onClick={onClick} />
            {children}
        </Header>
    );
}

export default HeaderWithBackButton;
