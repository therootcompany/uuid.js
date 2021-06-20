"use strict";

var uuid = require("./uuid.js");
// var uuid = require('node-uuid');
var now = Date.now();
var t = 0;
var msec;

for (t; t < 100000; t++) {
  uuid.v4();
}

msec = Date.now() - now;
console.info(Math.floor((1000 / msec) * 100000) + " uuid/s");
console.info("100000 in " + (Date.now() - now) + "ms");
console.info(uuid.v4());
