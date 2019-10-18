import { message } from 'antd';
import {
  getCTGrecords,
  getCTGrecordData,
  newCTGrecord,
  updateCTGrecord,
} from '@/services/api';
import moment from 'moment';

export default {
  namespace: 'archives',
  state: {
    dataSource: [],
    current: {},
    CTGData: null, // ctg曲线数据
    isFullscreen: false,
  },
  effects: {
    *fetchRecords({ payload }, { call, put }) {
      const res = yield call(getCTGrecords, payload);
      yield put({
        type: 'updateState',
        payload: {
          dataSource: res.reverse(),
        },
      });
    },
    // 获取静态ctg数据，渲染静态ctg曲线
    *fetchCTGrecordData({ payload }, { call, put }) {
      const res = yield call(getCTGrecordData, payload) || {};
      // 处理值，以便符合ctg曲线数据要求
      let pureidarr = payload.ctgexamid.split('_');
      let CTGDATA = { fhr: [[], [], []], toco: [], fm: [], fetal_num: 2, index: 0, starttime: '' };
      if (pureidarr.length > 2) {
        let pureid = pureidarr[2];
        CTGDATA.starttime =
          '20' +
          pureid.substring(0, 2) +
          '-' +
          pureid.substring(2, 4) +
          '-' +
          pureid.substring(4, 6) +
          ' ' +
          pureid.substring(6, 8) +
          ':' +
          pureid.substring(8, 10) +
          ':' +
          pureid.substring(10, 12);
      }
      Object.keys(res).forEach(key => {
        let oridata = res[key];
        if (!oridata) {
          return;
        }
        CTGDATA.index = oridata.length / 2;
        for (let i = 0; i < CTGDATA.index; i++) {
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
          oridata = oridata.substring(2, oridata.length);
        }
      });
      yield put({
        type: 'updateState',
        payload: {
          CTGData: CTGDATA,
        },
      });
    },
    *create({ payload, callback }, { call, put, select }) {
      const res = yield call(newCTGrecord, payload);
      if (res && res.id) {
        message.success('绑定成功！');
        // 创建成功后更新bed information
        // const bedinfo = yield select(state => state.list.pageItems);
        // const { ctgexam, pregnancy, visitTime, id } = res;
        // const note = ctgexam.note.split('_');
        // const [bedno, deviceno, ...rest] = note;
        // // const selected = bedinfo.filter(item => item.bedno === bedno && item.deviceno === deviceno);
        // const newBedinfo = bedinfo.map(item => {
        //   if (item.bedno === bedno && item.deviceno === deviceno) {
        //     return {
        //       ...item,
        //       pregnancy,
        //       documentno: ctgexam.note, // 确保信息更新 要求docid documentno一致
        //       prenatalVisit: {
        //         doctor: null,
        //         gestationalWeek: null,
        //         id: id,
        //         visitTime: moment(visitTime),
        //         visitType: null,
        //         ctgexam: {
        //           ...ctgexam,
        //           startTime: moment(ctgexam.startTime),
        //         },
        //       },
        //     };
        //   }
        //   return item;
        // });
        // yield put({
        //   type: 'list/setState',
        //   payload: {
        //     pageItems: newBedinfo,
        //   },
        // });
      }
      if (callback && typeof callback === 'function') {
        callback(res); // 返回结果
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
  subscriptions: {
    // 进入该页面 清空内容
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathname === '/archives') {
          dispatch({
            type: 'updateState',
            payload: {
              current: {},
              CTGData: null,
            },
          });
        }
      });
    },
  },
};
