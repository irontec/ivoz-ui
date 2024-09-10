import { Action, action, Thunk, thunk } from 'easy-peasy';
import { EntityValues } from '../services/entity/EntityService';
import { NullablePropertyFkChoices } from '../entities';

type FkChoicesType = {
  [key: string]: NullablePropertyFkChoices;
};

export interface ListState {
  reloadTimestamp: number;
  parentRow: EntityValues | undefined;
  rows: Array<EntityValues>;
  customData: undefined | unknown;
  headers: Record<string, string>;
  fkChoices: FkChoicesType;
}

interface ListActions {
  reload: Action<ListState>;
  setParentRow: Action<ListState, undefined | EntityValues>;
  setRows: Action<ListState, Array<EntityValues>>;
  setCustomData: Action<ListState, unknown>;
  setHeaders: Action<ListState, Record<string, string>>;
  setFkChoices: Action<ListState, FkChoicesType>;
  reset: Thunk<ListState, undefined, unknown>;
}

export type ListStore = ListState & ListActions;

const list: ListStore = {
  reloadTimestamp: 0,
  parentRow: undefined,
  rows: [],
  customData: undefined,
  headers: {},
  fkChoices: {},

  // actions
  reload: action<ListState>((state) => {
    state.reloadTimestamp = Date.now();
  }),

  setParentRow: action<ListState, undefined | EntityValues>((state, row) => {
    state.parentRow = row;
  }),

  setRows: action<ListState, Array<EntityValues>>((state, rows) => {
    state.rows = [...rows];
  }),

  setCustomData: action<ListState, unknown>((state, customData) => {
    state.customData = customData;
  }),

  setHeaders: action<ListState, Record<string, string>>((state, headers) => {
    state.headers = { ...headers };
  }),

  setFkChoices: action<ListState, FkChoicesType>((state, fkChoices) => {
    state.fkChoices = fkChoices;
  }),

  // thunks
  reset: thunk<ListActions, undefined, unknown>(async (actions) => {
    actions.setRows([]);
    actions.setCustomData(undefined);
    actions.setHeaders({});
    actions.setFkChoices({});
  }),
};

export default list;
