import useFkChoices from '@irontec/ivoz-ui/entities/data/useFkChoices';
import {
  EntityFormProps,
  FieldsetGroups,
  foreignKeyGetter,
} from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import { Form as DefaultEntityForm } from '@irontec/ivoz-ui/entities/DefaultEntityBehavior/Form';
import _ from '@irontec/ivoz-ui/services/translations/translate';

const Form = (props: EntityFormProps): JSX.Element => {
  const { entityService, row, match } = props;

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

  return <DefaultEntityForm {...props} fkChoices={fkChoices} groups={groups} />;
};

export default Form;
