
/**
 * Module dependencies.
 */

var express = require('express'),
    io = require('socket.io'),
    TwitterNode = require('twitter-node').TwitterNode,
    sys = require('sys');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.use(express.bodyDecoder());
    app.use(express.methodOverride());
    app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
    app.use(app.router);
    app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
   app.set('port', 80);
   app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res){
    res.render('index.jade', {
        locals: {
            title: 'Twist Of Pepper'
        }
    });
});

app.get('/:template.hb', function(req, res){
  res.writeHead(200, {'Content-Type': 'text/handlebars'});
  var fs = require('fs');
  fs.readFile('./views/' + req.params.template + '.hb', function(err, data){
    if (err) throw err;
    res.end(data);
  });
});

var buffer = [],
    json = JSON.stringify,
    socket = io.listen(app),
    twit = new TwitterNode({
      user: process.env.TWITTER_U,
      password: process.env.TWITTER_P,
      track: ['ruby', 'nodejs', 'javascript', 'rails', 'coffeescript']
    });

twit.addListener('error', function(error) {
  console.log(error.message);
});

twit.addListener('tweet', function(tweet) {
  sys.puts("@" + tweet.user.screen_name + ": " + tweet.text);
  buffer.unshift(tweet);
  if (buffer.length > 15) { buffer.pop(); }
  socket.broadcast(json({tweet: tweet}));
})

.addListener('limit', function(limit) {
  sys.puts("LIMIT: " + sys.inspect(limit));
})

.addListener('delete', function(del) {
  sys.puts("DELETE: " + sys.inspect(del));
})

.addListener('end', function(resp) {
  sys.puts("wave goodbye... " + resp.statusCode);
})

.stream();


socket.on('connection', function(client){
    // new client is here!
    // send out a new message every time there is a new tweet available.
  client.send(json({buffer: buffer}));

  client.on('message', function(msg){
    // Client has sent a message
    console.log(msg);
  });

  client.on('disconnect', function(){
    // Bye bye
  });
});

app.listen(app.set('port') || 3000);
