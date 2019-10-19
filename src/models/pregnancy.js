import { getPregnancies, updatePregnancy } from '@/services/api';

export default {
  namespace: 'pregnancy',
  state: {
    pregnancies: [], // 孕册列表
  },
  effects: {
    *fetchPregnancies({ payload, callback }, { call, put }) {
      const res = yield call(getPregnancies, payload);
      if (callback && typeof callback === 'function') {
        callback(res); // 返回结果
      }
      yield put({
        type: 'updateState',
        payload: {
          pregnancies: res,
        },
      });
    },
    *update({ payload }, { call, put }) {
      const res = yield call(updatePregnancy, payload);
      console.log("TCL: *update -> res", res)

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