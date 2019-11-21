
import { WsService } from '@lianmed/lmg';
import { ICache, BedStatus } from '@lianmed/lmg/lib/services/WsService';

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

      let data: ICache = yield call(wsService.getDatacache.bind(wsService));
      console.log('datacache', data)
      const offline = [...data.entries()].filter(([k, v]) => v.status === BedStatus.Offline).map(([k, v]) => k)
      yield put({ type: 'setState', payload: { data } });
      yield put({ type: 'list/setState', payload: { offline: new Set(offline) } });
      yield put({ type: 'list/processListData' });
    },
    *updateData({ payload }, { put, select }) {
      const { data } = payload

      const { offline, dirty } = yield select(state => state.list);
      const newOffline: Set<string> = new Set(offline);
      const newDirty: Set<string> = new Set(dirty);

      [...data.entries()].forEach(([k, v]) => {
        if (v.status !== BedStatus.Offline && newOffline.has(k)) {
          newOffline.delete(k)
        }
        if (v.status !== BedStatus.Stopped && newDirty.has(k)) {
          newDirty.delete(k)
        }
      })
      yield put({ type: 'setState', payload });
      yield put({
        type: 'list/setState', payload: {
          offline: newOffline,
          dirty: newDirty,
        }
      });
      yield put({ type: 'list/processListData' });
    }
  },
  reducers: {
    setState(state, { payload }) {
      // console.log('ws setState')
      return {
        ...state,
        ...payload,
      };
    },
  },
};


