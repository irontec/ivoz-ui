import { useStoreState } from 'store';
import { RouteMapItem } from '../../../../router/routeMapParser';
import EntityService from '../../../../services/entity/EntityService';
import { handleMultiselectChangeType } from '../Table/hook/useMultiselectState';
import ContentCardBody from './ContentCardBody';

import './ContentCard.scoped.scss';

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

  const columns = entityService.getCollectionColumns();
  const visibleColumns = Object.fromEntries(
    Object.entries(columns).filter(([key]) => key !== ignoreColumn)
  );

  return (
    <>
      {rows.map((row, key) => {
        return (
          <ContentCardBody
            key={key}
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
