const constant = require('../config/constant');
const FileStorage = require('./FileStorage');

export default () => {
    Object.assign(global, { constant, FileStorage })
}