import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch';

import UsersFoundList from '@/shared/components/molecule/UsersFoundList';
import SearchUserHeader from '@/shared/components/organism/AddFriendsHeader';

function SearchUserPage() {
    return (
        <main className="page">
            <InstantSearch indexName="users" searchClient={algoliasearch('QQ1S86RR9J', '23773b1dbe61cdc8f6b7e8236bcdede8')}>
                <SearchUserHeader />
                <UsersFoundList />
            </InstantSearch>
        </main>
    );
}
export default SearchUserPage;
