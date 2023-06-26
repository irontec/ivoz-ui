import {
  ActionItem,
  GlobalFunctionComponent,
  MultiSelectFunctionComponent,
  RouteMapItem,
} from '../../../../router';
import EntityService, {
  EntityValues,
} from '../../../../services/entity/EntityService';
import DeleteRowsButton from '../CTA/DeleteRowsButton';
import { MoreChildEntityLinksWrapper } from './MoreChildEntityLinksWrapper';

interface MoreChildEntityLinksProps {
  childActions: ActionItem[];
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

  const hasGlobalActions = childActions.find((item) => item.global === true);
  const disabled = selectedValues.length === 0 && !hasGlobalActions;

  return (
    <MoreChildEntityLinksWrapper disabled={disabled}>
      {childActions
        .map(
          (item) =>
            item.action as
              | MultiSelectFunctionComponent
              | GlobalFunctionComponent
        )
        .map((Action, key: number) => {
          return (
            <Action
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
