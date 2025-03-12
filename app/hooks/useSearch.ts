import { usePathname, useSearchParams, useRouter } from 'next/navigation';

function useSearch() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const params = new URLSearchParams(searchParams);

    const { replace } = useRouter();

    function updateSearchUrl(term: string = '') {
        params.set('page', '1');

        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    const searchQuery = searchParams.get('query')?.toString();

    return { updateSearchUrl, searchQuery, searchParams, pathname, params };
}

export default useSearch;
