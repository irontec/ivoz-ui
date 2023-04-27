/* eslint-disable no-script-url */

import queryString from 'query-string';
import { KeyValList } from '../../services/api/ParsedApiSpecInterface';
import { CriteriaFilterValues } from './Filter/ContentFilterDialog';
import { SearchFilterType } from './Filter/icons/FilterIconFactory';

export const criteriaToArray = (where: CriteriaFilterValues): Array<string> => {
  if (!where.length) {
    return [];
  }

  const searchArguments: Array<string> = [];
  for (const criteria of where) {
    const { name, type, value } = criteria;
    if (type === 'exists') {
      searchArguments.push(`exists[${name}]=true`);
    } else if (type === 'in') {
      searchArguments.push(`${name}[]=${value}`);
    } else if (type !== '') {
      searchArguments.push(`${name}[${type}]=${value}`);
    } else {
      searchArguments.push(`${name}=${value}`);
    }
  }

  searchArguments.sort((a: string, b: string) => {
    if (a.indexOf('_') >= 0 && b.indexOf('_') < 0) return 1;
    if (b.indexOf('_') >= 0 && a.indexOf('_') < 0) return -1;

    return a < b ? -1 : a > b ? 1 : 0;
  });

  return searchArguments;
};

export const queryStringToCriteria = (): CriteriaFilterValues => {
  return stringToCriteria(location.search);
};

export const stringToCriteria = (uri = ''): CriteriaFilterValues => {
  const criteria: CriteriaFilterValues = [];
  const querystring: KeyValList = queryString.parse(uri);

  for (const idx in querystring) {
    const value = querystring[idx] as string | number | boolean | Array<any>;
    const matches = idx.match(/([^[]+)\[?([^\]]*)\]?/);

    if (!matches) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const val of value) {
        criteria.push({
          name: matches[1],
          type: 'in',
          value: val,
        });
      }

      continue;
    }

    if (matches[0] === `${matches[1]}[]`) {
      criteria.push({
        name: matches[1],
        type: 'in',
        value: value,
      });

      continue;
    }

    if (matches[1] === 'exists') {
      criteria.push({
        name: matches[2],
        type: 'exists',
        value: '',
      });

      continue;
    }

    criteria.push({
      name: matches[1],
      type: matches[2] as SearchFilterType,
      value,
    });
  }

  return criteria;
};
