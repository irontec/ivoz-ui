import { PropertySpec } from 'services/api';

export const collectReferences = (
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

function isObject(value: any): boolean {
  return value && typeof value === 'object';
}

function isReferenceObject(obj: any): boolean {
  return isObject(obj) && obj.hasOwnProperty('$ref');
}

export const findMatchingColumns = (
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

function getSingularForm(word: string): string {
  return word.endsWith('s')
    ? word.slice(0, -1).toLowerCase()
    : word.toLowerCase();
}

// Helper function to check if an object contains a value that includes a target string (case-insensitive)
function objectHasMatchingValue(obj: any, target: string): boolean {
  return Object.values(obj).some((value) => {
    return typeof value === 'string' && value.toLowerCase().includes(target);
  });
}
