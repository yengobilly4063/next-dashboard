import useSearch from './useSearch';

function usePagination() {
    const { pathname, searchParams, params } = useSearch();
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (pageNumber: number | string) => {
        params.set('page', pageNumber.toString());

        return `${pathname}?${params.toString()}`;
    };

    return { currentPage, createPageURL };
}

export default usePagination;
