import React from 'react';
import { Grid } from '@mui/material';
import { PropertySpec } from '../../services/api/ParsedApiSpecInterface';
import { ViewProps } from '../EntityInterface';
import ViewFieldValue from '../../services/form/Field/ViewFieldValue';
import {
  StyledGroupLegend,
  StyledGroupGrid,
} from '../DefaultEntityBehavior.styles';
import _ from '../../services/translations/translate';
import filterFieldsetGroups, { FieldsetGroups } from './FilterFieldsetGroups';

const View = (props: ViewProps): JSX.Element | null => {
  const { entityService, row } = props;

  const columns = entityService.getColumns();
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

  return (
    <React.Fragment>
      {groups.map((group, idx: number) => {
        const fields = group.fields as Array<string>;

        return (
          <div key={idx}>
            <StyledGroupLegend>{group.legend}</StyledGroupLegend>
            <StyledGroupGrid>
              {fields.map((columnName: string, idx: number) => {
                const properties = entityService.getProperties();
                const property = properties[columnName] as PropertySpec;
                return (
                  <Grid item xs={12} md={6} lg={4} key={idx}>
                    <ViewFieldValue
                      entityService={entityService}
                      property={property}
                      values={row}
                      columnName={columnName}
                    />
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
