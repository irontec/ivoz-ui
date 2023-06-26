import { CriteriaFilterValue } from 'components/List/Filter/ContentFilterDialog';
import EntityService from 'services/entity/EntityService';
import { useStoreState } from '../../../../store';
import { useEffect, useState } from 'react';

type useFirstCriteriaProps = {
  entityService: EntityService;
  path: string;
  ignoreColumn: string | undefined;
};

const useFirstColumnCriteria = (
  props: useFirstCriteriaProps
): CriteriaFilterValue | undefined => {
  const { entityService, ignoreColumn, path } = props;
  const [firstColumnCriteria, setFirstColumnCriteria] = useState<
    undefined | CriteriaFilterValue
  >(undefined);

  const queryStringCriteria = useStoreState((state) => [
    ...state.route.queryStringCriteria,
  ]);

  const storeState = useStoreState(
    (state) => state,
    () => {
      return true;
    }
  );

  useEffect(() => {
    const columns = entityService.getCollectionColumns(storeState);
    const firstColumnKey = Object.keys(columns).find(
      (columnKey) => columnKey !== ignoreColumn
    ) as string;

    const filters = entityService.getPropertyFilters(firstColumnKey, path);
    const filter = filters.includes('partial') ? 'partial' : filters[0];

    const firstCriteria = queryStringCriteria.find((criteria) => {
      return criteria.name === firstColumnKey && criteria.type === filter;
    });

    if (firstCriteria) {
      if (
        JSON.stringify(firstCriteria) === JSON.stringify(firstColumnCriteria)
      ) {
        return;
      }
      setFirstColumnCriteria(firstCriteria);
    } else {
      const newCriteria = {
        name: firstColumnKey,
        type: filter,
        value: '',
      };

      if (JSON.stringify(newCriteria) === JSON.stringify(firstColumnCriteria)) {
        return;
      }

      setFirstColumnCriteria(newCriteria);
    }
  }, [queryStringCriteria]);

  return firstColumnCriteria;
};

export default useFirstColumnCriteria;
