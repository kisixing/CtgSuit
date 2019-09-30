import store from 'store';
import { TOKEN } from '@/utils/constant';
import { getAccount } from '@/services/api';

export default {
  namespace: 'global',
  state: {
    isLogin: store.get(TOKEN),
    layout: [1, 2], // 一行一列 一行两列
    account: {},
  },
  effects: {
    *fetchAccount({ payload }, { call, put }) {
      const res = yield call(getAccount);
      yield put({
        type: 'updateState',
        payload: {
          account: res
        }
      })
    },
    *changeLayout({ payload }, { put, call }) {
      yield put({
        type: 'updateState',
        payload: {},
      });
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
