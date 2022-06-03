/* eslint-disable no-script-url */
import { RefObject } from 'react';
import { TablePagination } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import { useStoreState, useStoreActions } from '../../store';
import { ROUTE_ITEMS_PER_PAGE_KEY, ROUTE_PAGE_KEY } from '../../store/route';
import { CriteriaFilterValue } from './Filter/ContentFilter';

interface ContentTablePaginationProps {
  recordCount: number
  ongoingRequest: boolean,
  listRef: RefObject<any>,
}

export default function Pagination(props: ContentTablePaginationProps): JSX.Element | null {
  const {
    recordCount,
    ongoingRequest,
    listRef
  } = props;

  const itemsPerPage = useStoreState(
    (state) => state.route.itemsPerPage
  );
  const page = useStoreState(
      (state) => state.route.page
  );

  const replaceInQueryStringCriteria = useStoreActions((actions) => {
      return actions.route.replaceInQueryStringCriteria;
  });

  const scrollToTop = () => {
    listRef.current && listRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  };

  const setItemsPerPage = (value: number) => {

    if (ongoingRequest) {
      return;
    }

    const criteria: CriteriaFilterValue = {
      name: ROUTE_ITEMS_PER_PAGE_KEY,
      type: '',
      value
    };
    replaceInQueryStringCriteria(criteria);

    const pageCriteria: CriteriaFilterValue = {
      name: ROUTE_PAGE_KEY,
      type: '',
      value: 1
    };
    replaceInQueryStringCriteria(pageCriteria);

    scrollToTop();
  };

  const setPage = (value: number) => {

    if (ongoingRequest) {
      return;
    }

    const criteria: CriteriaFilterValue = {
      name: ROUTE_PAGE_KEY,
      type: '',
      value
    };
    replaceInQueryStringCriteria(criteria);

    scrollToTop();
  }

  if (recordCount === 0) {
    return null;
  }

  return (
    <ThemeProvider theme={(outerTheme) => createTheme(outerTheme, locales['esES'])}>
      <TablePagination
        component="div"
        page={(page || 1) - 1}
        rowsPerPage={itemsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        count={recordCount}
        backIconButtonProps={{
          'aria-label': 'previous page',
        }}
        nextIconButtonProps={{
          'aria-label': 'next page',
        }}
        onPageChange={(event: any, newPage: any) => {
          setPage(newPage + 1);
        }}
        onRowsPerPageChange={(newRowsPerpage: any) => {
          setItemsPerPage(newRowsPerpage.target.value);
        }}
      />
    </ThemeProvider>
  );
}