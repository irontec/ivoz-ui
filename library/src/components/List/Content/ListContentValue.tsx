import { Box, Fade, Skeleton } from '@mui/material';
import { matchRoutes } from 'react-router-dom';
import { useStoreState } from 'store';
import {
  FkProperty,
  isPropertyFk,
  PropertySpec,
  ScalarProperty,
} from '../../../services/api/ParsedApiSpecInterface';
import EntityService from '../../../services/entity/EntityService';
import {
  StyledCheckBoxIcon,
  StyledCheckBoxOutlineBlankIcon,
  StyledTableRowFkLink,
} from './Table/ContentTable.styles';
import DownloadFile from '../DownloadFile';
import CollapsibleArrayValue from './CollapsibleArrayValue';

interface ListContentValueProps {
  columnName: string;
  column: PropertySpec;
  row: Record<string, any>;
  entityService: EntityService;
}

const ListContentValue = (props: ListContentValueProps): JSX.Element => {
  const { column, columnName, row, entityService } = props;
  const routes = useStoreState((state) => state.routes.routes);

  const ListDecorator = entityService.getListDecorator();
  const customComponent = (column as ScalarProperty).component;
  const isDownloadable = (column as ScalarProperty).downloadable;
  const isFileType = (column as ScalarProperty).type === 'file';
  const isFk = isPropertyFk(column);
  const prefix = column?.prefix || '';
  const loadingFk =
    isFk &&
    (column as FkProperty).type !== 'array' &&
    row[columnName] &&
    !row[`${columnName}Id`];

  const valuePath = columnName.split('.');
  const value =
    valuePath.length > 1
      ? row[valuePath.shift() as string][valuePath.shift() as string]
      : row[columnName];

  const shouldUseCollapsible =
    typeof value === 'string' &&
    value.includes(',') &&
    value.split(',').length > 3;

  if (shouldUseCollapsible) {
    return (
      <Box component='span' className='cell'>
        {prefix}
        <CollapsibleArrayValue values={value} />
      </Box>
    );
  }

  const isMultiSelect = (column as ScalarProperty).type === 'array';
  const loadingMultiselect = isMultiSelect && Array.isArray(value);
  const loadingValue = loadingFk || loadingMultiselect;

  const enumValues: any = (column as ScalarProperty).enum;
  const isBoolean = typeof value === 'boolean';

  let response = value;

  if (customComponent) {
    response = <ListDecorator field={columnName} row={row} property={column} />;
  } else if (isFk) {
    const nullValue = row[columnName] === null;
    const emptyValue =
      nullValue || (!row[columnName] && !row[`${columnName}Id`]);
    const preparedValue = Boolean(row[`${columnName}Id`]);

    if (nullValue) {
      return <>{column.null}</>;
    } else if (
      loadingValue ||
      (!isMultiSelect && !emptyValue && !preparedValue && !customComponent)
    ) {
      response = (
        <Fade
          in={true}
          style={{
            transitionDelay: '1000ms',
          }}
          unmountOnExit
        >
          <Skeleton variant='text' />
        </Fade>
      );
    } else if (row[`${columnName}Link`]) {
      const routeExists = matchRoutes(routes, row[`${columnName}Link`]);

      if (!routeExists) {
        return value;
      }

      response = (
        <StyledTableRowFkLink to={row[`${columnName}Link`]}>
          {value}
        </StyledTableRowFkLink>
      );
    }
  } else if (isBoolean && !enumValues && value) {
    response = <StyledCheckBoxIcon />;
  } else if (isBoolean && !enumValues) {
    response = <StyledCheckBoxOutlineBlankIcon />;
  } else {
    response = <ListDecorator field={columnName} row={row} property={column} />;
  }

  if (isDownloadable && isFileType) {
    response = (
      <DownloadFile
        row={row}
        path={entityService.getEntity().path}
        fileType={columnName}
      />
    );
  }


  return (
    <Box component='span' className='cell'>
      {prefix}
      {response}
    </Box>
  );
};

export default ListContentValue;
