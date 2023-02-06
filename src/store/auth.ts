import { action, Action, Computed, computed, Thunk, thunk } from 'easy-peasy';
import ApiClient from '../services/api/ApiClient';
import { IvozStore } from '../index';

interface LoginProps {
  path: string;
  refreshPath: string;
  exchangePath: string,
  contentType: string;
}

interface AuthState {
  sessionStoragePrefix: string;
  loggedIn: Computed<AuthState, boolean>;
  login: LoginProps;
  token: string | null;
  refreshToken: string | null;
}

interface AuthActions {
  setSessionStoragePrefix: Action<AuthState, string>;
  setLoginProps: Action<AuthState, LoginProps>;
  setToken: Action<AuthState, string | null>;
  setRefreshToken: Action<AuthState, string | null>;
  init: Thunk<AuthState>;
  submit: Thunk<AuthState, Record<string, string>>;
  useRefreshToken: Thunk<AuthState>;
  resetAll: Thunk<AuthState>;
  resetToken: Thunk<AuthState>;
  resetRefreshToken: Thunk<AuthState>;
  exchangeToken: Thunk<AuthState, Record<string, string>>;
}

export type AuthStore = AuthActions & AuthState;

const auth: AuthStore = {
  sessionStoragePrefix: 'app-',
  loggedIn: computed<AuthState, boolean>((state) => {
    return state.token !== null || state.refreshToken !== null;
  }),
  login: {
    path: '/admin_login',
    refreshPath: '/token/refresh',
    exchangePath: '/token/exchange',
    contentType: 'application/x-www-form-urlencoded',
  },

  token: null,
  refreshToken: null,

  // actions
  setSessionStoragePrefix: action<AuthState, string>((state, prefix) => {
    state.sessionStoragePrefix = prefix;
  }),

  setLoginProps: action<AuthState, LoginProps>((state, loginProps) => {
    state.login = {
      ...state.login,
      ...loginProps,
    };
  }),

  setToken: action<AuthState, string | null>((state, token) => {
    if (token) {
      localStorage.setItem(`${state.sessionStoragePrefix}token`, token);
      ApiClient.setToken(token);
    } else {
      localStorage.removeItem(`${state.sessionStoragePrefix}token`);
    }

    state.token = token;
  }),

  setRefreshToken: action<AuthState, string | null>((state, refreshToken) => {
    if (refreshToken) {
      localStorage.setItem(
        `${state.sessionStoragePrefix}refreshToken`,
        refreshToken
      );
    } else {
      localStorage.removeItem(`${state.sessionStoragePrefix}refreshToken`);
    }

    state.refreshToken = refreshToken;
  }),

  // thunks
  init: thunk<AuthStore>(async (actions, undefinned, { getState }) => {
    const sessionStoragePrefix = getState().sessionStoragePrefix;
    actions.setToken(
      localStorage.getItem(`${sessionStoragePrefix}token`) as string
    );
    actions.setRefreshToken(
      localStorage.getItem(`${sessionStoragePrefix}refreshToken`) as string
    );
  }),

  submit: thunk<AuthStore, Record<string, string>, any, IvozStore>(
    async (
      actions,
      values,
      { getStoreActions, getState }
    ): Promise<boolean> => {
      const apiPost = getStoreActions().api.post;
      const response = await apiPost({
        path: getState().login.path,
        values,
        contentType: getState().login.contentType,
      });

      if (response.data && response.data.token) {
        actions.setToken(response.data.token);
        actions.setRefreshToken(response.data.refresh_token);

        return true;
      }

      return false;
    }
  ),

  useRefreshToken: thunk<AuthStore, undefined, unknown, IvozStore>(
    async (
      actions,
      undefinned,
      { getStoreActions, getState }
    ): Promise<boolean> => {
      const apiPost = getStoreActions().api.post;
      const refresh_token = getState().refreshToken;
      if (!refresh_token) {
        return false;
      }

      const payload = {
        refresh_token,
      };

      try {
        const response = await apiPost({
          path: getState().login.refreshPath,
          values: payload,
          contentType: getState().login.contentType,
          handleErrors: false,
        });

        if (response.data && response.data.token) {
          actions.setToken(response.data.token);
          return true;
        }
      } catch (error) {
        actions.resetRefreshToken();
        console.error(error);
        return false;
      }

      return false;
    }
  ),

  resetAll: thunk<AuthStore, undefined, unknown, IvozStore>(async (actions) => {
    actions.resetToken();
    actions.resetRefreshToken();
  }),
  resetToken: thunk<AuthStore, undefined, unknown, IvozStore>(
    async (actions, undefinned, { getState }) => {
      const sessionStoragePrefix = getState().sessionStoragePrefix;
      localStorage.removeItem(`${sessionStoragePrefix}token`);
      actions.setToken(null);
    }
  ),
  resetRefreshToken: thunk<AuthStore, undefined, unknown, IvozStore>(
    async (actions, undefinned, { getState }) => {
      const sessionStoragePrefix = getState().sessionStoragePrefix;
      localStorage.removeItem(`${sessionStoragePrefix}refreshToken`);
      actions.setRefreshToken(null);
    }
  ),

  exchangeToken: thunk<AuthStore, Record<string, string>, unknown, IvozStore>(
    async (actions, values, { getStoreActions, getState }) => {
      const apiPost = getStoreActions().api.post;
      const response = await apiPost({
        path: getState().login.exchangePath,
        values,
        contentType: getState().login.contentType,
      });

      if (response.data && response.data.token) {
        actions.setToken(response.data.token);
        actions.setRefreshToken(null);

        return true;
      }

      return false;
    }
  ),
};

export default auth;
