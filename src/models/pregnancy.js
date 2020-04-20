import {
  getPregnancies,
  getPregnancyCount,
  updatePregnancy,
  newPregnancies
} from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'pregnancy',
  state: {
    count: 0,
    pregnancies: [], // 孕册列表
    // 记录分页器数据
    pagination: {
      size: 10,
      page: 0,
    },
  },
  effects: {
    *fetchPregnancies({ payload, callback }, { call, put }) {
      const params = {
        size: 10,
        page: 0,
        sort: 'id,asc',
        ...payload,
      };
      const res = yield call(getPregnancies, params);
      if (callback && typeof callback === 'function') {
        callback(res); // 返回结果
      }
      // 根据病区号过滤数据
      // const areaNO = SettingStore.getSync('areano');
      // const data = res.filter(e => e.pregnancy && e.pregnancy.areaNO === areaNO);
      yield put({
        type: 'updateState',
        payload: {
          pregnancies: res,
          pagination: {
            size: params.size,
            page: params.page,
          }
        },
      });
    },
    *fetchCount({ payload }, { call, put }) {
      const res = yield call(getPregnancyCount, payload);
      yield put({
        type: 'updateState',
        payload: {
          count: res,
        },
      });
    },
    *update({ payload }, { call, put }) {
      const res = yield call(updatePregnancy, payload);
      if (res && res.id) {
        message.success('修改成功！');
      } else {
        message.error('修改失败，请稍后...');
      }
    },
    *create({ payload, callback }, { call, put }) {
      const res = yield call(newPregnancies, payload);
      if (res && res.id) {
        message.success('孕册创建成功！');
        if (callback && typeof callback === 'function') {
          callback(res); // 返回结果
        }
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