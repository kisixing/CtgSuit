
import { WsService } from '@lianmed/lmg';

const EWsStatus = WsService.wsStatus

export default {
  namespace: 'ws',
  state: {
    data: new Map(),
    status: EWsStatus.Pendding
  },
  effects: {
    *connectWs(_, { put, call, select }) {
      const wsService = WsService._this;
      const state = yield select();
      const {
        ws: { status },
      } = state;
      if (status === EWsStatus.Success) return; 
      
      let data = yield call(wsService.getDatacache.bind(wsService));
      console.log('datacache',data)
      yield put({ type: 'setState', payload: { data } });
      yield put({ type: 'list/processListData'});

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


