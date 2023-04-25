import { CustomActionsType } from '@irontec/ivoz-ui/entities/EntityInterface';

import Provision from './ProvisionViewer';
import QrCode from './QrCodeViewer';
import SendEmail from './SendEmail';
import SendEmailError from './SendEmailError';
import UpdateLicenses from './UpdateLicenses';

const customAction: CustomActionsType = {
  SendEmail: {
    action: SendEmail,
    multiselect: true,
  },
  SendEmailError: {
    action: SendEmailError,
    multiselect: true,
  },
  Provision: {
    action: Provision,
    multiselect: false,
  },
  UpdateLicenses: {
    action: UpdateLicenses,
    multiselect: true,
  },
  QrCode: {
    action: QrCode,
    multiselect: false,
  },
};

export default customAction;
