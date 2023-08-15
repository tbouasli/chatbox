import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

import Title from '@/shared/components/atom/Title';
import AppHeaderWithBackButton from '@/shared/components/molecule/AppHeaderWithBackButton';

function FriendsHeader() {
    return (
        <AppHeaderWithBackButton>
            <div className="flex items-center justify-between w-full">
                <Title text="Friends" />
                <div className="flex items-center gap-2">
                    <Link to="/app/friends/add">
                        <UserPlus className="text-primary" height={24} width={24} />
                    </Link>
                </div>
            </div>
        </AppHeaderWithBackButton>
    );
}

export default FriendsHeader;
