import { Action, action, computed, Computed, Thunk, thunk } from 'easy-peasy';
import { CriteriaFilterValue, CriteriaFilterValues } from '../components/List/Filter/ContentFilter';
import { EntityValues } from '../services/entity/EntityService';

type DirectionType = 'asc' | 'desc';

export interface ListState {
  rows: Array<EntityValues>,
  headers: Record<string, string>,
}

interface ListActions {
  setRows: Action<ListState, Array<EntityValues>>,
  setHeaders: Action<ListState, Record<string, string>>,
  reset: Thunk<ListState, undefined, unknown>
}

export type ListStore = ListState & ListActions;

const list: ListStore = {
  rows: [],
  headers: {},

  // actions
  setRows: action<ListState, Array<EntityValues>>((state, rows) => {
    state.rows = [...rows];
  }),

  setHeaders: action<ListState, Record<string, string>>((state, headers) => {
    state.headers = {...headers};
  }),

  // thunks
  reset: thunk<ListActions, undefined, unknown>(
    async (actions) => {
      actions.setRows([]);
      actions.setHeaders({});
    }
  )
};

export default list;