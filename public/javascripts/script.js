/* Author: Chris Mytton @hecticjeff

*/
(function($){
	var socket = new io.Socket();

	var app = $.sammy(function(app){
		this.use('Handlebars', 'hb');
		this.use('JSON');
		this.element_selector = '#main';

		this.bind('run', function(e) {
			var context = this;
			socket.connect();

			socket.on('connect', function(){
				// Client has connected to the server
			});
			
			socket.on('disconnect', function(arg){
				// Disconnected from the server
			});

			socket.on('message', function(msg){
				msg = context.json(msg);
				// New message received
				if ('buffer' in msg) {
					return app.trigger('buffer', msg.buffer);
				}
				if ('tweet' in msg) {
					return app.trigger('tweet', msg.tweet);
				}
			});
		});


		this.bind('tweet', function(e, tweet) {
			console.log(tweet);
			tweet = tweet;
			var context = this;
			this.render('tweet.hb', tweet, function(html){
				context.$element().prepend(html);
			});
		});

		$.get('tweet.hb', function(response){
			app.bind('buffer', function(e, tweets){
				this.partials = {tweet: response};
				this.tweets = tweets;
				this.partial('index.hb');
			});
		})
	});

	$(function($){
		app.run();
	});
})(window.jQuery);
