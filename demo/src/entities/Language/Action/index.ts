import { CustomActionsType } from '@irontec/ivoz-ui/entities/EntityInterface';

import DoSomething from './DoSomething';

const customAction: CustomActionsType = {
  DoSomething: {
    action: DoSomething,
    multiselect: true,
  },
};

export default customAction;
