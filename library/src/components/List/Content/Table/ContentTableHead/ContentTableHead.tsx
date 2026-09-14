import {
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { CriteriaFilterValue } from '../../../../../components/List/Filter/ContentFilterDialog';
import EntityService from '../../../../../services/entity/EntityService';
import { useStoreActions, useStoreState } from '../../../../../store';
import { ROUTE_ORDER_KEY } from '../../../../../store/route';
import { handleMultiselectChangeType } from '../hook/useMultiselectState';
import { StyledTableSortLabelVisuallyHidden } from './ContentTableHead.styles';

interface ContentTableHead {
  entityService: EntityService;
  ignoreColumn: string | undefined;
  multiselect: boolean;
  indeterminateSelectAll: boolean;
  checked: boolean;
  selectAll: handleMultiselectChangeType;
}

const ContentTableHead = function (props: ContentTableHead): JSX.Element {
  const {
    entityService,
    ignoreColumn,
    multiselect,
    selectAll,
    checked,
    indeterminateSelectAll,
  } = props;

  const storeState = useStoreState(
    (state) => state,
    () => {
      return true;
    }
  );
  const columns = entityService.getCollectionColumns(storeState);
  const sortableColumns = entityService.getSortableColumns(storeState);

  const order = useStoreState((state) => state.route.order);
  const direction = order?.direction || false;
  const replaceInQueryStringCriteria = useStoreActions((actions) => {
    return actions.route.replaceInQueryStringCriteria;
  });

  const setSort = (property: string, direction: 'asc' | 'desc') => {
    const order: CriteriaFilterValue = {
      name: ROUTE_ORDER_KEY,
      type: property,
      value: direction,
    };

    replaceInQueryStringCriteria(order);
  };

  const createSortHandler = (property: string) => () => {
    const isDesc = order?.name === property && direction === 'desc';
    setSort(property, isDesc ? 'asc' : 'desc');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let selectableIdx = 0;

  return (
    <TableHead>
      <TableRow>
        {multiselect && (
          <TableCell>
            <Checkbox
              checked={checked}
              onChange={selectAll}
              indeterminate={indeterminateSelectAll}
            />
          </TableCell>
        )}
        {Object.keys(columns).map((key: string) => {
          if (key === ignoreColumn) {
            selectableIdx++;
            return null;
          }

          const sortBy = sortableColumns[key];
          const sorted = sortBy !== undefined && order?.name === sortBy;

          return (
            <TableCell
              key={key}
              align='left'
              sortDirection={sorted ? direction : false}
            >
              {sortBy !== undefined && (
                <TableSortLabel
                  active={sorted}
                  direction={order?.direction}
                  onClick={createSortHandler(sortBy)}
                >
                  {columns[key].label}
                  {sorted ? (
                    <StyledTableSortLabelVisuallyHidden>
                      {order?.direction === 'desc'
                        ? 'sorted descending'
                        : 'sorted ascending'}
                    </StyledTableSortLabelVisuallyHidden>
                  ) : null}
                </TableSortLabel>
              )}
              {sortBy === undefined && <>{columns[key].label}</>}
            </TableCell>
          );
        })}
        <TableCell key={'empty slot'} className='actions-cell'></TableCell>
      </TableRow>
    </TableHead>
  );
};

export default ContentTableHead;
