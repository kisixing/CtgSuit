import store from './SettingStore'
const WS_KEY = 'ws_url'
const XHR_KEY = 'xhr_url'
const wsUrl = store.getSync(WS_KEY)
const xhrUrl = store.getSync(XHR_KEY)

export default {
  siteName: '胎监工作站',
  copyright: '2019 ', // 莲印医疗科技
  logoPath: require('../assets/logo.png'),
  avatar: '',
  apiPrefix: `http://${xhrUrl}/api`,
  wsUrl,
  fixedHeader: true, // sticky primary layout header
};
