import {
  isPropertyEmbeddable,
  isPropertyScalar,
} from '../../services/api/ParsedApiSpecInterface';
import { CustomFunctionComponentContext } from '../../services/form/Field/CustomComponentWrapper';
import { ListDecoratorType } from '../EntityInterface';
import ListDecoratorMultilang from './ListDecoratorMultilang';
import { ImageFileUploader } from '../../services/form/Field/FileUploader/Variant/ImageFileUploader';

const ListDecorator: ListDecoratorType = (props) => {
  const { field, row, property, ignoreCustomComponent, entityPath } = props;

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

  if (isPropertyEmbeddable(property) && property.multilang === true) {
    return (
      <ListDecoratorMultilang field={field} row={row} property={property} />
    );
  }

  if (property.type === 'file') {
    const isImage = value?.mimeType?.includes('image/');

    if (isImage && entityPath) {
      return (
        <ImageFileUploader
          _columnName={field}
          _context={CustomFunctionComponentContext.read}
          values={row}
          property={property}
          disabled={false}
          readOnly={true}
          downloadPath={`${entityPath}/${row.id}/${field}`}
          handleDownload={async () => Promise.resolve()}
          changeHandler={() => null}
          onBlur={() => null}
          choices={null}
          hasChanged={false}
        />
      );
    }

    return value?.baseName;
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
    return value?.substring(0, 10) || '';
  }

  if (isPropertyScalar(property) && property.format === 'date-time') {
    const localStringOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return value
      ? new Date(value).toLocaleString(navigator.language, localStringOptions)
      : '';
  }

  if (!value && property.null) {
    value = property.null;
  }
  return value !== null && value !== undefined ? value : '';
};

export default ListDecorator;
