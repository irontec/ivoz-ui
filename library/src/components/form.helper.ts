import { EntityItem } from '../router/routeMapParser';

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

export { getMarshallerWhiteList };
