import request from '@/utils/request';

/**
 * 验证账户登录
 * @returns {Promise<void>}
 */
export async function login(params) {
  return request('/api/user/account', {
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
  return request('/api/v1/authenticate', {
    method: 'POST',
    data: params
  });
}

/**
 * 获取账户信息
 */
export async function getAccount() {
  return request('/api/account');
}

/**
 *
 * 孕妇建档、绑定床号
 * @export
 * @param {*} params
 * @returns
 */
export async function newPregnancies(params) {
  return request('/api/v1/pregnancies', {
    method: 'POST',
    data: params,
  });
}