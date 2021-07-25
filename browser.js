'use strict';

var UUID = {};

UUID.v4 = async function uuid() {
  var rnd = new Uint8Array(18); // could be 16
  return crypto.getRandomValues(rnd).then(function () {
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
    hex[19] = (8 + (hex[19] % 4)).toString(16); // 1/4 of a byte?
    hex[23] = "-";
    return hex.join("");
  });
}

if ('undefined' != typeof module) {
  module.exports = UUID;
}
