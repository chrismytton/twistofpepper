/* Author: Chris Mytton @hecticjeff

*/
(function($){
	var socket = new io.Socket();
	socket.connect();

	socket.on('connect', function(){
		// Client has connected to the server
		console.log('Connected to remote');
		socket.send('Hello!');
	});

	socket.on('message', function(data){
		// New message received
		console.log(data);
	});

	socket.on('disconnect', function(arg){
		// Disconnected from the server
		console.log(arg);
	});

	var app = $.sammy(function(){
		this.element_selector = '#main';

		this.get('#/', function(){
			
		});
	});

	$(function($){
		app.run('#/');
	});
})(window.jQuery);
