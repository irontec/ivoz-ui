import { action, Action, Thunk, thunk } from 'easy-peasy';
import ApiClient from '../services/api/ApiClient';
import { IvozStore } from '../index';

interface AuthState {
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
  token: null,
  refreshToken: null,

  // actions
  setToken: action<AuthState, string | null>((state, token) => {

    if (token) {
      sessionStorage.setItem('token', token);
      ApiClient.setToken(token);
    } else {
      sessionStorage.removeItem('token');
    }

    state.token = token;
  }),

  setRefreshToken: action<AuthState, string | null>((state, refreshToken) => {

    if (refreshToken) {
      sessionStorage.setItem('refreshToken', refreshToken);
    } else {
      sessionStorage.removeItem('refreshToken');
    }

    state.refreshToken = refreshToken;
  }),

  // thunks
  init: thunk<AuthStore>(async (actions) => {
    actions.setToken(
      sessionStorage.getItem('token') as string
    );
  }),

  resetToken: thunk<AuthStore, undefined, unknown, IvozStore>(async (actions) => {
    sessionStorage.removeItem('token');
    actions.setToken(null);
  }),
};

export default auth;
