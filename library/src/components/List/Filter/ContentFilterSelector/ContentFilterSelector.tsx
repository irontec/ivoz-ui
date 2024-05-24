import { Box, useMediaQuery, useTheme } from '@mui/material';
import { MouseEventHandler, useState } from 'react';
import { useStoreState } from 'store';
import {
  OutlinedButton,
  SolidButton,
} from '../../../../components/shared/Button/Button.styles';
import { NullablePropertyFkChoices } from '../../../../entities/DefaultEntityBehavior';
import { isPropertyScalar } from '../../../../services/api/ParsedApiSpecInterface';
import EntityService from '../../../../services/entity/EntityService';
import { DropdownChoices } from '../../../../services/form/Field/Dropdown';
import _ from '../../../../services/translations/translate';
import { CriteriaFilterValues } from '../ContentFilterDialog';
import { FilterCriteria } from '../FilterCriteria';
import { StyledContentFilterRow } from './ContentFilterRow.styles';

export interface ContentFilterRowProps {
  entityService: EntityService;
  fkChoices: { [fldName: string]: NullablePropertyFkChoices };
  commitCriteria: (data: CriteriaFilterValues) => void;
  path: string;
  className?: string;
  ignoreColumn: string | undefined;
  close: () => void;
}

export default function ContentFilterSelector(
  props: ContentFilterRowProps
): JSX.Element {
  const {
    entityService,
    commitCriteria,
    close,
    path,
    fkChoices,
    className,
    ignoreColumn,
  } = props;

  const queryStringCriteria = useStoreState(
    (state) => state.route.queryStringCriteria
  );

  const storeState = useStoreState(
    (state) => state,
    () => {
      return true;
    }
  );
  const columns = entityService.getCollectionParamList(storeState);
  const columnNames: Array<string> = Object.keys(columns).filter(
    (column) => column !== ignoreColumn
  );
  const filters: { [key: string]: Array<string> } = {};

  for (const idx in columnNames) {
    const propertyName: string = columnNames[idx];
    filters[propertyName] = entityService.getPropertyFilters(
      propertyName,
      path
    );
  }

  const [criteria, setCriteria] = useState<CriteriaFilterValues>(
    queryStringCriteria.length ? queryStringCriteria : []
  );

  const fieldNames: DropdownChoices = {};
  for (const fldName in filters) {
    fieldNames[fldName] = columns[fldName].label;
  }

  const firstFilter = Object.keys(filters)[0];
  const currentColumn = columns[firstFilter];
  const propertyFilters = filters[firstFilter] || [];

  let preferredFilter = currentColumn.preferredFilter || 'partial';

  if (!currentColumn.preferredFilter) {
    switch (true) {
      case isPropertyScalar(currentColumn) &&
        currentColumn.format === 'date-time':
        preferredFilter = 'exact';
        break;
    }
  }

  const defaultFilter = propertyFilters.includes(preferredFilter)
    ? preferredFilter
    : propertyFilters[0] || '';

  const setRow = (idx: number, name: string, type: string, value: string) => {
    const newCriteria = [...criteria];
    newCriteria[idx] = {
      name,
      type,
      value,
    };
    setCriteria(newCriteria);
  };

  const removeRow = (idx: number) => {
    const newCriteria = criteria.filter((val, index) => index !== idx);
    setCriteria(newCriteria);
  };

  const resetCriteria: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
    commitCriteria([]);
  };

  const mobile = useMediaQuery(useTheme().breakpoints.down('md'));

  return (
    <form className={className}>
      <Box className='filters'>
        <div>{_('Select Fields')}</div>
        {!mobile &&
          criteria.map((row, idx) => {
            return (
              <StyledContentFilterRow
                key={idx}
                idx={idx}
                filters={filters}
                row={row}
                columns={columns}
                fkChoices={fkChoices}
                fieldNames={fieldNames}
                isLast={false}
                setRow={setRow}
                removeRow={removeRow}
              />
            );
          })}
        <StyledContentFilterRow
          key={criteria.length}
          idx={criteria.length}
          filters={filters}
          row={{
            name: Object.keys(filters)[0],
            type: defaultFilter,
            value: '',
          }}
          columns={columns}
          fkChoices={fkChoices}
          fieldNames={fieldNames}
          isLast={true}
          setRow={setRow}
          removeRow={removeRow}
        />
      </Box>
      {mobile && (
        <Box>
          <FilterCriteria
            entityService={entityService}
            fkChoices={fkChoices}
            removeFilter={removeRow}
            path={path}
            criteriaOverride={criteria}
          />
        </Box>
      )}
      <Box className='actions'>
        <Box>
          <a href='#' onClick={resetCriteria} className='link'>
            {_('Clear all filters')}
          </a>
        </Box>
        <Box className='buttons'>
          <OutlinedButton variant='contained' onClick={close}>
            {_('Cancel')}
          </OutlinedButton>
          <SolidButton
            variant='contained'
            disabled={criteria.length < 1}
            onClick={() => {
              commitCriteria(criteria);
            }}
          >
            {_('Apply')}
          </SolidButton>
        </Box>
      </Box>
    </form>
  );
}
