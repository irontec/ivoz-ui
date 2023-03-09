import {
  PartialPropertyList,
  PropertySpec,
  isPropertyScalar,
  isPropertyFk,
} from '../../services/api/ParsedApiSpecInterface';

export type MarshallerValues = { [key: string]: any };

const marshaller = (
  values: MarshallerValues,
  properties: PartialPropertyList,
  whitelist: string[] = []
): MarshallerValues => {
  values = { ...values };

  for (const idx in values) {
    const property = properties[idx] as PropertySpec | undefined;

    if (!property || property.readOnly) {
      if (!whitelist.includes(idx)) {
        delete values[idx];
      }

      continue;
    }

    if (isPropertyScalar(property) && property.format === 'password') {
      if (values[idx] === '*****') {
        delete values[idx];
      }
      continue;
    }

    if (property?.type === 'file') {
      if (values[idx].file) {
        values[idx] = values[idx].file;
      } else {
        for (const prop in values[idx]) {
          //Empty string to null
          if (values[idx][prop] === '') {
            values[idx][prop] = null;
          }
        }
      }

      continue;
    }

    if (property.type === 'boolean') {
      continue;
    }

    if (isPropertyScalar(property) && property.multilang === true) {
      continue;
    }

    if (isPropertyFk(property) && property.$ref && values[idx] === '') {
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
