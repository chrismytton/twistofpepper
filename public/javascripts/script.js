/* Author: Chris Mytton @hecticjeff

   Twist of Pepper

   what are people twEATing?

   An experiment with WebSockets, sammy.js and node.js

   This file defines the sammy app and the websocket interactions.
*/
(function($){
  var socket = new io.Socket();

  var app = $.sammy(function(app){
    this.use('Handlebars', 'hb');
    this.use('JSON');
    this.element_selector = '#main';

    function setupSockets(){
      var context = this;
      socket.connect('http://localhost');

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
    };

    this.bind('run', setupSockets);


    this.bind('tweet', function(e, tweet) {
      console.log(tweet);
      var context = this;
      this.render('tweet.hb', tweet, function(html){
        context.$element().prepend(html);
      });
    });


    app.bind('buffer', function(e, tweets){
      var context = this;
      this.load('tweet.hb', null, function(content){
        context.partials = {tweet: content};
        context.tweets = tweets;
        context.partial('index.hb');
      });
    });


    this.get('#/search', function(context){
      // Show the user a search dialog
    });
    this.get('#/search/:q', function(context){
      // Query the server and return the result to the user
    });
  });

  $(function($){
    app.run();
  });
})(window.jQuery);
