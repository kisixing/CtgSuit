import request from '@/utils/request.js';
import { apiPrefix } from '@/utils/config';

export async function getList(param){
    return request(`${apiPrefix}/bedinfos`);
}