"use strict";
exports.__esModule = true;
var constant = require('../config/constant');
var FileStorage = require('./FileStorage');
exports.globalMount = function () {
    Object.assign(global, { constant: constant, FileStorage: FileStorage });
};
