import { Box, Checkbox, TableBody, TableCell, TableRow } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import EntityService, { EntityValues } from 'services/entity/EntityService';
import { useStoreState } from '../../../../store';
import {
  MultiSelectFunctionComponent,
  RouteMapItem,
} from '../../../../router/routeMapParser';
import EditRowButton from '../CTA/EditRowButton';
import ViewRowButton from '../CTA/ViewRowButton';
import ChildEntityLinks from '../Shared/ChildEntityLinks';
import { StyledActionsTableCell, StyledTable } from './ContentTable.styles';
import { TableColumnMemo } from './ContentTableColumn';
import ContentTableHead from './ContentTableHead';
import { handleMultiselectChangeType } from './hook/useMultiselectState';

export interface ContentTableProps {
  childEntities: Array<RouteMapItem>;
  entityService: EntityService;
  ignoreColumn: string | undefined;
  path: string;
  selectedValues: string[];
  handleChange: handleMultiselectChangeType;
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
}

const ContentTable = (props: ContentTableProps): JSX.Element => {
  const {
    childEntities,
    entityService,
    path,
    ignoreColumn,
    selectedValues,
    handleChange,
    setSelectedValues,
    className,
  } = props;
  const [currentQueryString, setCurrentQueryString] = useState(
    window.location.search
  );

  const storeState = useStoreState(
    (state) => state,
    () => {
      return true;
    }
  );
  const rows = useStoreState((state) => state.list.rows);

  useEffect(() => {
    if (currentQueryString !== window.location.search) {
      setCurrentQueryString(window.location.search);
      setSelectedValues([]);
    }
  }, [currentQueryString, window.location.search]);

  const entity = entityService.getEntity();
  const ChildDecorator = entity.ChildDecorator;

  const updateRouteMapItem: RouteMapItem = {
    entity,
    route: `${entity.path}/:id/update`,
  };

  const detailMapItem: RouteMapItem = {
    entity,
    route: `${entity.path}/:id/detailed`,
  };

  const multiselectActions = Object.values(entity.customActions)
    .filter((action) => action.multiselect)
    .map((item) => item.action as MultiSelectFunctionComponent);

  const columns = entityService.getCollectionColumns(storeState);

  const parentRow = useStoreState((state) => state.list.parentRow);
  const acl = entityService.getAcls(parentRow);
  const multiselect =
    (entity.deleteDoubleCheck !== true && acl.delete === true) ||
    multiselectActions.length > 0;

  const deleteMapItem: RouteMapItem = {
    entity,
    route: `${entity.path}/:id`,
    disabled: !acl.delete,
  };

  const selectAllHandlers: handleMultiselectChangeType = useCallback(
    (event) => {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const rowIds = value ? rows.map((row) => row.id?.toString() || '') : [];

      setSelectedValues(rowIds);
    },
    [rows, setSelectedValues]
  );

  const indeterminateSelectAll = rows.length !== selectedValues.length;
  const checked = selectedValues.length > 0;
  const showDetail = acl.detail && !acl.update;

  return (
    <StyledTable size='medium' className={className}>
      <ContentTableHead
        entityService={entityService}
        ignoreColumn={ignoreColumn}
        multiselect={multiselect}
        selectAll={selectAllHandlers}
        checked={checked}
        indeterminateSelectAll={checked && indeterminateSelectAll}
      />
      <TableBody>
        {rows.map((row: EntityValues, key: number) => {
          const checked =
            selectedValues.indexOf(row?.id?.toString() as string) > -1;

          const isEditable = row.editable ?? true;
          return (
            <TableRow key={`${key}-${row.id}`}>
              {multiselect && (
                <TableCell>
                  <Checkbox
                    name={`${row.id}`}
                    checked={checked}
                    onChange={handleChange}
                  />
                </TableCell>
              )}
              {Object.keys(columns).map((columnKey: string) => {
                if (columnKey === ignoreColumn) {
                  return null;
                }

                const column = columns[columnKey];

                return (
                  <TableColumnMemo
                    key={columnKey}
                    columnName={columnKey}
                    column={column}
                    row={row}
                    entityService={entityService}
                  />
                );
              })}
              <StyledActionsTableCell key='actions'>
                <Box className='actions-cell'>
                  <ChildEntityLinks
                    childEntities={childEntities}
                    entityService={entityService}
                    row={row}
                    detail={
                      showDetail && (
                        <ChildDecorator
                          variant='icon'
                          routeMapItem={detailMapItem}
                          row={row}
                          entityService={entityService}
                        >
                          <ViewRowButton row={row} path={path} />
                        </ChildDecorator>
                      )
                    }
                    edit={
                      (acl.update || !showDetail) && (
                        <ChildDecorator
                          variant='icon'
                          routeMapItem={updateRouteMapItem}
                          row={row}
                          entityService={entityService}
                          disabled={!acl.update || !isEditable}
                        >
                          <EditRowButton
                            disabled={!acl.update || !isEditable}
                            row={row}
                            path={path}
                          />
                        </ChildDecorator>
                      )
                    }
                    deleteMapItem={deleteMapItem}
                  />
                </Box>
              </StyledActionsTableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </StyledTable>
  );
};

export default ContentTable;
