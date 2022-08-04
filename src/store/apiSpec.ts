import { Action, action, Thunk, thunk } from 'easy-peasy';
import ApiClient from '../services/api/ApiClient';
import ApiSpecParser from '../services/api/ApiSpecParser';

interface SpecState {
  sessionStoragePrefix: string;
  spec: any;
  loading: boolean;
  appVersion: string;
}

interface SpecActions {
  setSessionStoragePrefix: Action<SpecState, string>;
  setSpec: Action<SpecState, null>;
  setLoading: Action<SpecState>;
  unsetLoading: Action<SpecState>;
  setAppVersion: Action<SpecState, string>;
  init: Thunk<() => Promise<void>>;
}

export type SpecStore = SpecState & SpecActions;

const specStore = {
  sessionStoragePrefix: 'app-',
  spec: {},
  loading: false,
  appVersion: '',

  // Actions
  setSessionStoragePrefix: action<SpecState, string>((state, prefix) => {
    state.sessionStoragePrefix = prefix;
  }),

  setSpec: action<SpecState, any>((state: any, spec: any) => {
    localStorage.setItem(
      `${state.sessionStoragePrefix}apiSpec`,
      JSON.stringify(spec)
    );
    state.spec = new ApiSpecParser().parse(spec);
  }),

  setLoading: action<SpecState>((state: any) => {
    state.loading = true;
  }),

  unsetLoading: action<SpecState>((state: any) => {
    state.loading = false;
  }),

  setAppVersion: action<SpecState, string>((state: any, appVersion) => {
    localStorage.setItem(`${state.sessionStoragePrefix}appVersion`, appVersion);
    state.appVersion = appVersion;
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
        const appVersion = document
          ?.querySelector('meta[name="version-info"]')
          ?.getAttribute('content');

        const storedAppVersion = localStorage.getItem(
          `${state.sessionStoragePrefix}appVersion`
        );

        const storedSpec = localStorage.getItem(
          `${state.sessionStoragePrefix}apiSpec`
        );
        if (storedSpec && appVersion === storedAppVersion) {
          actions.setSpec(JSON.parse(storedSpec));
          actions.setAppVersion(appVersion);
          resolve(true);
          return;
        }

        ApiClient.get('/docs.json', {}, async (data: any) => {
          actions.setSpec(data);
          actions.setAppVersion(appVersion);
          actions.unsetLoading();
          resolve(true);
        }).catch((error: any) => {
          console.log('error', error);
          actions.unsetLoading();
          reject(error);
        });
      });
    }
  ),
};

export default specStore;
