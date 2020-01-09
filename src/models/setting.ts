import SettingStore from '@/utils/SettingStore';
import store from 'store'

const setting = {
  namespace: 'setting',
  state: {
    listLayout: store.get('listLayout') || [2, 2],
    headCollapsed: store.get('headCollapsed') || false,
    // area_type: SettingStore.cache.area_type,
    // areano: SettingStore.cache.areano,
    listLayoutOptions: [
      [2, 1],
      [2, 2],
      [3, 2],
      [3, 3],
      // [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
    ],
    accounts: [], // 所有账户信息列表
    fashionable: false,
    // layoutLock: store.get('headCollapsed') || true,
    layoutLock: true
  },
  effects: {
    *setListLayout({ payload }, { put }) {
      store.set('listLayout', payload.listLayout)
      yield put({ type: 'setState', payload })
      yield put({ type: 'list/processListData' })
    },
    *setHeadCollapsed({ payload }, { put }) {
      store.set('headCollapsed', payload.headCollapsed)
      yield put({ type: 'setState', payload })
    },
    *computeLayout({ size }: { size: number }, { put, select }) {

      const { listLayoutOptions, layoutLock }: typeof setting.state = yield select(state => state.setting);
      if (!layoutLock) return

      const listLayoutOptionsV = listLayoutOptions.map(_ => _.reduce((s, i) => s * i, 1))
      const t = listLayoutOptionsV.reduce((r, _, i) => {
        const oldDiff = (listLayoutOptionsV[r] - size) > 0 ? listLayoutOptionsV[r] - size : Number.MAX_SAFE_INTEGER
        const diff = _ - size > 0 ? _ - size : Number.MAX_SAFE_INTEGER
        return (diff - (oldDiff) > 0) ? r : i
      }, 0)
      yield put({ type: 'setState', payload: { listLayout: listLayoutOptions[t] } })

    }
  },
  reducers: {
    setState(state, { payload }) {
      Object.entries(payload).forEach(([k, v]) => {
        store.set(k, v)
      })
      return {
        ...state, ...payload
      }
    }
  },
};

export default setting