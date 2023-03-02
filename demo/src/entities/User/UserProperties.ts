import { PropertySpec } from '@irontec/ivoz-ui/services/api/ParsedApiSpecInterface';
import {
  EntityValue,
  EntityValues,
} from '@irontec/ivoz-ui/services/entity/EntityService';

export type UserPropertyList<T> = {
  id?: T;
  iden?: T;
  title?: T;
  terminal?: T;
  enabled?: T;
  client?: T;
  email?: T;
  sipPassword?: T;
  acrobitsPassword?: T;
  remoteId?: T;
  lastProvisionDate?: T;
};

export type UserProperties = UserPropertyList<Partial<PropertySpec>>;
export type UserPropertiesList = Array<
  UserPropertyList<EntityValue | EntityValues>
>;
