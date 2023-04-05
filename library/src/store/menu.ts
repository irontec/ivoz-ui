import { Action, action } from 'easy-peasy';

export interface MenuState {
  hidden: boolean; // mobile only
  variant: 'collapsed' | 'expanded';
  selected: number | string | undefined;
}

interface MenuActions {
  hide: Action<MenuState>;
  toggleVisibility: Action<MenuState>;
  toggleVariant: Action<MenuState>;
  expand: Action<MenuState, number | string>;
  collapse: Action<MenuState>;
}

export type MenuStore = MenuState & MenuActions;

const menu: MenuStore = {
  hidden: false,
  variant: 'expanded',
  selected: undefined,

  // actions
  hide: action<MenuState>((state) => {
    state.hidden = true;
  }),

  toggleVisibility: action<MenuState>((state) => {
    state.hidden = !state.hidden;
  }),

  toggleVariant: action<MenuState>((state) => {
    if (state.variant === 'expanded') {
      state.variant = 'collapsed';

      return;
    }
    state.variant = 'expanded';
  }),

  collapse: action<MenuState>((state) => {
    state.selected = undefined;
  }),

  expand: action<MenuState, number | string>((state, menuKey) => {
    state.selected = menuKey;
  }),
};

export default menu;
