import { Action, action } from 'easy-peasy';

export type Language = {
  name: string;
  locale: string;
};

export interface ThemeState {
  name: string;
  theme: string;
  logo: string;
}

interface ThemeActions {
  setName: Action<ThemeState>;
  setTheme: Action<ThemeState>;
  setLogo: Action<ThemeState>;
}

export type ThemeStore = ThemeState & ThemeActions;

const theme: ThemeStore = {
  name: '',
  theme: '',
  logo: '',

  // actions
  setName: action<ThemeState>((state, name) => {
    state.name = name;
  }),
  setTheme: action<ThemeState>((state, theme) => {
    state.theme = theme;
  }),
  setLogo: action<ThemeState>((state, logo) => {
    state.logo = logo;
  }),
};

export default theme;
