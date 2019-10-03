import { getCTGrecords, newCTGrecord, updateCTGrecord } from '@/services/api';

export default {
  namespace: 'archives',
  state: {
    dataSource: [],
    current: {},
  },
  effects: {
    *fetchRecords({ payload }, { call, put }) {
      const res = yield call(getCTGrecords);
      yield put({
        type: 'updateState',
        payload: {
          dataSource: res
        }
      })
    },
    *create({ payload }, { call, put }) {
      const res = yield call(newCTGrecord, payload);
    },
    *update({ payload }, { call, put }) {
      const res = yield call(updateCTGrecord, payload);
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
