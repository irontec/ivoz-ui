import { isPropertyScalar } from '../../services/api/ParsedApiSpecInterface';
import { CustomFunctionComponentContext } from '../../services/form/Field/CustomComponentWrapper';
import { ListDecoratorType } from '../EntityInterface';

const ListDecorator: ListDecoratorType = (props) => {
  const { field, row, property, ignoreCustomComponent } = props;
  let value = row[field];

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

  if (!value && property.null) {
    value = property.null;
  }

  return value !== null && value !== undefined ? value : '';
};

export default ListDecorator;
