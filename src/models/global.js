import store from 'store';
import { TOKEN } from '@/utils/constant';
import { getAccount } from '@/services/api';
import { message, Modal } from 'antd';

export default {
  namespace: 'global',
  state: {
    isLogin: store.get(TOKEN),
    layout: [1, 2], // 一行一列 一行两列
    account: {},
    isAdmin: false
  },
  effects: {
    *fetchAccount({ payload }, { call, put }) {
      let isAdmin = false
      const res = yield call(getAccount);
      if (res.sysTime && Math.abs(new Date() - new Date(res.sysTime)) > 5 * 60 * 1000) {
        Modal.warn({
          content: `客户端时间与服务器的时间（${new Date(res.sysTime).toLocaleTimeString()}）相差大于5分钟，请修改系统时间并重启客户端。`
        })
        // message.info({
        //   content:`客户端时间与服务器的时间（${new Date(res.sysTime).toLocaleTimeString()}）相差大于5分钟，请修改系统时间并重启客户端`
        // })
      }
      if (res.groups && res.groups.length) {
        isAdmin = res.groups[0].name === 'ADMIN'
      }
      yield put({
        type: 'updateState',
        payload: {
          account: res,
          isAdmin
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
