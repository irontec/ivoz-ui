import { PropertySpec } from '../../../../services';
import EntityService from '../../../../services/entity/EntityService';
import { useStoreState } from '../../../../store';

type useFirstColumnProps = {
  entityService: EntityService;
  ignoreColumn: string | undefined;
};

const useFirstColumn = (props: useFirstColumnProps): [string, PropertySpec] => {
  const { entityService, ignoreColumn } = props;

  const storeState = useStoreState(
    (state) => state,
    () => {
      return true;
    }
  );

  const columns = entityService.getCollectionColumns(storeState);
  const firstColumnKey = Object.keys(columns).find(
    (columnKey) => columnKey !== ignoreColumn
  ) as string;

  const firstColumnSpec = entityService.getProperties()[firstColumnKey];

  return [firstColumnKey, firstColumnSpec];
};

export default useFirstColumn;
