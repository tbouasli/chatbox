import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface HeaderProps extends Pick<React.HTMLProps<HTMLDivElement>, 'className'> {
    children?: React.ReactNode;
}

function Header({ children, className }: HeaderProps) {
    return <header className={twMerge('flex items-center gap-3 p-4 h-[72px]', className)}>{children}</header>;
}

export default Header;
