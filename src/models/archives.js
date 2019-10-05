import {
  getCTGrecords,
  getCTGrecordData,
  newCTGrecord,
  updateCTGrecord,
  updateCTGexams
} from '@/services/api';

export default {
  namespace: 'archives',
  state: {
    dataSource: [],
    current: {},
    currentData: {}
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
    *fetchCTGrecordData({ payload }, { call, put }) {
      const res = yield call(getCTGrecordData, payload);
      yield put({
        type: 'updateState',
        payload: {
          currentData: res
        }
      })
    },
    *create({ payload }, { call, put }) {
      const res = yield call(newCTGrecord, payload);
    },
    *update({ payload }, { call, put }) {
      const res = yield call(updateCTGrecord, payload);
    },
    *updateExams({ payload }, { call, put }) {
      const res = yield call(updateCTGexams, payload);
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
