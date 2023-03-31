import { Action, action } from 'easy-peasy';

export interface MenuState {
  variant: 'colapsed' | 'expanded';
  open: number | string | undefined;
}

interface MenuActions {
  toggleVariant: Action<MenuState>;
  expand: Action<MenuState, number | string>;
  colapse: Action<MenuState>;
}

export type MenuStore = MenuState & MenuActions;

const menu: MenuStore = {
  variant: 'expanded',
  open: undefined,

  // actions
  toggleVariant: action<MenuState>((state) => {
    if (state.variant === 'expanded') {
      state.variant = 'colapsed';

      return;
    }
    state.variant = 'expanded';
  }),

  colapse: action<MenuState>((state) => {
    state.open = undefined;
  }),

  expand: action<MenuState, number | string>((state, menuKey) => {
    state.open = menuKey;
  }),
};

export default menu;
