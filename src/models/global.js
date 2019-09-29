import store from 'store';
import { TOKEN } from '@/utils/constant';

export default {
  namespace: 'global',
  state: {
    isLogin: store.get(TOKEN),
    layout: [1, 2], // 一行一列 一行两列
    currentUser: {},
  },
  effects: {
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
