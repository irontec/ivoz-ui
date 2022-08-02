import { createStore, createTypedHooks } from 'easy-peasy';
import StoreContainer from './StoreContainer';
import auth, { AuthStore } from './auth';
import spec, { SpecStore } from './apiSpec';
import api, { ApiStore } from './api';
import route, { RouteStore } from './route';
import list, { ListStore } from './list';
import entities, { EntitiesStore } from './entities';

export interface IvozStore {
  auth: AuthStore,
  spec: SpecStore,
  api: ApiStore,
  route: RouteStore,
  list: ListStore,
  entities: EntitiesStore,
}

export const storeModel: IvozStore = {
  auth,
  spec,
  api,
  route,
  list,
  entities,
}

StoreContainer.store = createStore<IvozStore>(storeModel);

const {
  useStoreActions,
  useStoreState,
  useStoreDispatch,
  useStore
} = createTypedHooks<IvozStore>();

export {
  StoreContainer,
  useStoreActions,
  useStoreState,
  useStoreDispatch,
  useStore
};