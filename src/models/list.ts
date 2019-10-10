import { message } from 'antd';
import { newPregnancies, getPregnancy } from '@/services/api';
import { getList } from '@/services/list';

export default {
  namespace: 'list',
  state: {
    listData: [], // 所有bed数据
    pageData: [], // [[1,4],[5,8]]
    page: null, //当前页码
    pageItems: [], // [listItem,...] 床位信息
    fullScreenId: null,
    pregnancy: {}, // 初始化，暂无使用
  },
  effects: {
    *getlist(_, { put, call, select }) {
      // get bed information
      let rawData: IDevice[] = yield call(getList);
      yield put({
        type: 'setState',
        payload: { listData: rawData || [] }
      });
      yield put({ type: 'processListData' });
    },
    *updateBeds({ payload }, { call, put, select }) {
      let data = yield call(getList);
      const oldData = yield select(_ => _.list.listData);
      // const isDdifference = data !== oldData;
      // if (isDdifference) {
      //   yield put({
      //     type: 'setState',
      //     payload: {
      //       listData: data || []
      //     }
      //   })
      // }
      yield put({
        type: 'setState',
        payload: {
          listData: data || []
        }
      })
    },
    *processListData(payload, { put, select }) {
      const state = yield select();
      let {
        setting: { listLayout },
        list: { listData },
        ws: { data }
      } = state;
      const pageItemsCount: number = listLayout[0] * listLayout[1];

      listData = (listData as IDevice[])
        .map(_ => {
          const unitId = `${_.deviceno}-${_.subdevice}`;
          return { ..._, unitId };
        })
        .filter(_ => (data as Map<any, any>).has(_.unitId))
        .map((_, index) => {
          return { ..._, index, pageIndex: Math.floor(index / pageItemsCount) };
        });

      yield put({ type: 'setState', payload: { listData } });
      yield put({ type: 'computeLayout' });
    },
    *computeLayout({ }, { put, select }) {
      const state = yield select();
      const {
        setting: { listLayout },
        list: { listData: oldListData },
        ws: { data }
      } = state;
      const pageItemsCount: number = listLayout[0] * listLayout[1];

      const listData = (oldListData as IDevice[]).map((_, index) => {
        return { ..._, index, pageIndex: Math.floor(index / pageItemsCount) };
      }).filter(_ => (data as Map<any, any>).has(_.unitId));
      yield put({
        type: 'setState',
        payload: { listData }
      });

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
      let pageData = new Array(pageCount).fill(0).map((_, index) => {

        if (index === pageCount - 1) {
          const lastLeft = index * pageItemsCount;
          return [lastLeft, listLen - 1];
        }
        return [index * pageItemsCount, (index + 1) * pageItemsCount - 1];
      });

      pageData = pageData.map(([left, right]) => {
        return listData.slice(left, right + 1).map(_ => _.bedname)
      })

      yield put({ type: 'setState', payload: { pageData } });
    },
    *setPageItems({ page }, { put, select }) {
      const state = yield select();
      const {
        setting: { listLayout },
        list: { listData },
      } = state;
      const pageItemsCount: number = listLayout[0] * listLayout[1];
      const pageItems = listData.slice(page * pageItemsCount, (page + 1) * pageItemsCount);
      yield put({
        type: 'setState',
        payload: { pageItems, page }
      });
    },
    // 新建档案modal页面的搜索功能，检索个人孕册信息
    *fetchPregnancy({ payload, callback }, { call, put }) {
      const res = yield call(getPregnancy, payload);
      if (callback && typeof callback === 'function') {
        callback(res[0]); // 返回结果
      }
      yield put({
        type: 'setState',
        payload: {
          pregnancy: res[0],
        },
      });
    },
    // 新建孕册
    *createPregnancy({ payload, callback }, { call, put, select }) {
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
    setState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export interface IDevice {
  bedname: string;
  bedno: string;
  deviceno: string;
  documentno: string;
  id: number;
  unitId: string;
  data: any;
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
