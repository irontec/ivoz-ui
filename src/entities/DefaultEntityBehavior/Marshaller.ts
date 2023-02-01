import { PartialPropertyList } from '../../services/api/ParsedApiSpecInterface';

export type MarshallerValues = { [key: string]: any };

const marshaller = (
  values: MarshallerValues,
  properties: PartialPropertyList
): MarshallerValues => {
  values = { ...values };
  for (const idx in values) {
    const property: any = properties[idx];

    if (!property || property.readOnly) {
      delete values[idx];
      continue;
    }

    if (property?.type === 'file') {
      if (values[idx].file) {
        values[idx] = values[idx].file;
      }

      continue;
    }

    if (property?.type === 'boolean') {
      continue;
    }

    if (property?.multilang === true) {
      continue;
    }

    if (property?.$ref && values[idx] === '') {
      values[idx] = null;

      continue;
    }

    if (values[idx] === '__null__') {
      values[idx] = null;
    }

    if (property?.type === 'integer' && values[idx] === '') {
      values[idx] = null;

      continue;
    }
  }

  return values;
};

export default marshaller;
