"use strict";
exports.__esModule = true;
var printerFatory_1 = require("../utils/printerFatory");
var printPdf = printerFatory_1.printerFatory('.tmp/');
exports["default"] = ['printWindow', function (event, file) {
        printPdf(file);
    }];
