import { Action, action } from 'easy-peasy';

interface AboutInfoState {
  version: string;
  commit: string;
  lastUpdated: string;
}

interface AboutInfoActions {
  setVersion: Action<AboutInfoState, string>;
  setCommit: Action<AboutInfoState, string>;
  setLastUpdated: Action<AboutInfoState, string>;
}

export type AboutInfoStore = AboutInfoActions & AboutInfoState;

const aboutInfo: AboutInfoStore = {
  version: 'development',
  commit: 'HEAD',
  lastUpdated: 'now',

  setVersion: action<AboutInfoState, string>((state, version) => {
    state.version = version;
  }),

  setCommit: action<AboutInfoState, string>((state, commit) => {
    state.commit = commit;
  }),

  setLastUpdated: action<AboutInfoState, string>((state, lastUpdated) => {
    state.lastUpdated = lastUpdated;
  }),
};

export default aboutInfo;
