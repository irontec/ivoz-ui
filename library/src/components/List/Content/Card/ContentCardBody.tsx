import { Box, Collapse } from '@mui/material';
import { useState } from 'react';
import {
  MultiSelectFunctionComponent,
  RouteMapItem,
} from '../../../../router/routeMapParser';
import { EntityValues, PropertySpec } from '../../../../services';
import EntityService from '../../../../services/entity/EntityService';
import EditRowButton from '../CTA/EditRowButton';
import ViewRowButton from '../CTA/ViewRowButton';
import ChildEntityLinks from '../Shared/ChildEntityLinks';
import { handleMultiselectChangeType } from '../Table/hook/useMultiselectState';
import ContentCardRow from './ContentCardRow';
import { useStoreState } from '../../../../store';

export interface ContentCardProps {
  childEntities: Array<RouteMapItem>;
  entityService: EntityService;
  ignoreColumn: string | undefined;
  selectedValues: string[];
  handleChange: handleMultiselectChangeType;
  path: string;
  visibleColumns: { [k: string]: PropertySpec };
  row: EntityValues;
  className?: string;
}

const ContentCardBody = (props: ContentCardProps): JSX.Element => {
  const {
    visibleColumns,
    row,
    entityService,
    selectedValues,
    handleChange,
    childEntities,
    path,
    className,
  } = props;

  const [open, setOpen] = useState(false);

  const entity = entityService.getEntity();
  const ChildDecorator = entity.ChildDecorator;

  const parentRow = useStoreState((state) => state.list.parentRow);
  const acl = entityService.getAcls(parentRow);

  const multiselectActions = Object.values(entity.customActions)
    .filter((action) => action.multiselect || action.global)
    .map((item) => item.action as MultiSelectFunctionComponent);

  const multiselect =
    (entity.deleteDoubleCheck !== true && acl.delete === true) ||
    multiselectActions.length > 0;

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
    disabled: !acl.delete,
  };

  const localVisibleColumns = { ...visibleColumns };
  const visibleColumnNames = Object.keys(localVisibleColumns);
  const firstColumnName = visibleColumnNames.shift() as string;
  const firstColumn = localVisibleColumns[firstColumnName];
  delete localVisibleColumns[firstColumnName];

  const showDetail = acl.detail && !acl.update;

  return (
    <Box className={className}>
      <ContentCardRow
        columnName={firstColumnName}
        multiselect={multiselect}
        isFirstRow={true}
        column={firstColumn}
        row={row}
        entityService={entityService}
        selectedValues={selectedValues}
        handleMultiselectChange={handleChange}
        expanded={open}
        setExpanded={setOpen}
      />
      <Collapse in={open} timeout='auto' unmountOnExit>
        {visibleColumnNames.map((key: string, idx: number) => {
          const column = visibleColumns[key];

          return (
            <ContentCardRow
              key={idx}
              columnName={key}
              multiselect={multiselect}
              isFirstRow={false}
              column={column}
              row={row}
              entityService={entityService}
              selectedValues={selectedValues}
              handleMultiselectChange={handleChange}
              expanded={false}
              setExpanded={() => {
                /* noop */
              }}
            />
          );
        })}
        <Box className='actions'>
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
                  disabled={!acl.update}
                >
                  <EditRowButton disabled={!acl.update} row={row} path={path} />
                </ChildDecorator>
              )
            }
            deleteMapItem={deleteMapItem}
          />
        </Box>
      </Collapse>
    </Box>
  );
};

export default ContentCardBody;
