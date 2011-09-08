(function() {
  var TwitterNode, app, buffer, express, fs, io, twit;
  fs = require('fs');
  express = require('express');
  TwitterNode = require('twitter-node').TwitterNode;
  app = express.createServer();
  io = require('socket.io').listen(app);
  app.configure(function() {
    app.set('views', __dirname + '/views');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.compiler({
      src: __dirname + '/public',
      enable: ['less']
    }));
    app.use(app.router);
    return app.use(express.static(__dirname + '/public'));
  });
  app.configure('development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  app.configure('production', function() {
    return app.use(express.errorHandler());
  });
  app.get('/', function(req, res) {
    return res.render('index.jade', {
      locals: {
        title: 'Twist Of Pepper'
      }
    });
  });
  app.get('/:template.hb', function(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/handlebars'
    });
    return fs.readFile("./views/" + req.params.template + ".hb", function(err, data) {
      if (err) {
        throw err;
      }
      return res.end(data);
    });
  });
  buffer = [];
  twit = new TwitterNode({
    user: process.env.TWITTER_U,
    password: process.env.TWITTER_P,
    track: []
  });
  twit.addListener('error', function(err) {
    return console.log(err.message);
  });
  twit.addListener('tweet', function(tweet) {
    console.log("@" + tweet.user.screen_name + ": " + tweet.text);
    buffer.unshift(tweet);
    if (buffer.length > 15) {
      buffer.pop();
    }
    return io.sockets.emit('tweet', tweet);
  });
  twit.addListener('end', function(resp) {
    return console.log("Twitter connection ended with status: " + resp.statusCode);
  });
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function(chunk) {
    return chunk.split('\n').forEach(function(thing) {
      if (thing !== '') {
        twit.track(thing);
        return console.log("Tracking " + thing);
      }
    });
  });
  process.stdin.on('end', function() {
    return twit.stream();
  });
  io.sockets.on('connection', function(socket) {
    return socket.emit('buffer', buffer);
  });
  app.listen(process.env.PORT || 3000);
}).call(this);
