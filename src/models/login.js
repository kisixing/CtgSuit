import { routerRedux } from 'dva/router';
import { parse } from 'qs';
import store from 'store';
import { TOKEN } from '@/utils/constant';
import { login } from '@/services/api';

export default {
  namespace: 'login',
  state: {
    error: {
      status: '',
      desc: '',
      currentUser: {
        data: {}
      }
    },
  },
  subscriptions: {},
  effects: {
    *login({ payload }, { put, call, select }) {
      const data = yield call(login, payload);

      if (data.status === 'success') {
        // 登录验证成功
        yield put({
          type: 'updateState',
          payload: {
            error: {},
          },
        });
        yield put({
          type: 'global/updateState',
          payload: {
            isLogin: true,
            currentUser: data,
          },
        });
        store.set(TOKEN, data['Access-Token']);
        const urlParams = new URL(window.location.href);
        const params = parse(window.location.href.split('?')[1]);
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            redirect = null;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      } else {
        // 登录验证失败
        yield put({
          type: 'updateState',
          payload: {
            error: data,
          },
        });
        throw data;
      }
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
