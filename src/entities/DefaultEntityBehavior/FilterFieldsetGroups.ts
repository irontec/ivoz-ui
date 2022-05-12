import * as React from 'react';
import _ from '../../services/translations/translate';

export type FieldsetGroups = {
    legend: string | React.ReactElement,
    fields: Array<string | false | undefined>
}

const filterFieldsetGroups = (groups: Array<FieldsetGroups | false>): Array<FieldsetGroups> => {

    const resp: Array<FieldsetGroups> = [];
    for (const idx in groups) {
        const group = groups[idx];

        if (!group) {
            continue;
        }

        const fields = group.fields.filter(
            (item) => typeof item === 'string'
        ) as Array<string>;

        if (!fields.length) {
            continue;
        }

        resp.push({
            legend: group.legend,
            fields
        });
    }

    return resp;
}

export default filterFieldsetGroups;