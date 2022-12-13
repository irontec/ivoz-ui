import { GridSize } from '@mui/material';
import * as React from 'react';

type DetailedFormFieldSpec = {
  name: string;
  size: {
    md?: boolean | GridSize;
    lg?: boolean | GridSize;
    xl?: boolean | GridSize;
  };
};

export const isDetailedFormFieldSpec = (
  property: FieldsetGroupsField
): property is DetailedFormFieldSpec => {
  return typeof property !== 'string';
};

export type FieldsetGroupsField = string | DetailedFormFieldSpec;

export type FieldsetGroups = {
  legend: string | React.ReactElement;
  fields: Array<FieldsetGroupsField | false | undefined>;
};

const filterFieldsetGroups = (
  groups: Array<FieldsetGroups | false>
): Array<FieldsetGroups> => {
  const resp: Array<FieldsetGroups> = [];
  for (const idx in groups) {
    const group = groups[idx];

    if (!group) {
      continue;
    }

    const fields = group.fields.filter((item) =>
      ['string', 'object'].includes(typeof item)
    ) as Array<string>;

    if (!fields.length) {
      continue;
    }

    resp.push({
      legend: group.legend,
      fields,
    });
  }

  return resp;
};

export default filterFieldsetGroups;
