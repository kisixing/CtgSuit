import {store} from './Storage'

const { NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';
const WS_KEY = 'ws_url'
const XHR_KEY = 'xhr_url'
// const localUrl = window.location.protocol + '//' + window.location.host + '/';
const _wsUrl = store.getSync(WS_KEY)
const wsUrl = _wsUrl || (isDev ? '192.168.2.227:8084' : '192.168.2.227:8084');
if(!_wsUrl){
  store.setSnc(WS_KEY,wsUrl)
}


const _xhrUrl = store.getSync(XHR_KEY)
const xhrUrl = _xhrUrl || (isDev ? '192.168.2.152:9986' : '192.168.2.152:9986');
if(!_xhrUrl){
  store.setSnc(XHR_KEY,xhrUrl)
}

export default  {
  siteName: '胎监工作站',
  copyright: '2019 莲印医疗科技',
  logoPath: require('../assets/logo.png'),
  avatar: '',
  apiPrefix:`http://${xhrUrl}/api`,
  wsUrl,
  fixedHeader: true, // sticky primary layout header
};
