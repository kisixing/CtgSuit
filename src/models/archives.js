import { message } from 'antd';
import {
  getCTGrecords,
  getCount,
  getCTGrecordData,
  newCTGrecord,
  updateCTGrecord,
  nosaveCTG,
} from '@/services/api';

export default {
  namespace: 'archives',
  state: {
    count: 0,
    dataSource: [],
    current: {},
    CTGData: null, // ctg曲线数据
    isFullscreen: false,
    // 记录分页器数据
    pagination: {
      size: 5,
      page: 0,
    },
  },
  effects: {
    *fetchRecords({ payload }, { call, put, select }) {
      const { pagination } = yield select(s => s.archives)
      const params = {
        ...pagination,
        sort: 'visitDate,asc',
        ...payload,
      };
      const res = yield call(getCTGrecords, params);
      yield put({
        type: 'updateState',
        payload: {
          dataSource: res,
        },
      });
    },
    *fetchCount({ payload }, { call, put }) {
      const res = yield call(getCount, payload);
      yield put({
        type: 'updateState',
        payload: {
          count: res,
        },
      });
    },
    // 获取静态ctg数据，渲染静态ctg曲线
    *fetchCTGrecordData({ payload }, { call, put }) {
      const res = yield call(getCTGrecordData, payload) || {};

      yield put({
        type: 'updateState',
        payload: {
          CTGData: res,
        },
      });
    },
    *create({ payload, callback }, { call, put, select }) {
      const res = yield call(newCTGrecord, payload);
      // console.log("TCL: *create -> res", res)
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
