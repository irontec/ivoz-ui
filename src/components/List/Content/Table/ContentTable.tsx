import { Table, TableBody, TableRow } from '@mui/material';
import ContentTableHead from './ContentTableHead';
import EntityService from 'services/entity/EntityService';
import { StyledActionsTableCell, StyledTableCell } from './ContentTable.styles';
import ListContentValue from '../ListContentValue';
import EditRowButton from '../CTA/EditRowButton';
import ViewRowButton from '../CTA/ViewRowButton';
import DeleteRowButton from '../CTA/DeleteRowButton';
import { RouteMapItem } from '../../../../router/routeMapParser';
import ChildEntityLinks from '../Shared/ChildEntityLinks';

interface ContentTableProps {
  childEntities: Array<RouteMapItem>,
  entityService: EntityService,
  rows: Record<string, any>,
  ignoreColumn: string | undefined,
  path: string,
}

const ContentTable = (props: ContentTableProps): JSX.Element => {

  const { childEntities, entityService, rows, path, ignoreColumn } = props;
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

  return (
    <Table size="medium" sx={{ "tableLayout": 'fixed' }}>
      <ContentTableHead
        entityService={entityService}
        ignoreColumn={ignoreColumn}
      />
      <TableBody>
        {rows.map((row: any, key: any) => {

          const columns = entityService.getCollectionColumns();
          const acl = entityService.getAcls();

          return (
            <TableRow hover key={key}>
              {Object.keys(columns).map((columnKey: string) => {

                if (columnKey === ignoreColumn) {
                  return null;
                }

                const column = columns[columnKey];

                return (
                  <StyledTableCell key={columnKey}>
                    <ListContentValue
                      columnName={columnKey}
                      column={column}
                      row={row}
                      entityService={entityService}
                    />
                  </StyledTableCell>
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
                {acl.delete && (
                  <ChildDecorator routeMapItem={deleteMapItem} row={row}>
                    <DeleteRowButton row={row} entityService={entityService} />
                  </ChildDecorator>
                )}
                &nbsp;
                <ChildEntityLinks childEntities={childEntities} entityService={entityService} row={row} />
              </StyledActionsTableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default ContentTable;