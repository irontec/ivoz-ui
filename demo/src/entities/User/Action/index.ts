import { CustomActionsType } from '@irontec/ivoz-ui/entities/EntityInterface';
import SendEmail from './SendEmail';
import Provision from './ProvisionViewer';
import UpdateLicenses from './UpdateLicenses';
import QrCode from './QrCodeViewer';

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
