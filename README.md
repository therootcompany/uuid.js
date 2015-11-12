Everybody knows about [node-uuid](https://github.com/broofa/node-uuid) and that it's pretty fast, right?

And everybody knows about [140byte-uuid](https://gist.github.com/jed/982883) and that it's insanely small, but really slow, right?

Well, while I was looking at [all that math](https://github.com/broofa/node-uuid/blob/master/uuid.js#L85) in node-uuid, I wondered to myself:
Is that really all that more efficient than just accessing strings?
(BTW, I was totally looking at [the wrong function](https://github.com/broofa/node-uuid/blob/master/uuid.js#L196))

So I set out on a mission to make strings faster than bitwise operations, and I did! Over 2x faster! (generally in the range of 550,000/s instead of 250,000/s)

Note that the **huge** time saver here is actually pooling `crypto.randomBytes()` ahead of time.
If we were to implement the same thing in `node-uuid` we might see an even bigger increase.

`fast-uuid.js`:
```
'use strict';

var crypto = require('crypto');
var pool = 31 * 128; // 36 chars minus 4 dashes and 1 four
var r = crypto.randomBytes(pool);
var j = 0;
var str = "10000000-1000-4000-8000-100000000000";
var len = str.length; // 36
var strs = [];

strs.length = len;
strs[8] = '-';
strs[13] = '-';
strs[18] = '-';
strs[23] = '-';

function uuid(){
  var ch;
  var chi;

  for (chi = 0; chi < len; chi++) {
    ch = str[chi];
    if ('-' === ch || '4' === ch) {
      strs[chi] = ch;
      continue;
    }

    j++;
    if (j >= r.length) {
      r = crypto.randomBytes(pool);
      j = 0;
    }

    if ('8' === ch) {
      strs[chi] = (8 + r[j] % 4).toString(16);
      continue;
    }

    strs[chi] = (r[j] % 16).toString(16);
  }

  return strs.join('');
}

module.exports = { v4: uuid };
```

And the test:

`fast-uuid-test.js`:
```
fast-uuid-test.js
'use strict';

var uuid = require('./fast-uuid');
// var uuid = require('node-uuid');
var now = Date.now();
var t = 0;
var msec;

for (t; t < 100000; t++) {
  uuid.v4();
}

msec = Date.now() - now;
console.log(Math.floor((1000 / msec) * 100000) + ' uuid/s');
console.log('100000 in ' + (Date.now() - now) + 'ms');
console.log(uuid.v4());
```