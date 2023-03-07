import { PropertySpec } from '@irontec/ivoz-ui/services/api/ParsedApiSpecInterface';
import {
  EntityValue,
  EntityValues,
} from '@irontec/ivoz-ui/services/entity/EntityService';

export type ClientPropertyList<T> = {
  id?: T;
  iden?: T;
  domain?: T;
  language?: T;
  desktopLicences?: T;
  mobileLicences?: T;
  authType?: T;
  ldapServer?: T;
  ldapQuery?: T;
  remoteId?: T;
  platform?: T;
  provisioningTemplate?: T;
  emailNotificationTemplate?: T;
  description?: T;
  transport?: T;
  proxyHost?: T;
  proxyPort?: T;
  sdes?: T;
  cardDav?: T;
  cardDavPass?: T;
};

export type ClientProperties = ClientPropertyList<Partial<PropertySpec>>;
export type ClientPropertiesList = Array<
  ClientPropertyList<EntityValue | EntityValues>
>;
