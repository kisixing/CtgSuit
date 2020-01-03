import settingStore from "@/utils/SettingStore";
import { WsService } from "@lianmed/lmg";
import { IWard } from "@/types";
import { request } from "@lianmed/utils";

export default {
    namespace: 'subscribe',
    state: {
        data: (settingStore.getSync('area_devices') && (settingStore.getSync('area_devices') as string).split(',')) || [], // 订阅列表
    },
    effects: {
        *setData({ note, wardType, wardId }: IWard, { put }) {
            const data = [...new Set(note.split(','))]
            const str = data.join(',')
            settingStore.setSync('area_devices', str)
            wardType && settingStore.setSync('area_type', wardType)
            wardId && settingStore.setSync('areano', wardId)
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
            const ward = settingStore.cache.ward || { id: '' }
            const data: IWard = yield request.get(`/wards/${ward.id}`)
            const { note, wardType, wardId } = data
            yield note && wardType && wardId && put({ type: 'setData', note, wardType, wardId })
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
