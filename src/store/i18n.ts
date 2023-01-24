import { Action, action } from 'easy-peasy';

export type Language = {
  name: string;
  locale: string;
};

export interface LanguagesState {
  languages: Array<Language>;
}

interface LanguagesActions {
  setLanguages: Action<LanguagesState>;
}

export type LanguagesStore = LanguagesState & LanguagesActions;

const languages: LanguagesStore = {
  languages: [],

  // actions
  setLanguages: action<LanguagesState>((state, languages) => {
    state.languages = [...languages];
  }),
};

export default languages;
