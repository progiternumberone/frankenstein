define([ "marionette" ], function(
		Marionette) {
	var appExtended = Marionette.Application.extend({
		region: "#main-content-region"
		
		,onStart: function() {
			log("APP Started");	
			APP.IsStarted = true;
			APP.trigger( "starting" );
			if (Backbone.history) {
				Backbone.history.start();
			}
			APP.trigger( "started" );
		}
	});
	var APP = new appExtended();
	
	Backbone.Collection.prototype.hasChanged = function() {
		var ret = false;
		for( var i = 0; i < this.models.length; i++ )
			log( this.at( i ) );
			if( this.at( i ).hasChanged() || this.at( i ).isNew() ) {
				ret = true;
				i = this.models.length;
			}
		return ret;
	}
	
	APP.navigate = function(route, options) {
		options || (options = {});
		Backbone.history.navigate(route, options);
	};

	APP.getCurrentRoute = function() {
		return Backbone.history.fragment;
	};
	
	return APP;
});
