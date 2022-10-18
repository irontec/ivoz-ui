import { Action, action } from 'easy-peasy';

export interface MenuState {
  close: Array<number | string>;
}

interface MenuActions {
  expand: Action<MenuState, number | string>;
  colapse: Action<MenuState, number | string>;
}

export type MenuStore = MenuState & MenuActions;

const list: MenuStore = {
  close: [],

  // actions
  colapse: action<MenuState, number | string>((state, menuKey) => {
    state.close.push(menuKey);
  }),

  expand: action<MenuState, number | string>((state, menuKey) => {
    state.close = state.close.filter((item) => item != menuKey);
  }),
};

export default list;
