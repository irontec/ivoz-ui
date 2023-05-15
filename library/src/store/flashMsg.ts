import { Action, action } from 'easy-peasy';

interface FlashMsgState {
  msg: undefined | string | React.ReactNode,
  type: undefined | 'success' | 'warning' | 'error' | 'info',
}

interface FlashMsgActions {
  setFlashMsg: Action<FlashMsgState, FlashMsgState>;
  clear: Action<FlashMsgState>;
}

export type FlashMsgStore = FlashMsgState & FlashMsgActions;

const flashMsg: FlashMsgStore = {
  msg: undefined,
  type: undefined,
  setFlashMsg: action<FlashMsgState, FlashMsgState>((state, {msg, type}) => {
    state.msg = msg;
    state.type = type;
  }),
  clear: action<FlashMsgState>((state) => {
    state.msg = undefined;
    state.type = undefined;
  }),
};

export default flashMsg;
