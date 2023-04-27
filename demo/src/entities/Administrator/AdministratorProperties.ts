import { PropertySpec } from '@irontec/ivoz-ui/services/api/ParsedApiSpecInterface';
import {
  EntityValue,
  EntityValues,
} from '@irontec/ivoz-ui/services/entity/EntityService';

export type AdministratorPropertyList<T> = {
  id?: T;
  username?: T;
  active?: T;
  pass?: T;
  email?: T;
  name?: T;
  lastname?: T;
  avatar?: T;
  greeting?: T;
};

export type AdministratorProperties = AdministratorPropertyList<
  Partial<PropertySpec>
>;
export type AdministratorPropertiesList = Array<
  AdministratorPropertyList<EntityValue | EntityValues>
>;
