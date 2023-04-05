import DefaultEntityBehavior from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import EntityInterface from '@irontec/ivoz-ui/entities/EntityInterface';

import Icon from './Icon';

const Blank: EntityInterface = {
  ...DefaultEntityBehavior,
  icon: Icon,
  iden: 'Blank',
  title: 'Blank',
  path: '/blank',
  properties: {},
  acl: {
    create: false,
    read: true,
    detail: false,
    update: false,
    delete: false,
  },
};

export default Blank;
