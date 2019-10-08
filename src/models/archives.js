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
    currentData: null,
  },
  effects: {
    *fetchRecords({ payload }, { call, put }) {
      const res = yield call(getCTGrecords);
      yield put({
        type: 'updateState',
        payload: {
          dataSource: res,
        },
      });
    },
    // 获取静态ctg数据，渲染静态ctg曲线
    *fetchCTGrecordData({ payload }, { call, put }) {
      const res = yield call(getCTGrecordData, payload) || {};
      // 处理值，以便符合ctg曲线数据要求
      let CTGDATA = { fhr: [[], [], []], toco: [], fm: [], fetal_num: 2, index :0};
      Object.keys(res).forEach(key => {
        let oridata = res[key];
        if (!oridata) {
          return;
        }
        CTGDATA.index = oridata.length;
        for (let i = 0; i < oridata.length; i++) {
          let hexBits = oridata.substring(0, 2);
          let data_to_push = parseInt(hexBits, 16);
          if (key === 'fhr1') {
            CTGDATA.fhr[0][i] = data_to_push;
          } else if (key === 'fhr2') {
            CTGDATA.fhr[1][i] = data_to_push;
          } else if (key === 'fhr3') {
            CTGDATA.fhr[2][i] = data_to_push;
          } else if (key === 'toco') {
            CTGDATA.toco[i] = data_to_push;
          } else if (key === 'fm') {
            CTGDATA.fm[i] = data_to_push;
          }
        }
      });
      console.log('result', CTGDATA);
      yield put({
        type: 'updateState',
        payload: {
          currentData: CTGDATA,
        },
      });
    },
    *create({ payload }, { call, put, select }) {
      const res = yield call(newCTGrecord, payload);
      if (res && res.id) {
        message.success('创建成功！');
        // 创建成功后更新bed information
        const bedinfo = yield select(state => state.list.pageItems);
        const { ctgexam, pregnancy } = res;
        const note = ctgexam.note.split('_');
        const [bedno, deviceno, ...rest] = note;
        // const selected = bedinfo.filter(item => item.bedno === bedno && item.deviceno === deviceno);
        const newBedinfo = bedinfo.map(item => {
          if (item.bedno === bedno && item.deviceno === deviceno) {
            return {
              ...item,
              pregnancy,
            };
          }
          return item;
        });

        yield put({
          type: 'list/setState',
          payload: {
            pageItems: newBedinfo,
          },
        });
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
