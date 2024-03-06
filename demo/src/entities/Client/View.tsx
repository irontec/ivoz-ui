import { ViewProps } from '@irontec/ivoz-ui/entities';
import { FieldsetGroups } from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import DefaultView from '@irontec/ivoz-ui/entities/DefaultEntityBehavior/View';
import _ from '@irontec/ivoz-ui/services/translations/translate';

const View = (props: ViewProps): JSX.Element => {
  const groups: Array<FieldsetGroups | false> = [
    {
      legend: _('Basic settings'),
      fields: [
        'iden',
        'color',
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

  return <DefaultView {...props} groups={groups} />;
};

export default View;
