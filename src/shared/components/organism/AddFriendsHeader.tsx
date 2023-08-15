import { Search } from 'lucide-react';

import AppHeaderWithBackButton from '@/shared/components/molecule/AppHeaderWithBackButton';
import { Input } from '@/shared/components/ui/input';

interface AddFriendsHeaderProps {
    setNickname: (nickname: string) => void;
}

function AddFriendsHeader({ setNickname }: AddFriendsHeaderProps) {
    return (
        <AppHeaderWithBackButton>
            <div className="flex items-center w-full gap-3">
                <Search className="text-input" height={20} width={20} />
                <Input placeholder="Search" onChange={(e) => setNickname(e.target.value)} />
            </div>
        </AppHeaderWithBackButton>
    );
}

export default AddFriendsHeader;
