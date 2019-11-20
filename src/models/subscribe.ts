import store from "@/utils/SettingStore";
import { WsService } from "@lianmed/lmg";

export default {
    namespace: 'subscribe',
    state: {
        data: (store.getSync('area_devices') && (store.getSync('area_devices') as string).split(',')) || [], // 订阅列表
    },
    effects: {
        *setData({ data }: { data: string[] }, { put }) {
            const str = data.join(',')
            store.set('area_devices', str)
            yield put({ type: 'setState', payload: { data } })
            yield put({ type: 'list/processListData' })
            WsService._this.send(JSON.stringify(
                {
                    name: "area_devices",
                    data: str
                }
            ))

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
