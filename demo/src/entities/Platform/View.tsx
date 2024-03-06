import { ViewType } from '@irontec/ivoz-ui/entities';
import { FieldsetGroups } from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import DefaultView from '@irontec/ivoz-ui/entities/DefaultEntityBehavior/View';
import _ from '@irontec/ivoz-ui/services/translations/translate';

const View: ViewType = (props): JSX.Element => {
  const groups: Array<FieldsetGroups | false> = [
    {
      legend: _('Basic info'),
      fields: ['name', 'type', 'features', 'apiUrl', 'refreshToken'],
    },
    {
      legend: _('Default SIP ports'),
      fields: ['udpPort', 'tcpPort', 'tlsPort'],
    },
  ];

  return <DefaultView {...props} groups={groups} />;
};

export default View;
