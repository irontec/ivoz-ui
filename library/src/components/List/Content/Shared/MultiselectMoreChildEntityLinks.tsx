import MenuItem from '@mui/material/MenuItem';
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

  return (
    <MoreChildEntityLinksWrapper>
      {childActions.map((Action, key: number) => {
        return (
          <MenuItem key={key} disabled={selectedValues.length === 0}>
            <Action
              rows={rows}
              selectedValues={selectedValues}
              entityService={entityService}
              variant='text'
            />
          </MenuItem>
        );
      })}
      {deleteMapItem && (
        <MenuItem disabled={selectedValues.length === 0}>
          <DeleteRowsButton
            selectedValues={selectedValues}
            entityService={entityService}
            variant='text'
          />
        </MenuItem>
      )}
    </MoreChildEntityLinksWrapper>
  );
};
