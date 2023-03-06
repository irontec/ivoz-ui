import { isPropertyScalar } from '../../services/api/ParsedApiSpecInterface';
import { CustomFunctionComponentContext } from '../../services/form/Field/CustomComponentWrapper';
import { ListDecoratorType } from '../EntityInterface';
import ListDecoratorMultilang from './ListDecoratorMultilang';

const ListDecorator: ListDecoratorType = (props) => {
  const { field, row, property, ignoreCustomComponent } = props;

  const valuePath = field.split('.');
  let value =
    valuePath.length > 1
      ? row[valuePath.shift() as string][valuePath.shift() as string]
      : row[field];

  if (property.component && !ignoreCustomComponent) {
    return (
      <property.component
        _columnName={field}
        _context={CustomFunctionComponentContext.read}
        values={row}
        property={property}
        disabled={false}
        changeHandler={() => {
          return null;
        }}
        onBlur={() => {
          return null;
        }}
      />
    );
  }

  if (isPropertyScalar(property) && property.multilang === true) {
    return (
      <ListDecoratorMultilang field={field} row={row} property={property} />
    );
  }

  if (property.type === 'file') {
    return value.baseName;
  }

  if (isPropertyScalar(property) && property.enum) {
    let idx = value;
    if (typeof value == 'boolean') {
      idx = value ? 1 : 0;
    }

    if (property.enum[idx]) {
      value = property.enum[idx];
    }
  }

  if (isPropertyScalar(property) && property.format === 'date') {
    return value.substring(0, 10);
  }

  if (!value && property.null) {
    value = property.null;
  }
  return value !== null && value !== undefined ? value : '';
};

export default ListDecorator;
