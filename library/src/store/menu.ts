import { Action, action } from 'easy-peasy';

export interface MenuState {
  open: Array<number | string>;
}

interface MenuActions {
  expand: Action<MenuState, number | string>;
  colapse: Action<MenuState, number | string>;
}

export type MenuStore = MenuState & MenuActions;

const list: MenuStore = {
  open: [0],

  // actions
  colapse: action<MenuState, number | string>((state, menuKey) => {
    state.open = state.open.filter((item) => item != menuKey);
  }),

  expand: action<MenuState, number | string>((state, menuKey) => {
    state.open.push(menuKey);
  }),
};

export default list;
