import { message } from 'antd';
import { newPregnancies, getPregnancy, getBedIfo } from '@/services/api';
import { getList } from '@/services/list';
import { BedStatus } from "@lianmed/lmg/lib/services/WsService";
// import store from "@/utils/SettingStore";
// const downStatus = [BedStatus.Working, BedStatus.Offline];

function checkVisible(_: IDevice, dirty: Set<string>, offline: Set<string>): boolean {
  return (!offline.has(_.unitId)) && (!dirty.has(_.unitId))
};

export default {
  namespace: 'list',
  state: {
    rawData: [],
    listData: [], // 所有bed数据
    dirty: new Set(), // 受保护的床位
    offline: new Set(), // 初始化离线数据，隐藏
    pageData: [], // [[1,4],[5,8]]
    page: 0, //当前页码
    pageCount: 0, // 页码长度
    pageItems: [], // [listItem,...] 床位信息
    fullScreenId: null,
    pregnancy: {}, // 初始化，暂无使用
    showTodo: false,
    headData: []
  },
  effects: {
    *getlist(_, { put, call, select }) {
      const state = yield select();
      let { subscribe } = state;

      let data: IDevice[] = yield call(getList);

      if (!subscribe.data.length) {
        yield put({ type: 'subscribe/setData', data: [...new Set(data.map(_ => _.deviceno))] })
      }
      yield put({
        type: 'setState',
        payload: { listData: data || [], rawData: data }
      });
      yield put({ type: 'processListData' });
    },

    *processListData(_, { put, select }) {
      const state = yield select();
      let { list, ws: { data: datacache }, subscribe } = state;
      let { rawData: listData } = list as IListState
      const subscribeData: string[] = subscribe.data
      listData = listData
        .filter(_ => subscribeData.includes(_.deviceno))
        .map(_ => {
          const data = (datacache as Map<any, any>).get(_.unitId)
          return { ..._, data, status: data && data.status };
        })
        .filter(_ => !!_.data)


      yield put({ type: 'setState', payload: { headData: listData } });
      yield put({ type: 'setListData', listData });
    },
    *setListData({ listData }, { put, select }) {
      const state = yield select();
      let { list, setting: { listLayout }, } = state;
      let { dirty, offline } = list as IListState
      const pageItemsCount: number = listLayout[0] * listLayout[1];


      listData = (listData as IDevice[]).filter(_ => checkVisible(_, dirty, offline))
      listData.reduce((pre, cur) => {
        cur.pageIndex = Math.floor(pre / pageItemsCount)
        return pre + 1
      }, 0)
      yield put({ type: 'setState', payload: { listData } });
      yield put({ type: 'computeLayout' });
    },

    *computeLayout(_, { put, select }) {
      const state = yield select();
      let {
        list: { page },
      } = state;
      yield put({ type: 'setPageData' });
      yield put({ type: 'setPage', page });
    },

    *setPageData(payload, { put, select }) {
      const state = yield select();
      let {
        setting: { listLayout },
        list: { listData },
      } = state;
      listData = listData.filter(_ => _.pageIndex !== null)
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

      yield put({ type: 'setState', payload: { pageData, pageCount } });
    },

    *setPageByUnitId({ unitId }, { put, select }) {
      const list: IListState = yield select(state => state.list);

      let { listData } = list
      const page = listData.find(_ => _.unitId === unitId).pageIndex
      yield put({
        type: 'setPage',
        page
      });
    },
    *setPage({ page }, { put, select }) {

      const state = yield select();
      let {
        list,
      } = state;
      let { pageCount } = list as IListState
      page = page > pageCount ? pageCount - 1 : page
      yield put({
        type: 'setState',
        payload: { page }
      });
      yield put({
        type: 'setPageItems'
      });
    },

    *setPageItems({ }, { put, select }) {
      const state = yield select();
      let {
        setting: { listLayout },
        list,
      } = state;
      let { listData, dirty, page, offline } = list as IListState
      const pageItemsCount: number = listLayout[0] * listLayout[1];
      const pageItems = listData.slice(page * pageItemsCount, (page + 1) * pageItemsCount);
      yield put({
        type: 'setState',
        payload: { pageItems }
      });
    },

    *removeDirty({ unitId }, { call, put, select }) {
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

    *appendOffline({ unitId }, { call, put, select }) {
      const state: IState = yield select();
      let {
        list: { offline },
      } = state;
      offline = new Set(offline)
      offline.add(unitId)
      yield put({
        type: 'setState', payload: {
          offline
        }
      })
      yield put({
        type: 'processListData'
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

    // // 主要获取prenatalVisit信息
    // *fetchBed({ payload, callback }, { call, put }) {
    //   const res = yield call(getBedIfo, payload);
    //   if (callback && typeof callback === 'function') {
    //     callback(res); // 返回结果
    //   }
    // },
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
      // console.log('dispatch', dispatch)
    }
  }
} as { state: IListState };


interface IState {
  list: IListState
}
interface IListState {
  offline: Set<string>,
  headData: IDevice[],
  listData: IDevice[],
  rawData: IDevice[],
  dirty: Set<string>,
  pageData: any[],
  pageCount: number,
  page: number,
  pageItems: IDevice[],
  fullScreenId: string,
  pregnancy: object,
}

export interface IDevice {
  bedname: string;
  bedno: string;
  deviceno: string;
  documentno: string;
  id: number;
  unitId: string;
  pageIndex: number;
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
  status: number;
  subdevice: string;
  type: string;
  updateTime: string;
}
