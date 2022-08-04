import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { isPropertyFk } from '../../../../../services/api/ParsedApiSpecInterface';
import EntityService from '../../../../../services/entity/EntityService';
import { useStoreActions, useStoreState } from '../../../../../store';
import { ROUTE_ORDER_KEY } from '../../../../../store/route';
import { CriteriaFilterValue } from '../../../Filter/ContentFilter';
import { handleMultiselectChangeType } from '../hook/useMultiselectState';
import { StyledTableSortLabelVisuallyHidden } from './ContentTableHead.styles';

interface ContentTableHead {
  entityService: EntityService;
  ignoreColumn: string | undefined;
  multiselect: boolean;
  selectAll: handleMultiselectChangeType;
}

const ContentTableHead = function (props: ContentTableHead): JSX.Element {
  const { entityService, ignoreColumn, multiselect, selectAll } = props;

  const columns = entityService.getCollectionColumns();

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

  let selectableIdx = 0;
  const styles = {
    borderBottom: '1px solid rgba(0, 0, 0, 0.5)',
  };

  return (
    <TableHead>
      <TableRow>
        {Object.keys(columns).map((key: string, idx: number) => {
          if (key === ignoreColumn) {
            selectableIdx++;
            return null;
          }

          return (
            <TableCell
              key={key}
              align='left'
              padding='normal'
              sortDirection={order?.name === key ? direction : false}
              sx={styles}
            >
              {idx === selectableIdx && multiselect && (
                <input
                  type='checkbox'
                  style={{ marginRight: '10px', verticalAlign: 'middle' }}
                  onChange={selectAll}
                />
              )}
              {!isPropertyFk(columns[key]) && (
                <TableSortLabel
                  active={order?.name === key}
                  direction={order?.direction}
                  onClick={createSortHandler(key)}
                >
                  {columns[key].label}
                  {order?.name === key ? (
                    <StyledTableSortLabelVisuallyHidden>
                      {order?.direction === 'desc'
                        ? 'sorted descending'
                        : 'sorted ascending'}
                    </StyledTableSortLabelVisuallyHidden>
                  ) : null}
                </TableSortLabel>
              )}
              {isPropertyFk(columns[key]) && (
                <>
                  {columns[key].label}
                  {order?.name === key ? (
                    <StyledTableSortLabelVisuallyHidden>
                      {order?.direction === 'desc'
                        ? 'sorted descending'
                        : 'sorted ascending'}
                    </StyledTableSortLabelVisuallyHidden>
                  ) : null}
                </>
              )}
            </TableCell>
          );
        })}
        <TableCell
          key={'empty slot'}
          align='left'
          padding='normal'
          sx={styles}
        ></TableCell>
      </TableRow>
    </TableHead>
  );
};

export default ContentTableHead;
