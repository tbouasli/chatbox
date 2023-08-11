import React from 'react';
import { twMerge } from 'tailwind-merge';

interface AppHeaderProps extends Pick<React.HTMLProps<HTMLDivElement>, 'className'> {
    children?: React.ReactNode;
}

function AppHeader({ children, className }: AppHeaderProps) {
    return <header className={twMerge('flex items-center gap-3 p-4 h-[72px]', className)}>{children}</header>;
}

export default AppHeader;
