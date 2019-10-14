import { getPregnancies, updatePregnancy } from '@/services/api';

export default {
  namespace: 'pregnancy',
  state: {
    pregnancies: [], // 孕册列表
  },
  effects: {
    *fetchPregnancies({ payload }, { call, put }) {
      const res = yield call(getPregnancies, payload);
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