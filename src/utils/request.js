/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import router from 'umi/router';
import store from 'store';
import { TOKEN } from '@/utils/constant';
import r from '@lianmed/request';
import config from "@/utils/config";
console.log('zz config')
const request = r.config({
  prefix:config.apiPrefix,
  errHandler({ status, errortext, url }) {
    if (status === 401) {
      // @HACK
      /* eslint-disable no-underscore-dangle */
      window.g_app._store.dispatch({
        type: 'login/logout',
      });
      return;
    }
    // environment should not be used
    if (status === 403) {
      router.push('/exception/403');
      return;
    }
    if (status <= 504 && status >= 500) {
      router.push('/exception/500');
      return;
    }
    if (status >= 404 && status < 422) {
      router.push('/exception/404');
    }
  },
});

/**
 * 配置request请求时的默认参数
 */

// request拦截器, 改变url 或 options.
request._request.interceptors.request.use((url, options) => {
  options.headers = {
    ...options.headers,
    Authorization: store.get(TOKEN),
  };
  return { url, options };
});

// response拦截器, 处理response
request._request.interceptors.response.use(
  (response, options) => {
    let token = response.headers.get('authorization');
    if (token) {
      store.set(TOKEN, token);
    }
    return response;
  },
  error => {
    console.log('response error', error);
    return Promise.reject(error);
  },
);

export default request;
