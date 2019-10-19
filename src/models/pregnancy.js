import { getPregnancies, updatePregnancy, newPregnancies } from '@/services/api';
import { message } from 'antd';

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
      if (res && res.id) {
        message.success('修改成功！')
      } else {
        message.error('修改失败，请稍后...')
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