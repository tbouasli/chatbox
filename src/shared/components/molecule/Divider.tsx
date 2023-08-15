import React from 'react';

import Divider from '@/shared/components/atom/Divider';

interface DividerWithInfixProps {
    infix: string;
}

function DividerWithInfix({ infix }: DividerWithInfixProps) {
    return (
        <div className="flex items-center gap-2">
            <Divider />
            <span className="text-accent">{infix}</span>
            <Divider />
        </div>
    );
}

export default DividerWithInfix;
