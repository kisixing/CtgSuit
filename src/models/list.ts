
import { getList } from '@/services/list';
// import { BedStatus } from "@lianmed/lmg/lib/services/WsService";
// const downStatus = [BedStatus.Working, BedStatus.Offline];
import { IBed, ETabKey, IState } from "@/types";
import { WsService, BedStatus, ICache, ICacheItem } from '@lianmed/lmg';
import settingStore from "@/utils/SettingStore";

function checkVisible(_: IBed, dirty: Set<string>, offline: Set<string>): boolean {
  return (!offline.has(_.unitId)) && (!dirty.has(_.unitId))
};
type tabKeyMap = { [x in ETabKey]?: number }

//   headData: IBed[],
//   listData: IBed[],
//   rawData: IBed[],
//   pageData: IBed[],
//   pageItems: IBed[],
function getArr() {
  var arr: IBed[] = []
  return arr
}
const m = {
  namespace: 'list',
  state: {
    listData: getArr(), // 所有bed数据
    pageData: getArr(), // [[1,4],[5,8]]
    headData: getArr(),
    pageItems: getArr(), // [listItem,...] 床位信息

    rawData: getArr(),
    dirty: new Set<string>(), // 受保护的床位
    offline: new Set<string>(), // 初始化离线数据，隐藏
    page: 0, //当前页码
    pageCount: 0, // 页码长度
    fullScreenId: null,
    borderedId: null,
    pregnancy: {}, // 初始化，暂无使用
    showTodo: false,
    tabKey: null,
    pageCountMap: {} as tabKeyMap
  },
  effects: {
    *clean({ }, { put, call, select }) {
      yield put({ type: 'setState', payload: { listData: [], rawData: [], pageItems: [], pageData: [], headData: [] } });
      yield put({ type: 'ws/setState', payload: { data: new Map() } });
    },
    *getlist(_, { put, call, select }) {
      const state = yield select() as IState;
      let { subscribe } = state;

      let data: IBed[] = yield call(getList);

      // if (!subscribe.data.length) {
      //   yield put({ type: 'subscribe/setData', data: [...new Set(data.map(_ => _.deviceno))] })
      // }
      yield put({
        type: 'setState',
        payload: { listData: data || [], rawData: data }
      });
      yield put({ type: 'processListData' });
    },

    *processListData(_, { put, select }) {
      const state: IState = yield select();
      let { list, ws: { data: datacache }, subscribe } = state;
      let { rawData: listData, dirty, offline, tabKey } = list
      const subscribeData: string[] = subscribe.data
      listData = listData
        .filter(_ => subscribeData.includes(_.deviceno))

        .map(_ => {
          const data: ICacheItem = (datacache as Map<any, any>).get(_.unitId)
          return { ..._, data, status: data && data.status, tabKey: ETabKey.GENERAL };
        })
        .filter(_ => !!_.data)
        .map(_ => ({ ..._, tabKey: _.data.isF0Pro ? ETabKey.F0_PRO : _.tabKey, }))
        .sort((a, b) => (a.data.isF0Pro && b.data.isF0Pro) ? (a.bedname.localeCompare(b.bedname)) : (+a.data.isF0Pro - +b.data.isF0Pro))
      yield put({ type: 'setState', payload: { headData: listData.filter(_ => [BedStatus.Working, BedStatus.Stopped, BedStatus.Uncreated].includes(_.status)) } });
      listData = listData.filter(_ => checkVisible(_, dirty, offline))
      const _tabKey = listData.length ? (tabKey ? tabKey : (listData.some(_ => _.data && _.data.isF0Pro) ? ETabKey.F0_PRO : ETabKey.GENERAL)) : null
      yield put({ type: 'setState', payload: { listData, tabKey: _tabKey } });
      yield put({ type: 'setting/computeLayout', size: listData.length })

      yield put({ type: 'markListData' });
    },
    /**
     * dep on setting listLayout
     */
    *markListData({ }, { put, select }) {
      const state: IState = yield select();
      let { list, setting: { listLayout }, } = state;
      let { listData, page, tabKey } = list
      const pageItemsCount: number = listLayout[0] * listLayout[1];



      let idxMap = listData
        .reduce<tabKeyMap>((pre, cur) => {
          const k = cur.tabKey
          pre[k] = pre[k] || 0
          cur.pageIndex = Math.floor(pre[k] / pageItemsCount)
          pre[k]++
          return pre
        }, {})

      let pageCountMap = Object.entries(idxMap).reduce<tabKeyMap>((pre, [k, v]) => {
        pre[k] = Math.ceil(v / pageItemsCount);
        return pre
      }, {})
      Object.entries(idxMap).forEach(([a, b]) => {
        listData.forEach(_ => {
          if (_.tabKey === a as unknown) {
            _.pageCount = Math.ceil(b / pageItemsCount);
          }
        })
      })
      yield put({ type: 'setState', payload: { pageCountMap } });

      yield put({ type: 'setPageData' });
      yield put({ type: 'setPage', page, tabKey });
    },



    *setPageData(payload, { put, select }) {
      const state: IState = yield select();
      let {
        setting: { listLayout },
        list: { listData, pageCountMap },
      } = state;
      const data = []
      Object.entries(pageCountMap).forEach(([tabKey, v]) => {
        new Array(v).fill(0).forEach((_, index) => {
          data.push({ index, tabKey, title: tabKey === ETabKey.F0_PRO ? `f0pro第${index + 1}组` : `第${index + 1}组` })
        });
      })

      // listData = listData.filter(_ => _.pageIndex !== null)
      // const listLen = listData.length;
      // const pageItemsCount: number = listLayout[0] * listLayout[1];
      // const pageCount: number = Math.ceil(listLen / pageItemsCount);
      // let pageData: any = new Array(pageCount).fill(0).map((_, index) => {
      //   if (index === pageCount - 1) {
      //     const lastLeft = index * pageItemsCount;
      //     return [lastLeft, listLen - 1];
      //   }
      //   return [index * pageItemsCount, (index + 1) * pageItemsCount - 1];
      // });

      // pageData = pageData.map(([left, right]) => {
      //   return listData.slice(left, right + 1).map(_ => _.bedname)
      // })

      yield put({ type: 'setState', payload: { pageData: data } });
    },

    *setPageByUnitId({ unitId }, { put, select }) {
      const list: TListModel = yield select(state => state.list);

      let { listData, borderedId, page } = list

      const target = listData.find(_ => _.unitId === unitId)
      const newPage = target.pageIndex
      const tabKey = target.tabKey

      if (borderedId === unitId && newPage === page) return

      // yield put({ type: 'removeDirty', unitId })
      yield put({ type: 'setState', payload: { showTodo: false, borderedId: unitId } })
      yield put({
        type: 'setPage',
        page: newPage,
        tabKey,
      });
    },
    *setPage({ page, tabKey }, { put, select }) {
      console.log('setPage', page, tabKey)
      const list: TListModel = yield select(state => state.list);
      let { pageCountMap } = list
      const pageCount = pageCountMap[tabKey]
      page = page > pageCount - 1 ? pageCount - 1 : (page < 0 ? 0 : page)
      yield put({
        type: 'setState',
        payload: { page, tabKey }
      });
      yield put({
        type: 'setPageItems'
      });
    },

    *setPageItems({ }, { put, select }) {
      const state: IState = yield select();
      let {
        setting: { listLayout },
        list,
      } = state;
      let { listData, dirty, page, tabKey } = list
      listData = listData.filter(_ => _.tabKey === tabKey)
      const pageItemsCount: number = listLayout[0] * listLayout[1];
      const pageItems = listData.slice(page * pageItemsCount, (page + 1) * pageItemsCount);
      const ids = new Set(pageItems.map(_ => _.deviceno));
      (settingStore.cache.inspectable) && WsService._this.subscribe && WsService._this.subscribe([...ids])

      yield put({
        type: 'setState',
        payload: { pageItems }
      });
    },

    *removeDirty({ unitId }, { call, put, select }) {
      const state: IState = yield select();
      let {
        list: { dirty },
      } = state;
      dirty = new Set(dirty)
      if (!dirty.has(unitId)) return
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
      yield put({
        type: 'processListData'
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
}

export default m

export type TListModel = typeof m.state

// interface IState {
//   list: TListModel
// }
// interface TListModel {
//   offline: Set<string>,
//   headData: IBed[],
//   listData: IBed[],
//   rawData: IBed[],
//   pageData: IBed[],
//   pageItems: IBed[],
//   dirty: Set<string>,
//   pageCount: number,
//   page: number,
//   fullScreenId: string,
//   pregnancy: object,
// }

