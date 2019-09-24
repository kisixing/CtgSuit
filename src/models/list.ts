// import { getList } from '@/services/list.js';
export default {
  namespace: 'list',
  state: {
    listData: [], //所有数据
    pageData: [], //[[1,4],[5,8]]
    page: 0, //当前页码
    pageItems: [], //[listItem,...]
  },
  effects: {
    *getlist(_, { put, call }) {
      //   const res = yield call(getList, { name: 'zsd', age: '14' });
      //   console.log('res', res);

      const listData = Array(40)
        .fill('')
        .map((_, index) => {
          let id = Math.random()
            .toString(16)
            .slice(2);
          let name = [0, 1, 2]
            .map(_ => {
              return String.fromCodePoint(parseInt(id.slice(_ * 4, (_ + 1) * 4), 16));
            })
            .join('');
          return { name, id, index, age: index };
        });
      yield put({ type: 'dataHandler', listData });
    },
    *dataHandler({ listData }, { put, call, select }) {
      const state = yield select();
      const {
        setting: { listLayout },
        list: { page },
      } = state;
      const listLen = listData.length;

      const pageItemsCount: number = listLayout[0] * listLayout[1];
      const pageItems = listData.slice(page * pageItemsCount, (page + 1) * pageItemsCount);
      const pageCount: number = Math.round(listLen / pageItemsCount);
      const pageData = new Array(pageCount).fill(0).map((_, index) => {
        if (index === pageCount) {
          return [1 + index * pageCount, listLen];
        }
        return [1 + index * pageCount, (index + 1) * pageCount];
      });
      yield put({ type: 'setState', payload: { pageData, pageItems } });
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
