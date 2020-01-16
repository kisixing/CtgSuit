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
            ipcRenderer.on('installed', () => {
                message.success('更新成功', 2).then(() => {
                    // eslint-disable-next-line no-restricted-globals
                    location.reload()
                }, null)
            })
            yield put({ type: 'subscribe/update' })

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