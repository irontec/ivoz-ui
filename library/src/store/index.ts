import { createStore, createTypedHooks } from 'easy-peasy';
import StoreContainer from './StoreContainer';
import auth, { AuthStore } from './auth';
import spec, { SpecStore } from './apiSpec';
import api, { ApiStore } from './api';
import route, { RouteStore } from './route';
import routes, { RoutesStore } from './routes';
import list, { ListStore } from './list';
import menu, { MenuStore } from './menu';
import entities, { EntitiesStore } from './entities';
import i18n, { LanguagesStore } from './i18n';

export interface IvozStore {
  auth: AuthStore;
  spec: SpecStore;
  api: ApiStore;
  route: RouteStore;
  routes: RoutesStore;
  list: ListStore;
  menu: MenuStore;
  entities: EntitiesStore;
  i18n: LanguagesStore;
}

export const storeModel: IvozStore = {
  auth,
  spec,
  api,
  route,
  routes,
  list,
  menu,
  entities,
  i18n,
};

StoreContainer.store = createStore<IvozStore>(storeModel);

const { useStoreActions, useStoreState, useStoreDispatch, useStore } =
  createTypedHooks<IvozStore>();

export {
  StoreContainer,
  useStoreActions,
  useStoreState,
  useStoreDispatch,
  useStore,
};
