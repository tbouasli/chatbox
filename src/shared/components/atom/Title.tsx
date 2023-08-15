import React from 'react';
import { twMerge } from 'tailwind-merge';

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    text: string;
}

function Title({ text, className, ...props }: TitleProps) {
    return (
        <h1 className={twMerge('font-title text-primary text-2xl text-start', className)} {...props}>
            {text}
        </h1>
    );
}

export default Title;
