import { Button } from '@mui/material';
import { MouseEventHandler, useState } from 'react';
import { useStoreState } from 'store';
import { NullablePropertyFkChoices } from '../../../../entities/DefaultEntityBehavior';
import { isPropertyScalar } from '../../../../services/api/ParsedApiSpecInterface';
import EntityService from '../../../../services/entity/EntityService';
import { DropdownChoices } from '../../../../services/form/Field/Dropdown';
import _ from '../../../../services/translations/translate';
import { CriteriaFilterValues } from '../ContentFilterDialog';
import ContentFilterRow from './ContentFilterRow';
import {
  StyledContainer,
  StyledLastRowContainer,
  StyledRowContainer,
  StyledRowItem,
} from './ContentFilterSelector.styles';

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

  const columns = entityService.getCollectionParamList();
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
        preferredFilter = 'start';
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
    setCriteria([]);
  };

  return (
    <form className={className}>
      <StyledContainer>
        {criteria.map((row, idx) => {
          return (
            <ContentFilterRow
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
        <ContentFilterRow
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
        <StyledLastRowContainer>
          <StyledRowItem>
            <a href="#" onClick={resetCriteria}>
              {_('Clear all filters')}
            </a>
          </StyledRowItem>
          <StyledRowItem>
            <Button variant='contained' onClick={close}>
              {_('Cancel')}
            </Button>
            <Button
              variant='contained'
              onClick={() => {
                commitCriteria(criteria);
              }}
            >
              {_('Apply')}
            </Button>
          </StyledRowItem>
        </StyledLastRowContainer>
      </StyledContainer>
    </form>
  );
}
