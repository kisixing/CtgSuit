import { message } from 'antd';
import { newPregnancies, getPregnancy, getBedIfo } from '@/services/api';
import { getList } from '@/services/list';
import { BedStatus } from "@lianmed/lmg/lib/services/WsService";
const downStatus = [BedStatus.Working, BedStatus.Offline];

function checkVisible(_: IDevice, dirty: Set<string>): boolean {
  return downStatus.includes(_.status) || dirty.has(_.unitId)
};

export default {
  namespace: 'list',
  state: {
    listData: [], // 所有bed数据
    dirty: new Set(), // 受保护的床位
    pageData: [], // [[1,4],[5,8]]
    page: 0, //当前页码
    pageCount: 0, // 页码长度
    pageItems: [], // [listItem,...] 床位信息
    fullScreenId: null,
    pregnancy: {}, // 初始化，暂无使用
    showTodo: false
  },
  effects: {
    *getlist(_, { put, call, select }) {
      // get bed information
      let rawData: IDevice[] = yield call(getList);
      yield put({
        type: 'setState',
        payload: { listData: rawData || [],rawData }
      });
      yield put({ type: 'processListData' });
    },

    *processListData(payload, { put, select }) {
      const state = yield select();
      let {
        setting: { listLayout },
        list,
        ws: { data: datacache }
      } = state;
      let { rawData:listData, dirty } = list as any
      const pageItemsCount: number = listLayout[0] * listLayout[1];
      console.log('update',datacache,listData)
      listData = listData
        .map(_ => {
          const unitId = `${_.deviceno}-${_.subdevice}`;
          const data = (datacache as Map<any, any>).get(unitId)
          return { ..._, unitId, data, status: data && data.status };
        })
        .filter(_ => !!_.data)
      // .map((_, index) => {
      //   return { ..._, index, pageIndex: Math.floor(index / pageItemsCount) };
      // });
      listData.reduce((pre, cur) => {
        if (checkVisible(cur, dirty)) {
          cur.pageIndex = Math.floor(pre / pageItemsCount)
          return pre + 1
        }
        cur.pageIndex = null
        return pre
      }, 0)
      yield put({ type: 'setState', payload: { listData } });
      yield put({ type: 'computeLayout' });
    },
    *computeLayout({ }, { put, select }) {
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
        type: 'setPageItems',
      });
    },
    *setPageItems(payload, { put, select }) {
      const state = yield select();
      let {
        setting: { listLayout },
        list,
      } = state;
      let { listData, dirty, page } = list as IListState
      listData = listData.filter(_ => {
        return checkVisible(_, dirty)
      })
      const pageItemsCount: number = listLayout[0] * listLayout[1];
      const pageItems = listData.slice(page * pageItemsCount, (page + 1) * pageItemsCount);
      yield put({
        type: 'setState',
        payload: { pageItems }
      });
    },

    *removeDirty({ unitId }, { call, put, select }) {
      // console.log('removeDirty')
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
    // 主要获取prenatalVisit信息
    *fetchBed({ payload, callback }, { call, put }) {
      const res = yield call(getBedIfo, payload);
      if (callback && typeof callback === 'function') {
        callback(res); // 返回结果
      }
    },
  },
  reducers: {
    setState(state, { payload }) {
  console.log('list setState')

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

interface IListState {
  listData: IDevice[],
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
