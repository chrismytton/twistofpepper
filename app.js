
/**
 * Module dependencies.
 */

var express = require('express'),
		http = require('http');

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
   app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
    res.render('index.jade', {
        locals: {
            title: 'Express'
        }
    });
});

app.get('/tweets', function(req, res){
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end('[{"text": "Hello world", "screen_name": "hecticjeff"}]'); 

	var twitter = http.createClient(80, 'api.twitter.com');
	var request = twitter.request('GET', '/1/users/show?screen_name=hecticjeff', {'host': 'api.twitter.com'});
	request.end();
	request.on('response', function(response){
		console.log('STATUS: ' + response.statusCode);
		console.log('HEADERS: ' + JSON.stringify(response.headers));
		response.setEncoding('utf8');
		response.on('data', function(chunk){
			console.log('BODY: ' + chunk);
		});
	});
});
// Only listen on $ node app.js

if (!module.parent) {
    app.listen(3000);
    console.log("Express server listening on port %d", app.address().port)
}
