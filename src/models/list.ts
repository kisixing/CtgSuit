// import { getList } from '@/services/list.js';
import { message } from 'antd';
import { newPregnancies } from '@/services/api';
import { connectWs } from '@/services/connectWs';
import { getList } from '@/services/list';
message.config({
  top: 150,
  duration: 2,
});

export default {
  namespace: 'list',
  state: {
    listData: [], //所有数据
    pageData: [], //[[1,4],[5,8]]
    page: null, //当前页码
    pageItems: [], //[listItem,...]
    datacache: new Map(),
  },
  effects: {
    *getlist(_, { put, call }) {
      //   const res = yield call(getList, { name: 'zsd', age: '14' });
      const cache: Map<string, object> = yield call(connectWs);
      let rawData: IItem[] = yield call(getList);

      rawData =
        (rawData &&
          rawData.map(_ => {
            const unitId = `${_.deviceno}-${_.subdevice}`;
            return { ..._, data: cache.get(unitId), unitId };
          })) ||
        [];

      yield put({ type: 'dataHandler', rawData });
    },
    *dataHandler({ rawData }: { rawData: IItem[] }, { put, select }) {
      const state = yield select();
      const {
        setting: { listLayout },
      } = state;
      const pageItemsCount: number = listLayout[0] * listLayout[1];

      const listData = rawData.map((_, index) => {
        return { ..._, index, pageIndex: Math.floor(index / pageItemsCount) };
      });

      yield put({ type: 'setState', payload: { listData } });
      yield put({ type: 'setPageData' });
      yield put({ type: 'setPageItems', page: 0 });
    },
    *setPageData(payload, { put, select }) {
      const state = yield select();
      const {
        setting: { listLayout },
        list: { listData },
      } = state;
      const listLen = listData.length;

      const pageItemsCount: number = listLayout[0] * listLayout[1];
      const pageCount: number = Math.ceil(listLen / pageItemsCount);
      const pageData = new Array(pageCount).fill(0).map((_, index) => {
        if (index === pageCount - 1) {
          const lastLeft = 1 + index * pageItemsCount;
          return [lastLeft, listLen];
        }
        return [1 + index * pageItemsCount, (index + 1) * pageItemsCount];
      });

      yield put({ type: 'setState', payload: { pageData } });
    },
    *setPageItems({ page }, { put, select }) {
      const state = yield select();
      const {
        setting: { listLayout },
        list: { listData, page: oldPage },
      } = state;
      if (page === oldPage) return;
      const pageItemsCount: number = listLayout[0] * listLayout[1];
      const pageItems = listData.slice(page * pageItemsCount, (page + 1) * pageItemsCount);
      yield put({ type: 'setState', payload: { pageItems, page } });
    },
    // 建档
    *createPregnancies({ payload }, { call, put }) {
      const res = yield call(newPregnancies, payload);
      if (res && res.id) {
        message.success('创建成功！');
      }
      yield put({
        type: 'setState',
        payload: {},
      });
    },
  },
  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

interface IItem {
  bedname: string;
  bedno: string;
  deviceno: string;
  documentno: string;
  id: number;
  unitId: string;
  pregnancy: {
    age: number;
    dob: any;
    doctor: any;
    edd: any;
    ethnic: any;
    gender: any;
    gravidity: number;
    id: number;
    idNO: any;
    idType: any;
    inpatientNO: string;
    insuranceType: any;
    lmp: any;
    name: string;
    organization: any;
    outpatientNO: any;
    parity: number;
    prenatalscreens: any;
    riskRecords: any[];
    sureEdd: any;
    telephone: string;
  };
  status: string;
  subdevice: string;
  type: string;
  updateTime: string;
}
