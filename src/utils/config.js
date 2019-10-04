const { NODE_ENV } = process.env;
// 本机地址
// const localUrl = window.location.protocol + '//' + window.location.host + '/';

module.exports = {
  siteName: '胎监工作站',
  copyright: '2019 莲印医疗科技',
  logoPath: require('../assets/logo.png'),
  avatar: '',
  apiPrefix: NODE_ENV === 'development' ? '/api/v1' : 'http://192.168.0.208:9986/api',
  fixedHeader: true, // sticky primary layout header
};
