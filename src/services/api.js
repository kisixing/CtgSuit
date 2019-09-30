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

export async function authenticate(params) {
  return request('api/authenticate', {
    method: 'POST',
    data: params
  });
}

export async function getAccount() {
  return request('/api/account');
}
