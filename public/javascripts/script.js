/* Author: Chris Mytton @hecticjeff

   Twist of Pepper

   what are people twEATing?

   An experiment with WebSockets, sammy.js and node.js

   This file defines the sammy app and the websocket interactions.
*/
(function($){
  var app = $.sammy(function(app){
    this.use('Handlebars', 'hb');
    this.use('JSON');
    this.element_selector = '#main';

    var socket = io.connect();

    socket.on('buffer', function(buffer) {
      app.trigger('buffer', buffer);
    });

    socket.on('tweet', function(tweet) {
      app.trigger('tweet', tweet);
    });

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
