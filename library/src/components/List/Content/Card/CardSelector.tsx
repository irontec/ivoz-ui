import { handleMultiselectChangeType } from '../Table/hook/useMultiselectState';

interface CardSelectorProps {
  row: Record<string, any>;
  selectable: boolean;
  selectedValues: string[];
  handleChange: handleMultiselectChangeType;
}

export const CardSelector = (props: CardSelectorProps) => {
  const { row, selectable } = props;
  const { selectedValues, handleChange } = props;

  const checked = selectedValues.indexOf(row.id.toString()) > -1;

  if (!selectable) {
    return null;
  }

  return (
    <input
      type='checkbox'
      style={{ verticalAlign: 'bottom', marginRight: '10px' }}
      name={row.id}
      checked={checked}
      onChange={handleChange}
    />
  );
};
