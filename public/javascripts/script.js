/* Author: Chris Mytton @hecticjeff

*/
(function($){
	var twistop = $.sammy(function(){
		this.element_selector = '#main';
		this.get('#/', function(){
			$.ajax({
				url: '/tweets',
				dataType: 'json',
				success: function(tweets){
					$.each(tweets, function(i, tweet){
						console.log(tweet.text);
					});
				}
			});
		});
	});

	$(function($){
		twistop.run('#/');
	});
})(window.jQuery);
