import { EntityItem } from '../router/routeMapParser';
import { PropertySpec } from 'services/api';

type GetMarshallerWhiteListPropsType = Pick<
  EntityItem,
  'filterBy' | 'filterValues' | 'fixedValues'
>;

const getMarshallerWhiteList = (
  props: GetMarshallerWhiteListPropsType
): string[] => {
  const { filterBy, fixedValues, filterValues } = props;

  const whitelist: string[] = [];
  if (filterBy) {
    whitelist.push(filterBy);
  }
  if (fixedValues) {
    whitelist.push(...Object.keys(fixedValues));
  }
  if (filterValues) {
    // Sanitize values like type[exact]
    const sanitizedFilterValues = Object.keys(filterValues)
      .map((value) => value.match(/^[^[]+/)?.[0] || '')
      .filter((value) => value);

    whitelist.push(...sanitizedFilterValues);
  }

  return whitelist;
};

const collectReferences = (
  obj: any,
  references: PropertySpec[] = []
): PropertySpec[] => {
  if (isReferenceObject(obj)) {
    references.push(obj);
  }

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (isObject(value)) {
      collectReferences(value, references);
    }
  });

  return references;
};

const isObject = (value: any): boolean => {
  return value && typeof value === 'object';
};

const isReferenceObject = (obj: any): boolean => {
  return isObject(obj) && obj.hasOwnProperty('$ref');
};

const findMatchingColumns = (
  columnNames: string[],
  inverseRelations: PropertySpec[]
): string[] => {
  return columnNames.filter((column) => {
    const singularColumn = getSingularForm(column);

    return inverseRelations.some((relation) => {
      return objectHasMatchingValue(relation, singularColumn);
    });
  });
};

const getSingularForm = (word: string): string => {
  return word.endsWith('s')
    ? word.slice(0, -1).toLowerCase()
    : word.toLowerCase();
};

const objectHasMatchingValue = (obj: any, target: string): boolean => {
  return Object.values(obj).some((value) => {
    return typeof value === 'string' && value.toLowerCase().includes(target);
  });
};

export { getMarshallerWhiteList, collectReferences, findMatchingColumns };
