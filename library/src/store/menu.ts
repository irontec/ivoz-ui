import { Action, action } from 'easy-peasy';

export interface MenuState {
  open: number | string | undefined;
}

interface MenuActions {
  expand: Action<MenuState, number | string>;
  colapse: Action<MenuState>;
}

export type MenuStore = MenuState & MenuActions;

const menu: MenuStore = {
  open: undefined,

  // actions
  colapse: action<MenuState>((state) => {
    state.open = undefined;
  }),

  expand: action<MenuState, number | string>((state, menuKey) => {
    state.open = menuKey;
  }),
};

export default menu;
