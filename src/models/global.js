import store from 'store';
import { TOKEN } from '@/utils/constant';
import { getAccount } from '@/services/api';
import { message } from 'antd';

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
      if (res.sysTime && Math.abs(new Date() - new Date(res.sysTime)) > 5 * 60 * 1000) {
        message.info({
          content:`客户端时间与服务器的时间（${new Date(res.sysTime).toLocaleTimeString()}）相差大于5分钟，请修改系统时间并重启客户端`
        })
      }
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
