import { useState } from 'react';
import { Grid, Button } from '@mui/material';
import {
  FkProperty,
  isPropertyFk,
  PropertySpec,
  ScalarProperty,
  isPropertyScalar,
} from '../../../services/api/ParsedApiSpecInterface';
import FormFieldFactory from '../../../services/form/FormFieldFactory';
import {
  FormOnChangeEvent,
  NullablePropertyFkChoices,
} from '../../../entities/DefaultEntityBehavior';
import _ from '../../../services/translations/translate';
import { FormikHelpers, useFormik } from 'formik';
import { useFormikType } from '../../../services/form/types';
import EntityService from '../../../services/entity/EntityService';
import FilterIconFactory, { SearchFilterType } from './icons/FilterIconFactory';
import { CriteriaFilterValue } from './ContentFilter';
import { DropdownObjectChoices } from 'services/form/Field/Dropdown';

export interface ContentFilterRowProps {
  entityService: EntityService;
  fkChoices: { [fldName: string]: NullablePropertyFkChoices };
  addCriteria: (data: CriteriaFilterValue) => void;
  apply: (waitForStateUpdate: boolean) => void;
  path: string;
  className?: string;
  ignoreColumn: string | undefined;
}

export default function ContentFilterSelector(
  props: ContentFilterRowProps
): JSX.Element {
  const {
    entityService,
    addCriteria,
    apply,
    path,
    fkChoices,
    className,
    ignoreColumn,
  } = props;

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

  const fieldNames: DropdownObjectChoices = {};
  for (const fldName in filters) {
    fieldNames[fldName] = columns[fldName].label;
  }

  const [name, setName] = useState<string>(Object.keys(filters)[0]);

  const currentColumn = columns[name];
  const propertyFilters = filters[name] || [];

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
  const [type, setType] = useState<SearchFilterType>(defaultFilter);

  const filterLabels: DropdownObjectChoices = {};
  for (const filter of filters[name] || {}) {
    filterLabels[filter] = FilterIconFactory({
      name: filter,
      includeLabel: true,
    });
  }

  const nameSelectBoxSpec: PropertySpec = {
    type: 'string',
    enum: fieldNames,
    default: name,
    label: _('Field'),
    required: true,
  };

  const typeSelectBoxSpec: PropertySpec = {
    type: 'string',
    enum: filterLabels,
    default: type,
    label: _('Filter'),
    required: true,
  };

  const valueBoxSpec: PropertySpec = {
    type: 'string',
    default: '',
    label: _('Value'),
    required: true,
  };

  const column = columns[name];
  if (isPropertyFk(column)) {
    (valueBoxSpec as FkProperty).$ref = column.$ref;
  } else if (column.enum) {
    (valueBoxSpec as ScalarProperty).enum = column.enum;
  } else if (column.type === 'boolean') {
    (valueBoxSpec as ScalarProperty).enum = {
      true: _('True'),
      false: _('False'),
    };
  }

  const initialValues: CriteriaFilterValue = {
    name: nameSelectBoxSpec.default,
    type: typeSelectBoxSpec.default,
    value: '',
  };

  const searchFormik: useFormikType = useFormik({
    initialValues,
    validate: (values: CriteriaFilterValue) => {
      const response: any = {};
      const emptyValue = values.value === '' || values.value === undefined;
      if (emptyValue && values.type !== 'exact' && values.type !== 'exists') {
        response.value = _('required value');
      }

      return response;
    },
    onSubmit: async (
      values: CriteriaFilterValue,
      actions: FormikHelpers<CriteriaFilterValue>
    ) => {
      actions.setTouched({}, false);
      const dataFixes: Partial<CriteriaFilterValue> = {};

      addCriteria({
        ...values,
        ...dataFixes,
      });

      actions.setValues({
        ...values,
        value: '',
      });
    },
  });

  if (!filters[name].includes(searchFormik.values.type)) {
    searchFormik.setValues({
      ...searchFormik.values,
      type: defaultFilter,
    });
  }

  const formFieldFactory = new FormFieldFactory(
    entityService,
    searchFormik,
    (e: FormOnChangeEvent): void => {
      switch (e.target.name) {
        case 'name':
          setName(e.target.value);
          searchFormik.handleChange({
            target: {
              name: 'value',
              value: '',
            },
          });
          searchFormik.setTouched({}, false);
          break;
        case 'type':
          setType(e.target.value);
          break;
      }
      searchFormik.handleChange(e);
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {}
  );

  const addAndApplyCallback = async () => {
    await searchFormik.submitForm();
    apply(true);
  };

  return (
    <form onSubmit={searchFormik.handleSubmit}>
      <Grid
        container={true}
        spacing={3}
        alignItems='flex-end'
        className={className}
      >
        <Grid item xs={12}>
          {formFieldFactory.createByPropertySpec(
            'name',
            nameSelectBoxSpec,
            {},
            false
          )}
        </Grid>
        <Grid item xs={12}>
          {formFieldFactory.createByPropertySpec(
            'type',
            typeSelectBoxSpec,
            {},
            false
          )}
        </Grid>
        <Grid item xs={12}>
          {type !== 'exists' &&
            formFieldFactory.createByPropertySpec(
              'value',
              valueBoxSpec,
              fkChoices[name] || {},
              false
            )}
        </Grid>
        <Grid item xs={12}>
          <Button variant='contained' type='submit'>
            {_('Add')}
          </Button>
          &nbsp;
          <Button variant='contained' onClick={addAndApplyCallback}>
            {_('Add and apply')}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
