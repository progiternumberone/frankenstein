define([ "marionette" ], function(
		Marionette) {
	var notify = Marionette.Object.extend({
		channelName: "notify"
		,initialize: function() {
			var channel = this.getChannel();
			channel.reply( "show:success" , this.showSuccess );
			channel.reply( "show:error" , this.showError );
		}
		,showSuccess: function( msg ) {
			alert( msg );
		}
		,showError: function( msg ) {
			alert( "error" + msg );			
		}
	});
	return new notify();
});
