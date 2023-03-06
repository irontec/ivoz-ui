import { createStore, createTypedHooks } from 'easy-peasy';
import {
  storeModel as ivozStoreModel,
  IvozStore,
  StoreContainer,
} from '@irontec/ivoz-ui/store';
import ApiClient from '@irontec/ivoz-ui/services/api/ApiClient';
import config from '../config';

ApiClient.API_URL = config.API_URL;

const storeModel: IvozStore = {
  ...ivozStoreModel,
};

const store = createStore<IvozStore>(storeModel);
StoreContainer.store = store;

export default store;

const { useStoreActions, useStoreState, useStoreDispatch, useStore } =
  createTypedHooks<IvozStore>();

export { useStoreActions, useStoreState, useStoreDispatch, useStore };
