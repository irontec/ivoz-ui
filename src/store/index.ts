import { createStore, createTypedHooks } from 'easy-peasy';
import auth, { AuthStore } from './auth';
import spec, { SpecStore } from './apiSpec';
import api, { ApiStore } from './api';
import route, { RouteStore } from './route';

export interface IvozStore {
  auth: AuthStore,
  spec: SpecStore,
  api: ApiStore,
  route: RouteStore
}

export const storeModel: IvozStore = {
  auth,
  spec,
  api,
  route
}

const store = createStore<IvozStore>(storeModel);

export default store;

const {
  useStoreActions,
  useStoreState,
  useStoreDispatch,
  useStore
} = createTypedHooks<IvozStore>();

export {
  useStoreActions,
  useStoreState,
  useStoreDispatch,
  useStore
};