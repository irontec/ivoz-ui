import { Table, TableBody, TableRow } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import EntityService from 'services/entity/EntityService';
import { useStoreState } from 'store';
import {
  MultiSelectFunctionComponent,
  RouteMapItem,
} from '../../../../router/routeMapParser';
import DeleteRowButton from '../CTA/DeleteRowButton';
import EditRowButton from '../CTA/EditRowButton';
import ViewRowButton from '../CTA/ViewRowButton';
import ChildEntityLinks from '../Shared/ChildEntityLinks';
import { StyledActionsTableCell } from './ContentTable.styles';
import { TableColumnMemo } from './ContentTableColumn';
import ContentTableHead from './ContentTableHead';
import { handleMultiselectChangeType } from './hook/useMultiselectState';

interface ContentTableProps {
  childEntities: Array<RouteMapItem>;
  entityService: EntityService;
  ignoreColumn: string | undefined;
  path: string;
  selectedValues: string[];
  handleChange: handleMultiselectChangeType;
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
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
  } = props;
  const [currentQueryString, setCurrentQueryString] = useState(
    window.location.search
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

  const deleteMapItem: RouteMapItem = {
    entity,
    route: `${entity.path}/:id`,
  };

  const multiselectActions = Object.values(entity.customActions)
    .filter((action) => action.multiselect)
    .map((item) => item.action as MultiSelectFunctionComponent);

  const columns = entityService.getCollectionColumns();

  const multiselect =
    entityService.getAcls().delete === true || multiselectActions.length > 0;

  const selectAllHandlers: handleMultiselectChangeType = useCallback(
    (event) => {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const rowIds = value ? rows.map((row) => row.id?.toString() || '') : [];

      setSelectedValues(rowIds);
    },
    [rows, setSelectedValues]
  );

  return (
    <Table size='medium' sx={{ tableLayout: 'fixed' }}>
      <ContentTableHead
        entityService={entityService}
        ignoreColumn={ignoreColumn}
        multiselect={multiselect}
        selectAll={selectAllHandlers}
      />
      <TableBody>
        {rows.map((row: any, key: any) => {
          const acl = entityService.getAcls();
          let selectableIdx = 0;

          return (
            <TableRow hover key={key}>
              {Object.keys(columns).map((columnKey: string, idx: number) => {
                if (columnKey === ignoreColumn) {
                  selectableIdx++;
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
                    selectable={multiselect && idx === selectableIdx}
                    selectedValues={selectedValues}
                    handleChange={handleChange}
                  />
                );
              })}
              <StyledActionsTableCell key='actions'>
                {acl.update && (
                  <ChildDecorator routeMapItem={updateRouteMapItem} row={row}>
                    <EditRowButton row={row} path={path} />
                  </ChildDecorator>
                )}
                {acl.detail && !acl.update && (
                  <ChildDecorator routeMapItem={detailMapItem} row={row}>
                    <ViewRowButton row={row} path={path} />
                  </ChildDecorator>
                )}
                <ChildEntityLinks
                  childEntities={childEntities}
                  entityService={entityService}
                  row={row}
                />
                &nbsp;
                {acl.delete && (
                  <ChildDecorator routeMapItem={deleteMapItem} row={row}>
                    <DeleteRowButton row={row} entityService={entityService} />
                  </ChildDecorator>
                )}
              </StyledActionsTableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ContentTable;
