import { CustomActionsType } from '@irontec/ivoz-ui/entities/EntityInterface';

import Provision from './ProvisionViewer';
import QrCode from './QrCodeViewer';
import SendEmail from './SendEmail';
import UpdateLicenses from './UpdateLicenses';

const customAction: CustomActionsType = {
  SendEmail: {
    action: SendEmail,
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
