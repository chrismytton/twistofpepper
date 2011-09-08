twistofpepper
=============

Realtime twitter streams using node, socket.io and sammy.js.

## Install

First you need to grab the git repo and install the dependencies using
[npm](http://npmjs.org/).

```shell
$ git clone https://github.com/hecticjeff/twistofpepper
...
$ cd twistofpepper
$ npm install
...
```

## Usage

The app reads a list of terms on stdin and watches the Twitter streaming
API for any mention of them.

Create a file and place one term on each line, in the example below,
I've called it `things.txt`.

```shell
$ cat things.txt
node.js
coffeescript
socket.io
$ npm start < things.txt

> twistofpepper@0.0.0 start /Users/chris/github/hecticjeff/twistofpepper
> node server.js

   info  - socket.io started
Tracking 'node.js'
Tracking 'coffeescript'
Tracking 'socket.io'
@Goyapa: node.js http://t.co/17CnxTw
...
```

Copyright (c) 2011, Chris Mytton
