# [@root/uuid.js](https://github.com/therootcompany/uuid.js)

> About Lightweight, no nonsense, 2x faster uuid.v4. 0 deps, of course.

Just for node. Pre-allocates `crypto.randomBytes()` to achieve insane speeds
without increasing the complexity. The only possible downside is that it uses a
constant 31\*128 bytes of memory, but this is offset by the fact that there's
far less garbage collection.

## Usage

```bash
npm install --save @root/uuid
```

```js
var UUID = require("./uuid.js");
UUID.v4();
// f6d40277-1e32-4905-8fe6-82f40dc03b73
```

# Rationalé

This is started out as a curiosity, pasted as a gist but now, years later, I've
come back to it because it's easy to read and understand (for me, at least).

There are too many of these uuid modules out there and they're too complicated.

## node-uuid vs crazy-uuid vs fast-uuid

Everybody knows about [node-uuid](https://github.com/broofa/node-uuid) and that
it's pretty fast, right?

And everybody knows about [140byte-uuid](https://gist.github.com/jed/982883) and
that it's insanely small, but really slow, right?

Well, while I was looking at
[all that math](https://github.com/broofa/node-uuid/blob/master/uuid.js#L85) in
node-uuid, I wondered to myself: Is that really all that more efficient than
just accessing strings? (BTW, I was totally looking at
[the wrong function](https://github.com/broofa/node-uuid/blob/master/uuid.js#L196))

So I set out on a mission to make 'if' blocks and strings faster than bitwise
operations, and I did! Over 2x faster! (generally in the range of 550,000/s
instead of 250,000/s)

## How is it 2x faster!?!?

Note that the **huge** time saver here is actually pooling
`crypto.randomBytes()` ahead of time. If we were to implement the same thing in
`node-uuid` we might see an even bigger increase.

# License

Copyright 2021 The Root Group, LLC \
Copyright 2015-2021 AJ ONeal

This Source Code Form is subject to the terms of the Mozilla \
Public License, v. 2.0. If a copy of the MPL was not distributed \
with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
