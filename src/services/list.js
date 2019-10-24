import request from '@/utils/request';

export async function getList(param) {
    return request.get(`/bedinfos`, { cacheWhenFailed: true });
}
