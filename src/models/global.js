
export default {
  namespace: 'global',
  state: {
    layout: [1, 2], // 一行一列 一行两列
    onWorks: [
      {
        id: '788787_edeed',
        name: '设备001',
        status: '',
      },
      {
        id: '788787_edeea',
        name: '设备001',
        status: '',
      },
      {
        id: '788787_edeeb',
        name: '设备001',
        status: '',
      },
      {
        id: '788787_edeec',
        name: '设备001',
        status: '',
      },
      {
        id: '788787_edeee',
        name: '设备001',
        status: '',
      },
    ], // 在状态的子机数量
  },
  effects: {
    *changeLayout({ payload }, { put, call }) {
      yield put({
        type: 'updateState',
        payload: {},
      });
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
