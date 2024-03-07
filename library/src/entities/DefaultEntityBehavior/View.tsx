import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useStoreState } from 'store';
import FormFieldFactory from '../../services/form/FormFieldFactory';
import {
  StyledGroupGrid,
  StyledGroupLegend,
} from '../DefaultEntityBehavior.styles';
import { ForeignKeyGetterType, ViewProps } from '../EntityInterface';
import useFkChoices from '../data/useFkChoices';
import filterFieldsetGroups, {
  FieldsetGroups,
  FieldsetGroupsField,
} from './FilterFieldsetGroups';
import { NullablePropertyFkChoices } from './Form';
import { useFormHandler } from './Form/useFormHandler';

const View = (props: ViewProps): JSX.Element | null => {
  const {
    entityService,
    row,
    unmarshaller,
    properties,
    fkChoices,
    match,
    foreignKeyGetter: foreignKeyGetterLoader,
  } = props;

  const [foreignKeyGetter, setForeignKeyGetter] = useState<
    ForeignKeyGetterType | undefined
  >();

  const storeState = useStoreState(
    (state) => state,
    () => {
      return true;
    }
  );
  const columns = entityService.getColumns(storeState);
  const columnNames = Object.keys(columns);

  let groups: Array<FieldsetGroups> = [];
  if (props.groups) {
    groups = filterFieldsetGroups(props.groups);
  } else {
    groups.push({
      legend: '',
      fields: columnNames,
    });
  }

  const formik = useFormHandler({
    ...props,
    initialValues: unmarshaller(row, properties),
    validator: () => {
      return {};
    },
    onSubmit: async () => {
      /* noop */
    },
  });
  const formFieldFactory = new FormFieldFactory(
    entityService,
    formik,
    formik.handleChange,
    formik.handleBlur
  );

  useEffect(() => {
    if (fkChoices) {
      return;
    }

    if (foreignKeyGetter) {
      return;
    }

    foreignKeyGetterLoader().then((fkGetter) => {
      setForeignKeyGetter(() => fkGetter);
    });
  }, [fkChoices, foreignKeyGetter]);

  const autoloadedFkChoices = useFkChoices({
    disabled: fkChoices !== undefined || foreignKeyGetter === undefined,
    foreignKeyGetter: foreignKeyGetter as ForeignKeyGetterType,
    entityService,
    row,
    match,
  });

  const fks = fkChoices || autoloadedFkChoices;

  return (
    <React.Fragment>
      {groups.map((group, idx: number) => {
        const fields = group.fields as Array<FieldsetGroupsField>;

        return (
          <div key={idx}>
            <StyledGroupLegend>{group.legend}</StyledGroupLegend>
            <StyledGroupGrid>
              {fields.map((column, idx: number) => {
                const fldName =
                  typeof column === 'string' ? column : column.name;
                const choices: NullablePropertyFkChoices = fks[fldName] ?? null;

                return (
                  <Grid item xs={12} md={6} lg={4} key={idx}>
                    {formFieldFactory.getFormField(fldName, choices, true)}
                  </Grid>
                );
              })}
            </StyledGroupGrid>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default View;
