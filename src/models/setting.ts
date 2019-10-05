import store from 'store'
export default {
  namespace: 'setting',
  state: {
    listLayout:store.get('listLayout')|| [2, 2],
    listLayoutOptions: [
      [1, 2],
      [2, 2],
      [2, 3],
      [2, 4],
      [3, 4],
      [4, 4],
    ]
  },
  effects: {
    *setListLayout({payload}, { put }) {
      store.set('listLayout',payload.listLayout)
      yield put({type:'setState',payload})
      yield put({type:'list/computeLayout'})
    },
  },
  reducers: {
    setState(state, { payload }) {
      return {
        ...state, ...payload
      }
    }
  },
};
