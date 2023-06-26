import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Chip, Tooltip } from '@mui/material';
import { useStoreState } from 'store';
import { NullablePropertyFkChoices } from '../../../entities/DefaultEntityBehavior';
import { isPropertyFk } from '../../../services/api/ParsedApiSpecInterface';
import EntityService from '../../../services/entity/EntityService';
import { DropdownObjectChoices } from '../../../services/form/Field/Dropdown/Dropdown';
import {
  CriteriaFilterValue,
  CriteriaFilterValues,
} from './ContentFilterDialog';
import { getFilterLabel } from './icons/FilterIconFactory';

interface FilterCriteriaProps {
  entityService: EntityService;
  fkChoices: { [fldName: string]: NullablePropertyFkChoices };
  path: string;
  removeFilter: (index: number) => void;
  criteriaOverride?: CriteriaFilterValues;
}

export function FilterCriteria(props: FilterCriteriaProps): JSX.Element | null {
  const { entityService, fkChoices, removeFilter, criteriaOverride } = props;

  const storeState = useStoreState(
    (state) => state,
    () => {
      return true;
    }
  );
  const columns = entityService.getCollectionParamList(storeState);

  const criteria: CriteriaFilterValues =
    criteriaOverride ||
    useStoreState((state) => state.route.queryStringCriteria);

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
            <Chip
              label={fieldStr}
              onDelete={() => {
                removeFilter(idx);
              }}
              deleteIcon={<CloseRoundedIcon />}
            />
          </Tooltip>
        );
      })}
    </>
  );
}
