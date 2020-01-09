import settingStore from "@/utils/SettingStore";
import { WsService } from "@lianmed/lmg";
import { IWard } from "@/types";
import { request } from "@lianmed/utils";
import store from 'store'
export default {
    namespace: 'subscribe',
    state: {
        data: (settingStore.getSync('area_devices') && (settingStore.getSync('area_devices') as string).split(',')) || [], // 订阅列表
        ward: store.get('ward') as IWard || {}
    },
    effects: {
        *setData({ note = '' }: IWard, { put }) {
            const data = [...new Set(note.split(','))]
            const str = data.join(',')
            settingStore.setSync('area_devices', str)
            // wardType && settingStore.setSync('area_type', wardType)
            // wardId && settingStore.setSync('areano', wardId)
            yield put({ type: 'setState', payload: { data } })
            yield put({ type: 'list/processListData' })

            WsService._this.send(JSON.stringify(
                {
                    name: "area_devices",
                    data: str
                }
            ))
        },
        *update(payload, { put }) {
            const ward = store.get('ward') || { id: '' }
            const data: IWard = yield request.get(`/wards/${ward.id}`)
            const { note, wardType, wardId } = data
            yield put({ type: 'setData', note })
        }

    },
    reducers: {
        setState(state, { payload }) {
            return {
                ...state, ...payload
            }
        },
        setPersistentState(state, { payload }) {
            if (!payload) return state
            Object.entries(payload).forEach(([k, v]) => {
                store.get(k, v)
            });
            return {
                ...state, ...payload
            }
        }
    },
};
