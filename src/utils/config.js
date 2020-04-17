import store from './SettingStore'
const WS_KEY = 'ws_url'
const XHR_KEY = 'xhr_url'
const wsUrl = store.getSync(WS_KEY)
const xhrUrl = store.getSync(XHR_KEY)

export default {
  siteName: 'ObVue',
  copyright: 'Copyright © 莲印医疗', // 莲印医疗lian-med
  logoPath: require('../assets/logo.png'),
  avatar: '',
  apiPrefix: `http://${xhrUrl}/api`,
  wsUrl,
  fixedHeader: true, // sticky primary layout header
};
