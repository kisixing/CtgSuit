const constant = require('../config/constant');
const FileStorage = require('./FileStorage');

module.exports = () => {
    Object.assign(global, { constant, FileStorage })
}