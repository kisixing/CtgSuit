import SettingStore from '@/utils/SettingStore';
import store from 'store'
const fakeData = [{
  key: '1',
  name: 'John Brown',
  password: '123456',
  status: '0',
},
{
  key: '2',
  name: 'Jim Green',
  password: '123456',
  status: '1',
},
{
  key: '3',
  name: 'Joe Black',
  password: '123456',
  status: '2',
},]

export default {
  namespace: 'setting',
  state: {
    listLayout: store.get('listLayout') || [2, 2],
    headCollapsed: store.get('headCollapsed') || false,
    area_type: SettingStore.getSync('area_type'),
    areano: SettingStore.getSync('areano'),
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
    accounts: fakeData || [], // 所有账户信息列表
    fashionable: false
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

  },
  reducers: {
    setState(state, { payload }) {
      SettingStore.setSync(Object.keys(payload), Object.values(payload))
      return {
        ...state, ...payload
      }
    }
  },
};
