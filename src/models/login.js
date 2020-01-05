import { routerRedux } from 'dva';

import { parse } from 'qs';
import store from 'store';
import { TOKEN } from '@/utils/constant';
import { compile } from '@/utils/utils';
import { authenticate } from '@/services/api';

export default {
  namespace: 'login',
  state: {
    error: {
      status: '',
      desc: '',
    },
  },
  subscriptions: {},
  effects: {
    *login({ payload }, { put, call }) {
      let data = {};
      data = yield call(authenticate, payload);
      const auth = data && data.id_token ? true : false;
      if (auth) {
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
          },
        });
        store.set(TOKEN, `Bearer ${data.id_token}`);
        // TODO 暂时存储登录账户密码
        store.set('ACCOUNT', {
          uaername: payload.username,
          password: compile(payload.password),
        });
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
      }
    },
    *verification({ payload }, { call, put }) {
      // 验证用户登录
      const data = yield call(authenticate, payload);
      const auth = data && data.id_token ? true : false;
      if (auth) {
        store.set(TOKEN, `Bearer ${data.id_token}`);
      }
    },
    *logout(_, { put }) {
      localStorage.removeItem('Lian-Med-Access-Token')
      yield put({
        type: 'global/updateState',
        payload: {
          isLogin: false
        }
      })
    }
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
