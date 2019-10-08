import { message } from 'antd';
import {
  getCTGrecords,
  getCTGrecordData,
  newCTGrecord,
  updateCTGrecord,
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
    // 获取静态ctg数据，渲染静态ctg曲线
    *fetchCTGrecordData({ payload }, { call, put }) {
      const res = yield call(getCTGrecordData, payload);
      // 处理值，以便符合ctg曲线数据要求
      yield put({
        type: 'updateState',
        payload: {
          currentData: res
        }
      })
    },
    *create({ payload }, { call, put }) {
      const res = yield call(newCTGrecord, payload);
      if (res && res.id) {
        message.success('创建成功！');
        // 创建成功后更新bed的information
        // yield put({
        //   type: 'list/getlist'
        // })
      }
    },
    *update({ payload, callback }, { call, put }) {
      const res = yield call(updateCTGrecord, payload);
      if (callback && typeof callback === 'function') {
        callback(res); // 返回结果
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
