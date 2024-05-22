define([ "marionette" , "app", "layout"],
	function(Marionette , App, MainLayout) {
		var mainController = Marionette.Object.extend({
			/************************************************
				route handler to show home page
			*/
			home: function() {
				log( "BusinessLogic: home" );
				require([ "tpl!template/home.html" ], function ( template ) {
					/*give it a region to display in*/
					App.getView().showChildView( "page0Region" , new Marionette.View( { template: template } ) );
				});
			}
		});

	return mainController;
});;