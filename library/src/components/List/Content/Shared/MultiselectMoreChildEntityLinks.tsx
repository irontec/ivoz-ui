import { MultiSelectFunctionComponent, RouteMapItem } from '../../../../router';
import EntityService, {
  EntityValues,
} from '../../../../services/entity/EntityService';
import DeleteRowsButton from '../CTA/DeleteRowsButton';
import { MoreChildEntityLinksWrapper } from './MoreChildEntityLinksWrapper';

interface MoreChildEntityLinksProps {
  childActions: Array<MultiSelectFunctionComponent>;
  rows: Array<EntityValues>;
  entityService: EntityService;
  deleteMapItem?: RouteMapItem | false;
  selectedValues: string[];
}

export const MultiselectMoreChildEntityLinks = (
  props: MoreChildEntityLinksProps
) => {
  const { childActions, rows, entityService, deleteMapItem, selectedValues } =
    props;
  const disabled = selectedValues.length === 0;
  return (
    <MoreChildEntityLinksWrapper disabled={disabled}>
      {childActions.map((Action, key: number) => {
        return (
          <Action
            //disabled={disabled}
            key={key}
            rows={rows}
            selectedValues={selectedValues}
            entityService={entityService}
            variant='text'
          />
        );
      })}
      {deleteMapItem && (
        <DeleteRowsButton
          selectedValues={selectedValues}
          entityService={entityService}
          variant='text'
        />
      )}
    </MoreChildEntityLinksWrapper>
  );
};
