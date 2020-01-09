import store from 'store'
import { ipcRenderer } from 'electron';
import { message } from 'antd';



import settingStore from "@/utils/SettingStore";
import { WsService } from "@lianmed/lmg";
import { router } from 'umi';


const EWsStatus = WsService.wsStatus
const settingData = settingStore.cache
const { EWsEvents } = WsService



const main = {
    namespace: 'main',
    state: {
    },
    effects: {
        *init({ payload }, { put }) {
            ipcRenderer.send('ready')
            ipcRenderer.on('installed', () => {
                message.success('更新成功', 2).then(() => {
                    // eslint-disable-next-line no-restricted-globals
                    location.reload()
                }, null)
            })
            yield put({ type: 'subscribe/update' })
            const ws = new WsService(settingData)
                .on('explode', function* (data) {
                    yield put({
                        type: 'ws/updateData', payload: { data }
                    })
                })
                .on(EWsEvents.updateSubscriptionIfNecessary, function* (wardIds: string[]) {
                    const ward = store.get('ward')
                    const wardId = ward && ward.wardId
                    yield wardIds.includes(wardId) && put({ type: 'subscribe/update' })
                })
            try {
                ws.connect().catch(err => {
                    router.push('/setting')
                })
            } catch (e) {
                router.push('/setting')
            }

            yield put({
                type: 'global/fetchAccount',
            });
            yield put({
                type: 'list/getlist',
            });
            yield put({
                type: 'ws/connectWs',
            });
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

export default main