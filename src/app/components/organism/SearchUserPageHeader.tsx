import { Search } from 'lucide-react';
import React from 'react';
import { useSearchBox } from 'react-instantsearch';

import { Input } from '@/shared/components/ui/input';

import HeaderWithBackButton from '@/app/components/molecule/HeaderWithBackButton';

function SearchUserPageHeader() {
    const { refine } = useSearchBox();

    const handleChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.value.length === 0) return;

            refine(e.target.value);
        },
        [refine],
    );

    return (
        <HeaderWithBackButton>
            <div className="flex items-center w-full gap-3">
                <Search className="text-input" height={20} width={20} />
                <Input placeholder="Search" onChange={handleChange} />
            </div>
        </HeaderWithBackButton>
    );
}

export default SearchUserPageHeader;
