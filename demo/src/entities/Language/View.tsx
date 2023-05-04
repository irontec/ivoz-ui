import {
  FieldsetGroups,
} from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import DefaultView from '@irontec/ivoz-ui/entities/DefaultEntityBehavior/View';
import { ViewProps } from '@irontec/ivoz-ui/entities/EntityInterface';

const View = (props: ViewProps): JSX.Element | null => {

  const groups: Array<FieldsetGroups> = [
    {
      legend: '',
      fields: [
        'id',
        'iden',
        'name',
      ],
    },
  ];

  return <DefaultView {...props} groups={groups} />;
};

export default View;
