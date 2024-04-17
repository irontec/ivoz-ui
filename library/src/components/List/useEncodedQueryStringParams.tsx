/* eslint-disable no-script-url */

import { useState, useEffect } from 'react';
import { CriteriaFilterValues } from './Filter/ContentFilterDialog';
import { criteriaToArray, stringToCriteria } from './List.helpers';

const useEncodedQueryStringParams = function (): Array<string> {
  const [currentQueryParams, setCurrentQueryParams] = useState<Array<string>>(
    []
  );
  const uri = location.search;

  useEffect(() => {
    const uriCriteria: CriteriaFilterValues = stringToCriteria(uri);

    const result = [];
    for (const criteria of uriCriteria) {
      const encodedValue = encodeURIComponent(criteria.value);

      result.push({
        ...criteria,
        value: encodedValue,
      });
    }

    setCurrentQueryParams(criteriaToArray(result));
  }, [uri]);

  return currentQueryParams;
};

export default useEncodedQueryStringParams;
