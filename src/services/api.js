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
