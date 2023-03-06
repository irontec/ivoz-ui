import { PropertySpec } from '@irontec/ivoz-ui/services/api/ParsedApiSpecInterface';
import {
  EntityValue,
  EntityValues,
} from '@irontec/ivoz-ui/services/entity/EntityService';

export type PlatformPropertyList<T> = {
  id?: T;
  name?: T;
  type?: T;
  apiUrl?: T;
  tlsPort?: T;
  tcpPort?: T;
  udpPort?: T;
  refreshToken?: T;
};

export type PlatformProperties = PlatformPropertyList<Partial<PropertySpec>>;
export type PlatformPropertiesList = Array<
  PlatformPropertyList<EntityValue | EntityValues>
>;
