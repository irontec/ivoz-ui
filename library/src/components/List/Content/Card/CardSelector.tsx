import { Checkbox } from '@mui/material';
import { handleMultiselectChangeType } from '../Table/hook/useMultiselectState';
import EntityService from 'services/entity/EntityService';

interface CardSelectorProps {
  row: Record<string, any>;
  selectable: boolean;
  selectedValues: string[];
  handleChange: handleMultiselectChangeType;
  entityService: EntityService;
}

export const CardSelector = (props: CardSelectorProps) => {
  const { row, selectable, entityService } = props;
  const { selectedValues, handleChange } = props;
  const entity = entityService.getEntity();

  const checked = selectedValues.indexOf(row.id.toString()) > -1;

  if (!selectable) {
    return null;
  }

  return (
    <Checkbox
      name={`${row.id}`}
      checked={checked}
      onChange={handleChange}
      disabled={entity.deleteDoubleCheck}
    />
  );
};
