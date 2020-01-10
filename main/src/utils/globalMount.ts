const constant = require('../config/constant');
const FileStorage = require('./FileStorage');

export const globalMount = () => {
    Object.assign(global, { constant, FileStorage })
}