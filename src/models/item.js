import { getPregnancy } from '@/services/api';

export default {
  namespace: 'item',
  state: {
    pregnancy: {},
  },
  effects: {
    *fetchPregnancy({ payload }, { call, put }) {
      const res = yield call(getPregnancy, payload);
      yield put({
        type: 'updateState',
        payload: {
          dataSource: res,
        },
      });
    },
    // *create({ payload }, { call, put }) {
    //   const res = yield call(newCTGrecord, payload);
    // },
    // *update({ payload }, { call, put }) {
    //   const res = yield call(updateCTGrecord, payload);
    // },
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
