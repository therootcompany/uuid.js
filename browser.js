'use strict';

var UUID = {};

UUID._rndSync = function (arr) {
  var len = arr.byteLength || arr.length;
  var i;
  for (i = 0; i < len; i += 1) {
    // Note: Math.random is backed by secure
    // crypto in all modern browsers
    arr[i] = Math.round(Math.random() * 255);
  }
  return arr;
};
UUID._toUUID = function (rnd) {
  var hex = [].slice
    .apply(rnd)
    .map(function (ch) {
      return ch.toString(16);
     })
    .join("")
    .split("");
  
  // TODO use splice to add at the correct location
  // (and don't throw away those 2.5 bytes)
  hex[8] = "-";
  hex[13] = "-";
  hex[14] = "4"; // half a byte
  hex[18] = "-";
  hex[19] = (8 + (parseInt(hex[19], 16) % 4)).toString(16); // 1/4 of a byte?
  hex[23] = "-";
  return hex.join("");
}

UUID.v4 = function () {
  var rnd = new Uint8Array(18); // could be 16
  crypto.getRandomValues(rnd);
  return UUID._toUUID(rnd);
}
UUID._v4MathRandom = function () {
  var rnd = new Uint8Array(18); // could be 16
  UUID._rndSync(rnd);
  return UUID._toUUID(rnd);
};

if ('undefined' != typeof module) {
  module.exports = UUID;
}
