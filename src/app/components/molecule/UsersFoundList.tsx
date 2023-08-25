import { useHits, useSearchBox } from 'react-instantsearch';

import UserFoundItem from '@/app/components/molecule/UserFoundItem';
import { User } from '@/app/infra/models/User';

function UsersFoundList() {
    const { query } = useSearchBox();
    const { hits } = useHits();

    function mapToUser(hit: (typeof hits)[0]) {
        return new User({
            id: hit.objectID,
            displayName: hit.displayName as string,
            nickname: hit.nickname as string,
            photoURL: hit.photoURL as string,
        });
    }

    if (query.length === 0) return null;

    return (
        <div className="flex flex-col gap-2 overflow-scroll shrink-0">
            {hits.map(mapToUser).map((user) => (
                <UserFoundItem key={user.id} user={user} loading={false} />
            ))}
        </div>
    );
}
export default UsersFoundList;
