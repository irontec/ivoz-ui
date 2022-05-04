import { Action, action, Thunk, thunk } from 'easy-peasy';
import ApiClient from '../services/api/ApiClient';
import ApiSpecParser from '../services/api/ApiSpecParser';

interface SpecState {
  sessionStoragePrefix: string,
  spec: any,
  loading: boolean,
}

interface SpecActions {
  setSessionStoragePrefix: Action<SpecState, string>,
  setSpec: Action<SpecState, null>,
  setLoading: Action<SpecState>,
  unsetLoading: Action<SpecState>,
  init: Thunk<() => Promise<void>>
}

export type SpecStore = SpecState & SpecActions;

const specStore = {
  sessionStoragePrefix: 'app-',
  spec: {},
  loading: false,

  // Actions
  setSessionStoragePrefix: action<SpecState, string>((state, prefix) => {
    state.sessionStoragePrefix = prefix;
  }),

  setSpec: action<SpecState, any>((state: any, spec: any) => {
    sessionStorage.setItem(`${state.sessionStoragePrefix}apiSpec`, JSON.stringify(spec));
    state.spec = new ApiSpecParser().parse(spec);
  }),

  setLoading: action<SpecState>((state: any) => {
    state.loading = true;
  }),

  unsetLoading: action<SpecState>((state: any) => {
    state.loading = false;
  }),

  init: thunk(
    // callback thunk
    (actions: any, payload, helpers) => {

      const state: any = helpers.getState();
      if (state.loading) {
        return;
      }

      actions.setLoading();

      return new Promise((resolve, reject) => {

        const storedSpec = sessionStorage.getItem(`${state.sessionStoragePrefix}apiSpec`);
        if (storedSpec) {
          actions.setSpec(
            JSON.parse(storedSpec)
          );
          resolve(true);
          return;
        }

        ApiClient.get(
          '/docs.json',
          {},
          async (data: any/*, headers: any*/) => {
            actions.setSpec(data);
            actions.unsetLoading();
            resolve(true);
          }
        ).catch((error: any) => {
          console.log('error', error);
          actions.unsetLoading();
          reject(error)
        });
      });
    },
  )
};

export default specStore;
