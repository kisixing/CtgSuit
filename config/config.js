// ref: https://umijs.org/config/

// Instantiate the configuration with a new API
import { join } from 'path';
import slash from 'slash';
import path from 'path';
import pageRoutes from './routes';
const isRuntime = process.env.TARGET === '0'
export default {
  theme: {
    'primary-color': '#004c8c',
  },
  treeShaking: true,
  publicPath: './',
  hash: true, // 是否开启 hash 文件后缀
  history: 'hash', // 必须配置hash路由
  routes: pageRoutes,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        locale: {
          enable: true, // default false
          default: 'zh-CN', // default zh-CN
          baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
        },
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
  // copy: [
  //   {
  //     // build时才会copy
  //     from: path.join(__dirname, '../docs/_book/'),
  //     to: path.join(__dirname, '../public/handbook/'),
  //   },
  // ],
  proxy: {
    // '/api': {
    //   target: 'http://127.0.0.1:1702/',
    //   changeOrigin: true,
    //   pathRewrite: { '^/api': '' },
    // },
    // '/api/v1': {
    //   target: 'http://192.168.2.152:9986/api/',
    //   changeOrigin: true,
    //   pathRewrite: { '^/api/v1': '' },
    // },
  },
  outputPath: './app/render', // 更改输出目录
  define: {
    TARGET: process.env.TARGET
  },

  alias: {
    electron: isRuntime ? '@/utils/electron' : 'electron',
    fs: isRuntime ? '@/utils/fs' : 'fs'
  },
  externals(context, request, callback) {
    if (isRuntime) {
      return callback()
    }
    // const getNodeExternal = target => `commonjs${target}`
    const getNodeExternal = target => `require("${target}")`
    const isDev = process.env.NODE_ENV === 'development';
    let isExternal = false;
    const load = ['electron', 'fs', 'path', 'os', 'url', 'child_process'];
    if (load.includes(request)) {
      isExternal = getNodeExternal(request);
    }
    const appDeps = Object.keys(require('../app/package').dependencies);
    if (appDeps.includes(request)) {
      const orininalPath = slash(join(__dirname, '../app/node_modules', request));
      const requireAbsolute = isDev ? orininalPath : request;
      isExternal = getNodeExternal(requireAbsolute)
    }
    isExternal && console.log(request, isExternal)
    callback(null, isExternal);
  },
};
