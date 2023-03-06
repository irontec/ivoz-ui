import { CustomActionsType } from '@irontec/ivoz-ui/entities/EntityInterface';
import SendEmail from './SendEmail';
import Sync from './Sync';

const customAction: CustomActionsType = {
  SendEmail: {
    action: SendEmail,
  },
  Sync: {
    action: Sync,
  },
};

export default customAction;
