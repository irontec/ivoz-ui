import { Tooltip } from '@mui/material';
import { useStoreState } from 'store';
import { NullablePropertyFkChoices } from '../../../entities/DefaultEntityBehavior';
import { isPropertyFk } from '../../../services/api/ParsedApiSpecInterface';
import EntityService from '../../../services/entity/EntityService';
import { DropdownObjectChoices } from '../../../services/form/Field/Dropdown/Dropdown';
import {
  CriteriaFilterValue,
  CriteriaFilterValues
} from './ContentFilterDialog';
import { StyledChip } from './FilterCriteria.styles';
import { getFilterLabel } from './icons/FilterIconFactory';

interface FilterCriteriaProps {
  entityService: EntityService;
  fkChoices: { [fldName: string]: NullablePropertyFkChoices };
  path: string;
  removeFilter: (index: number) => void;
}

export function FilterCriteria(props: FilterCriteriaProps): JSX.Element | null {
  const { entityService, fkChoices, removeFilter } = props;
  const columns = entityService.getCollectionParamList();

  const criteria: CriteriaFilterValues = useStoreState(
    (state) => state.route.queryStringCriteria
  );

  return (
    <>
      {criteria.map((criteriaValue: CriteriaFilterValue, idx: number) => {
        const { name, type, value } = criteriaValue;
        const column = columns[name];
        if (!column) {
          return null;
        }
        const fieldStr = column.label;

        let valueStr: string | JSX.Element = value as string;
        if (isPropertyFk(column)) {
          const choice = fkChoices[name];
          if (Array.isArray(choice)) {
            const arrayChoice = choice.find((row) => `${row.id}` === value);
            valueStr = arrayChoice?.label || '';
          } else {
            valueStr = (fkChoices[name] as DropdownObjectChoices | null)?.[
              value as string
            ] as string;
          }
        } else if (column.enum) {
          valueStr = column.enum[value as string] as string | JSX.Element;
        }

        const tooltipTitle = (
          <span>
            {fieldStr} &nbsp;
            {getFilterLabel(type)} &nbsp;
            {valueStr}
          </span>
        );

        return (
          <Tooltip key={idx} title={tooltipTitle}>
            <span>
              <StyledChip
                label={fieldStr}
                onDelete={() => {
                  removeFilter(idx);
                }}
              />
            </span>
          </Tooltip>
        );
      })}
    </>
  );
}
