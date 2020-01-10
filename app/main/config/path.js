"use strict";
exports.__esModule = true;
var isDev = require('../utils/is').isDev;
var resolve = require('path').resolve;
var devBase = resolve('.');
var source = resolve(__dirname, '../../');
exports.source = source;
var assetsPath = resolve(__dirname, '../../asserts');
var base = isDev ? devBase : source;
var profile = resolve(process.env.USERPROFILE);
exports.profile = profile;
var desktop = resolve(process.env.USERPROFILE, 'Desktop');
exports.desktop = desktop;
var tmp = resolve('.tmp');
exports.tmp = tmp;
var resources = resolve('resources');
exports.resources = resources;
var config = resolve(profile, 'setting.json');
exports.config = config;
var defaultConfig = resolve(assetsPath, './defaultSetting.json');
exports.defaultConfig = defaultConfig;
var errLog = resolve(tmp, 'errLog.txt');
exports.errLog = errLog;
var log = resolve(tmp, 'log.txt');
exports.log = log;
var pkg = resolve(source, 'package.json');
exports.pkg = pkg;
