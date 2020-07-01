import {
  getPregnancies,
  getPregnancyCount,
  updatePregnancy,
  newPregnancies
} from '@/services/api';
import { message, Modal } from 'antd';
import request from '@lianmed/request';
import { IPregnancy } from '../types'
import SettingStore from "@/utils/SettingStore";
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
    *create({ payload, callback }, { call, put, select }) {
      const { isIn } = yield select(s => s.global)
      const rawList: IPregnancy[] = yield call(getPregnancies, { 'bedNO.equals': payload.bedNO });
      const existList = rawList.filter(_ => _.recordstate === '10')
      if (existList.length) {
        isIn && Modal.confirm({
          centered: true,
          okText: '确定',
          cancelText: '放弃',
          title: '提示',
          content: `已存在相同床号的孕妇：${existList.map(_ => _.name).join('、')}等${existList.length}人，是否编辑为出院？`,
          onOk() {
            Promise
              .all(existList.map(_ => {
                return request.put('/pregnancies', { data: { ..._, recordstate: "20" } })
              }))
              .then(() => callback && callback(res))
          },
          onCancel() {

          }
        })
      }
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