import { Button, Table, TableBody, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentTableHead from './ContentTableHead';
import EntityService from 'services/entity/EntityService';
import { StyledActionsTableCell, StyledTableCell } from './ContentTable.styles';
import EditRowButton from '../CTA/EditRowButton';
import ViewRowButton from '../CTA/ViewRowButton';
import DeleteRowButton from '../CTA/DeleteRowButton';
import { RouteMapItem, MultiSelectFunctionComponent } from '../../../../router/routeMapParser';
import ChildEntityLinks from '../Shared/ChildEntityLinks';
import useMultiselectState from './hook/useMultiselectState';
import { TableTableColumnMemo } from './ContentTableColumn';
import { useState } from 'react';

interface ContentTableProps {
  childEntities: Array<RouteMapItem>,
  entityService: EntityService,
  rows: Array<Record<string, any>>,
  ignoreColumn: string | undefined,
  path: string,
}

const ContentTable = (props: ContentTableProps): JSX.Element => {

  const { childEntities, entityService, rows, path, ignoreColumn } = props;
  const [selectedValues, handleChange, setSelectedValues] = useMultiselectState();
  const [currentQueryString, setCurrentQueryString] = useState(window.location.search);

  if (currentQueryString !== window.location.search) {
    setCurrentQueryString(window.location.search);
    setSelectedValues([]);
  }

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
    .filter(
      action => action.multiselect
    )
    .map(item => item.action as MultiSelectFunctionComponent );

  const columns = entityService.getCollectionColumns();

  const multiselect = /*entityService.getAcls().delete === true ||*/ multiselectActions.length > 0;

  return (
    <Table size="medium" sx={{ "tableLayout": 'fixed' }}>
      <ContentTableHead
        entityService={entityService}
        ignoreColumn={ignoreColumn}
        multiselect={multiselect}
        selectAll={(event) => {
          const target = event.target;
          const value = target.type === 'checkbox' ? target.checked : target.value;
          const rowIds = value
            ? rows.map(row => row.id.toString())
            : [];

          setSelectedValues(rowIds);
        }}
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
                  <TableTableColumnMemo
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
              <StyledActionsTableCell key="actions">
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
                <ChildEntityLinks childEntities={childEntities} entityService={entityService} row={row} />
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
        {multiselect && (
          <TableRow hover key={'multiselect'}>
            <StyledTableCell variant='footer' colSpan={Object.values(columns).length}>
              {false && <Button variant="contained" disabled={selectedValues.length < 1}>
                <DeleteIcon sx={{color: 'white'}} />
              </Button>}
              {multiselectActions.map((Action, key) => {
                  return (
                    <Button
                      key={key}
                      variant="contained"
                      disabled={selectedValues.length < 1}
                      sx={{verticalAlign: 'inherit', marginLeft: '10px', padding: 0}}
                    >
                      <Action
                        style={{padding: '6px 18px 0'}}
                        rows={rows}
                        selectedValues={selectedValues}
                        entityService={entityService}
                      />
                    </Button>
                  );
              })}
            </StyledTableCell>
          </TableRow>
        )}
        </TableBody>
    </Table>
  );
}

export default ContentTable;