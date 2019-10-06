
import { WsConnect, EWsStatus } from '@/services/WsConnect';


export default {
  namespace: 'ws',
  state: {
    data: new Map(),
    status: EWsStatus.Pendding
  },
  effects: {
    *connectWs(_, { put, call, select }) {
      const wsConnect = new WsConnect();

      const state = yield select();
      const {
        ws: { status },
      } = state;
      if (status === EWsStatus.Success) return;
      let data = yield call(wsConnect.connect);

      yield put({ type: 'setState', payload: { data } });

    }
  },
  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};


