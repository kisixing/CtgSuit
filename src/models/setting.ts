import store from 'store';
import { getBedIfo } from '@/services/api';

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
    listLayoutOptions: [
      [1, 2],
      [2, 2],
      [3, 2],
      [3, 3],
      // [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
    ],
    bedinfo: [], // 床位信息
    accounts: fakeData || [], // 所有账户信息列表
  },
  effects: {
    *setListLayout({ payload }, { put }) {
      store.set('listLayout', payload.listLayout)
      yield put({ type: 'setState', payload })
      yield put({ type: 'list/processListData' })
    },
    *fetchBed({ payload }, { call, put }) {
      const res = yield call(getBedIfo);
      yield put({
        type: 'setState',
        payload: {
          bedinfo: res || []
        }
      })
    }
  },
  reducers: {
    setState(state, { payload }) {
      return {
        ...state, ...payload
      }
    }
  },
};
