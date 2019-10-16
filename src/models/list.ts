import { message } from 'antd';
import { newPregnancies, getPregnancy } from '@/services/api';
import { getList } from '@/services/list';
import { BedStatus } from "@lianmed/lmg/lib/services/WsService";

export default {
  namespace: 'list',
  state: {
    listData: [], // 所有bed数据
    dirty: new Set(), // 受保护的床位
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
          return { ..._, unitId, data: (data as Map<any, any>).get(unitId) };
        })
        .filter(_ => !!_.data)
        .map((_, index) => {
          return { ..._, index, pageIndex: Math.floor(index / pageItemsCount), status: _.data.status };
        });
      yield put({ type: 'setState', payload: { listData } });
      yield put({ type: 'computeLayout' });
    },
    *computeLayout({ }, { put, select }) {

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
      let {
        setting: { listLayout },
        list: { listData, dirty },
      } = state;

      listData = listData.filter(_ => {
        return _.status === BedStatus.Working || (dirty as Set<string>).has(_.unitId)
      })
      const pageItemsCount: number = listLayout[0] * listLayout[1];
      const pageItems = listData.slice(page * pageItemsCount, (page + 1) * pageItemsCount);
      yield put({
        type: 'setState',
        payload: { pageItems, page }
      });
    },
    *removeDirty({ unitId }, { call, put, select }) {
      console.log('removeDirty')
      const state = yield select();
      let {
        list: { dirty },
      } = state;
      dirty = new Set(dirty)
      dirty.delete(unitId)
      yield put({
        type: 'setState', payload: {
          dirty
        }
      })
      yield put({
        type: 'processListData'
      })
    },
    *appendDirty({ unitId }, { call, put, select }) {
      const state = yield select();
      let {
        list: { dirty },
      } = state;
      dirty = new Set(dirty)
      dirty.add(unitId)
      yield put({
        type: 'setState', payload: {
          dirty
        }
      })
    },

    //
    *updateBeds({ payload }, { call, put, select }) {
      let data = yield call(getList);
      const oldData = yield select(_ => _.list.listData);
      // const isDdifference = data !== oldData;
      if (data && data.length) {
        const d = oldData.map((item) => {
          const id = item.id;
          const filterArr = data.filter(e => e.id === id);
          let filterObj = {};
          if (filterArr && filterArr.length) {
            filterObj = { ...item, ...filterArr[0] };
          }
          return filterObj;
        })
        yield put({
          type: 'setState',
          payload: {
            listData: d
          }
        })
      }
    },
    // 新建档案modal页面的搜索功能，检索个人孕册信息
    *fetchPregnancy({ payload, callback }, { call, put }) {
      const res = yield call(getPregnancy, payload);
      if (callback && typeof callback === 'function') {
        callback(res); // 返回结果
      }
      if (res.length) {
        yield put({
          type: 'setState',
          payload: {
            pregnancy: res[0],
          },
        });
      }
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
  subscriptions: {
    deviceStatus({ dispatch }) {
      console.log('dispatch', dispatch)
    }
  }
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
