import { ViewType } from '@irontec/ivoz-ui/entities';
import useFkChoices from '@irontec/ivoz-ui/entities/data/useFkChoices';
import {
  FieldsetGroups,
  foreignKeyGetter,
} from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import DefaultView from '@irontec/ivoz-ui/entities/DefaultEntityBehavior/View';
import useCurrentPathMatch from '@irontec/ivoz-ui/hooks/useCurrentPathMatch';
import _ from '@irontec/ivoz-ui/services/translations/translate';

const View: ViewType = (props): JSX.Element => {
  const { entityService, row } = props;

  const match = useCurrentPathMatch();
  const fkChoices = useFkChoices({
    foreignKeyGetter,
    entityService,
    row,
    match,
  });

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

  return <DefaultView {...props} fkChoices={fkChoices} groups={groups} />;
};

export default View;
