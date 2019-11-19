import store from "@/utils/SettingStore";

export default {
    namespace: 'subscribe',
    state: {
        data: (store.getSync('area_devices') && (store.getSync('area_devices') as string).split(',')) || [], // 订阅列表
    },
    effects: {
        *setData({ payload }, { put }) {
            store.set('area_devices', payload.data)
            yield put({ type: 'setState', payload })
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
