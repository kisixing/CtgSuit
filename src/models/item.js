import { getPregnancy, getPDFflow, getCTGrecordData } from '@/services/api';

export default {
  namespace: 'item',
  state: {
    pregnancy: {}, // 检索的孕册信息
    pdfflow: null,
    ctgData: null,
  },
  effects: {
    *fetchPregnancy({ payload }, { call, put }) {
      const res = yield call(getPregnancy, payload);
      yield put({
        type: 'updateState',
        payload: {
          pregnancy: res[0],
        },
      });
    },
    *fetchPDFflow({ payload }, { call, put }) {
      const res = yield call(getPDFflow, payload);
      yield put({
        type: 'updateState',
        payload: {
          pdfflow: res.pdfdata || "",
        },
      });
    },
    *fetchCTGData({ payload }, { call, put }) {
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
          ctgData: CTGDATA,
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
