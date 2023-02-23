import { Fade, LinearProgress } from '@mui/material';
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

interface ListContentValueProps {
  columnName: string;
  column: PropertySpec;
  row: Record<string, any>;
  entityService: EntityService;
}

const ListContentValue = (props: ListContentValueProps): JSX.Element => {
  const { column, columnName, row, entityService } = props;

  const ListDecorator = entityService.getListDecorator();
  const customComponent = (column as ScalarProperty).component;

  const isFk = isPropertyFk(column);
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

  const isMultiSelect = (column as ScalarProperty).type === 'array';
  const loadingMultiselect = isMultiSelect && Array.isArray(value);
  const loadingValue = loadingFk || loadingMultiselect;

  const enumValues: any = (column as ScalarProperty).enum;
  const isBoolean = typeof value === 'boolean';

  let response = value;
  if (isFk) {
    const emptyValue = !row[columnName] && !row[`${columnName}Id`];
    const preparedValue = Boolean(row[`${columnName}Id`]);

    if (
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
          <LinearProgress color='inherit' />
        </Fade>
      );
    } else if (row[`${columnName}Link`]) {
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

  const prefix = column?.prefix || '';

  return (
    <>
      {prefix}
      {response}
    </>
  );
};

export default ListContentValue;
