import { Action, action, Thunk, thunk } from 'easy-peasy';
import { EntityValues } from '../services/entity/EntityService';

export interface FormState {
  row: EntityValues | undefined;
}

interface FormActions {
  setRow: Action<FormState, undefined | EntityValues>;
  reset: Thunk<FormState, undefined, unknown>;
}

export type FormStore = FormState & FormActions;

const list: FormStore = {
  row: undefined,

  setRow: action<FormState, EntityValues>((state, row) => {
    state.row = row ? { ...row } : undefined;
  }),
  // thunks
  reset: thunk<FormActions, undefined, unknown>(async (actions) => {
    actions.setRow(undefined);
  }),
};

export default list;
