import request from '@/utils/request';
import { apiPrefix } from '@/utils/config';

/**
 * 验证账户登录
 * @returns {Promise<void>}
 */
export async function login(params) {
  return request(`${apiPrefix}/account`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 账户验证登录
 * @param {object} params {username, password}
 */
export async function authenticate(params) {
  return request(`${apiPrefix}/authenticate`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取账户信息
 */
export async function getAccount() {
  return request(`${apiPrefix}/account`);
}

/**
 *
 * 孕妇建档、绑定床号
 * @export
 * @param {*} params
 * @returns
 */
export async function newPregnancies(params) {
  return request(`${apiPrefix}/pregnancies`, {
    method: 'POST',
    data: params,
  });
}

export async function getCTGrecords() {
  return request(`${apiPrefix}/prenatal-visits?CTGExamId.specified=true`);
}

export async function newCTGrecord(params) {
  return request(`${apiPrefix}/prenatal-visits`, {
    method: 'POST',
    data: params,
  });
}

export async function updateCTGrecord(params) {
  return request(`${apiPrefix}/prenatal-visits`, {
    method: 'PUT',
    data: params,
  });
}
