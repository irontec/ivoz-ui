import { action, Action, Thunk, thunk } from 'easy-peasy';
import ApiClient from '../services/api/ApiClient';
import { IvozStore } from '../index';

interface AuthState {
  sessionStoragePrefix: string,
  token: string | null,
  refreshToken: string | null,
}

interface AuthActions {
  setToken: Action<AuthState, string | null>,
  setRefreshToken: Action<AuthState, string | null>,
  init: Thunk<AuthState>,
  resetToken: Thunk<AuthState>,
}

export type AuthStore = AuthActions & AuthState;

const auth: AuthStore = {
  sessionStoragePrefix: 'app-',
  token: null,
  refreshToken: null,

  // actions
  setToken: action<AuthState, string | null>((state, token) => {

    if (token) {
      sessionStorage.setItem(`${state.sessionStoragePrefix}token`, token);
      ApiClient.setToken(token);
    } else {
      sessionStorage.removeItem(`${state.sessionStoragePrefix}token`);
    }

    state.token = token;
  }),

  setRefreshToken: action<AuthState, string | null>((state, refreshToken) => {

    if (refreshToken) {
      sessionStorage.setItem(`${state.sessionStoragePrefix}refreshToken`, refreshToken);
    } else {
      sessionStorage.removeItem(`${state.sessionStoragePrefix}refreshToken`);
    }

    state.refreshToken = refreshToken;
  }),

  // thunks
  init: thunk<AuthStore>(async (actions, undefinned, { getState }) => {
    const sessionStoragePrefix = getState().sessionStoragePrefix;
    actions.setToken(
      sessionStorage.getItem(`${sessionStoragePrefix}token`) as string
    );
  }),

  resetToken: thunk<AuthStore, undefined, unknown, IvozStore>(async (actions, undefinned, { getState }) => {
    const sessionStoragePrefix = getState().sessionStoragePrefix;
    sessionStorage.removeItem(`${sessionStoragePrefix}token`);
    actions.setToken(null);
  }),
};

export default auth;
