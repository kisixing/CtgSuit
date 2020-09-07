import store from 'store'
import settingStore from '@/utils/SettingStore';

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
    layoutLock: true,
    alarm_muted: settingStore.cache.alarm_muted
  },
  effects: {
    *setListLayout({ payload }, { put }) {
      store.set('listLayout', payload.listLayout)
      yield put({ type: 'setState', payload })
      yield put({ type: 'list/markListData' })
    },
    *setHeadCollapsed({ payload }, { put }) {
      store.set('headCollapsed', payload.headCollapsed)
      yield put({ type: 'setState', payload })
    },
    *setMuted({ payload }, { put }) {
      payload.pure = true
      settingStore.setSync('alarm_muted', payload.alarm_muted)
      Array(3).fill(0).forEach((_, i) => {
        const t: HTMLAudioElement = document.querySelector(`#alarm${i}`)
        try {
          t && (t.muted = payload.alarm_muted)
        } catch (e) {

        }
      })
      yield put({ type: 'setState', payload })
    },
    *computeLayout({ size }: { size: number }, { put, select }) {

      const { listLayoutOptions, layoutLock }: TSettingModel = yield select(state => state.setting);
      if (!layoutLock) return

      const listLayoutOptionsV = listLayoutOptions.map(_ => _.reduce((s, i) => s * i, 1))
      const t = listLayoutOptionsV.reduce((r, _, i) => {
        const oldDiff = (listLayoutOptionsV[r] - size) >= 0 ? listLayoutOptionsV[r] - size : Number.MAX_SAFE_INTEGER
        const diff = _ - size >= 0 ? _ - size : Number.MAX_SAFE_INTEGER
        return (diff - (oldDiff) > 0) ? r : i
      }, 0)
      yield put({ type: 'setState', payload: { listLayout: listLayoutOptions[__DEV__ ? 0 : t] } })

    }
  },
  reducers: {
    setState(state, { payload }) {
      payload.pure || Object.entries(payload).forEach(([k, v]) => {
        store.set(k, v)
      })
      return {
        ...state, ...payload
      }
    }
  },
};
export type TSettingModel = typeof setting.state
export default setting