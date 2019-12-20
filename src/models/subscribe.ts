import store from "@/utils/SettingStore";
import { WsService } from "@lianmed/lmg";
import { IWard } from "@/types";
export default {
    namespace: 'subscribe',
    state: {
        data: (store.getSync('area_devices') && (store.getSync('area_devices') as string).split(',')) || [], // 订阅列表
    },
    effects: {
        *setData({ note, wardType, wardId }: IWard, { put }) {
            const data = [...new Set(note.split(','))]
            const str = data.join(',')
            store.setSync('area_devices', str)
            wardType && store.setSync('area_type', wardType)
            wardId && store.setSync('areano', wardId)
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
