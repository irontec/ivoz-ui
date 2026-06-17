/* eslint-disable no-script-url */

import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { CriteriaFilterValues } from './Filter/ContentFilterDialog';
import { criteriaToArray, stringToCriteria } from './List.helpers';

const useQueryStringParams = function (): Array<string> {
  const { search } = useLocation();
  return useMemo(() => {
    const uriCriteria: CriteriaFilterValues = stringToCriteria(search);
    return criteriaToArray(uriCriteria);
  }, [search]);
};

export default useQueryStringParams;
