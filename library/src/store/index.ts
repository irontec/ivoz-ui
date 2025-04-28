import {
  FilterActionTypes,
  StateMapper,
  createStore,
  createTypedHooks,
} from 'easy-peasy';
import StoreContainer from './StoreContainer';
import auth, { AuthStore } from './auth';
import spec, { SpecStore } from './apiSpec';
import api, { ApiStore } from './api';
import route, { RouteStore } from './route';
import routes, { RoutesStore } from './routes';
import list, { ListStore } from './list';
import flashMsg, { FlashMsgStore } from './flashMsg';
import form, { FormStore } from './form';
import menu, { MenuStore } from './menu';
import theme, { ThemeStore } from './theme';
import entities, { EntitiesStore } from './entities';
import i18n, { LanguagesStore } from './i18n';
import aboutInfo, { AboutInfoStore } from './aboutInfo';

export interface IvozStore {
  auth: AuthStore;
  spec: SpecStore;
  api: ApiStore;
  route: RouteStore;
  routes: RoutesStore;
  list: ListStore;
  flashMsg: FlashMsgStore;
  form: FormStore;
  menu: MenuStore;
  entities: EntitiesStore;
  i18n: LanguagesStore;
  theme: ThemeStore;
  aboutInfo: AboutInfoStore;
}

export type IvozStoreState = StateMapper<FilterActionTypes<IvozStore>>;

export const storeModel: IvozStore = {
  auth,
  spec,
  api,
  route,
  routes,
  list,
  flashMsg,
  form,
  menu,
  entities,
  i18n,
  theme,
  aboutInfo,
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
