import useFkChoices from '@irontec/ivoz-ui/entities/data/useFkChoices';
import {
  EntityFormProps,
  FieldsetGroups,
} from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import { Form as DefaultEntityForm } from '@irontec/ivoz-ui/entities/DefaultEntityBehavior/Form';
import { useFormHandler } from '@irontec/ivoz-ui/entities/DefaultEntityBehavior/Form/useFormHandler';
import _ from '@irontec/ivoz-ui/services/translations/translate';

import { foreignKeyGetter } from './ForeignKeyGetter';
import useShowRemoteId from './hooks/useShowRemoteId';

const Form = (props: EntityFormProps): JSX.Element => {
  const { entityService, row, match, create, filterBy } = props;

  const formik = useFormHandler(props);
  const fkChoices = useFkChoices({
    foreignKeyGetter,
    entityService,
    row,
    match,
  });

  const showRemoteId = useShowRemoteId({
    create,
    filterBy,
    formik,
    match,
  });

  const groups: Array<FieldsetGroups | false> = [
    {
      legend: _('Basic settings'),
      fields: [
        create && 'platform',
        showRemoteId && 'remoteId',
        'iden',
        {
          name: 'description',
          size: {
            md: 12,
            lg: 6,
            xl: 4,
          },
        },
        'desktopLicences',
        'mobileLicences',
        'language',
        'cardDav',
      ],
    },
    {
      legend: _('SIP settings'),
      fields: ['domain', 'transport', 'proxyHost', 'proxyPort'],
    },
    {
      legend: _('Advanced settings'),
      fields: ['sdes', 'authType', 'ldapServer', 'ldapQuery'],
    },
  ];

  return (
    <DefaultEntityForm
      {...props}
      formik={formik}
      fkChoices={fkChoices}
      groups={groups}
    />
  );
};

export default Form;
