import request from '@/utils/request';
import store from "@/utils/SettingStore";
export async function getList(param) {
    return request.get(`/bedinfos?${store.getSync('areano') ? 'areano.equals=' + store.getSync('areano') : ''}`, { cacheWhenFailed: true })
        .then(res => (res || []).map(_ => ({ ..._, unitId: `${_.deviceno}-${_.subdevice}` })))
}
