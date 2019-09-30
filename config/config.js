// ref: https://umijs.org/config/

// Instantiate the configuration with a new API
import { join } from 'path';
import slash from 'slash';
import pageRoutes from './routes';

export default {
  theme: {
    'primary-color': '#5c6bc0',
  },
  treeShaking: true,
  publicPath: './',
  history: 'hash', // 必须配置hash路由
  routes: pageRoutes,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: {
          loadingComponent: './components/PageLoading/index',
          webpackChunkName: true,
          level: 3,
        },
        title: '胎监工作站',
        dll: false,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
  proxy: {
    // '/api': {
    //   target: 'http://127.0.0.1:1702/',
    //   changeOrigin: true,
    //   pathRewrite: { '^/api': '' },
    // },
    '/api/v1': {
      target: 'http://192.168.0.183:9986/api/',
      changeOrigin: true,
      pathRewrite: { '^/api/v1': '' },
    },
  },
  outputPath: './app/render', // 更改输出目录
  externals(context, request, callback) {
    const isDev = process.env.NODE_ENV === 'development';
    let isExternal = false;
    const load = ['electron', 'fs', 'path', 'os', 'url', 'child_process'];
    if (load.includes(request)) {
      isExternal = `require("${request}")`;
    }
    const appDeps = Object.keys(require('../app/package').dependencies);
    if (appDeps.includes(request)) {
      const orininalPath = slash(join(__dirname, '../app/node_modules', request));
      const requireAbsolute = `require('${orininalPath}')`;
      isExternal = isDev ? requireAbsolute : `require('${request}')`;
    }
    callback(null, isExternal);
  },
};
