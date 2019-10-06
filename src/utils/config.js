const store = require('store');
const { NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';
// 本机地址
// const localUrl = window.location.protocol + '//' + window.location.host + '/';
const wsUrl = store.get('ws_url') || (isDev ? '192.168.2.227:8084' : '192.168.2.227:8084');
const apiPrefix = store.get('rest_url') || (isDev ? '/api/v1' : 'http://192.168.2.152:9986/api');
store.set('ws_url',wsUrl)
store.set('rest_url',apiPrefix)

module.exports = {
  siteName: '胎监工作站',
  copyright: '2019 莲印医疗科技',
  logoPath: require('../assets/logo.png'),
  avatar: '',
  apiPrefix,
  wsUrl,
  fixedHeader: true, // sticky primary layout header
};
