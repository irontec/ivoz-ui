import { useStoreState } from 'store';
import { RouteMapItem } from '../../../../router/routeMapParser';
import EntityService from '../../../../services/entity/EntityService';
import { handleMultiselectChangeType } from '../Table/hook/useMultiselectState';
import { StyledContentCardBody } from './ContentCardBody.style';

interface ContentCardProps {
  childEntities: Array<RouteMapItem>;
  entityService: EntityService;
  ignoreColumn: string | undefined;
  selectedValues: string[];
  handleChange: handleMultiselectChangeType;
  path: string;
}

const ContentCard = (props: ContentCardProps): JSX.Element => {
  const {
    childEntities,
    entityService,
    path,
    ignoreColumn,
    selectedValues,
    handleChange,
  } = props;

  const rows = useStoreState((state) => state.list.rows);

  const storeState = useStoreState(
    (state) => state,
    () => {
      return true;
    }
  );
  const columns = entityService.getCollectionColumns(storeState);
  const visibleColumns = Object.fromEntries(
    Object.entries(columns).filter(([key]) => key !== ignoreColumn)
  );

  return (
    <>
      {rows.map((row, key) => {
        return (
          <StyledContentCardBody
            key={`${key}-${row.id}`}
            childEntities={childEntities}
            entityService={entityService}
            ignoreColumn={ignoreColumn}
            selectedValues={selectedValues}
            handleChange={handleChange}
            path={path}
            visibleColumns={visibleColumns}
            row={row}
          />
        );
      })}
    </>
  );
};

export default ContentCard;
