define([ "marionette" , "app", "businessLogic", "layout" /*, "notify"*/ ],
	function(Marionette , App, BusinessLogic, MainLayout ) {
		
		
		/*set up router*/
		/*would like to do this in each sub-app, but that would require requirejsing all subapps into this page*/
		var Router = Marionette.AppRouter.extend({
			appRoutes: {
				"": "home"
				,"help": "home"
				,"models": "models"
				,"views": "views"
				,"examples": "examples"
				,"lease": "showLeases"
				,"lease/:id": "showLeases"
				,"people/read": "showPeople"
				,"people/read/:id": "showPeople"
				,"people/edit": "showEditablePeople"
				,"people/edit/:id": "showEditablePeople"
				,"person/:id": "showPersonForm"
				,"dtpeople/read": "showPeopleDT"
				,"dtpeople/read/:id": "showPeopleDT"
				,"stated": "showStatedExample"
				,"wizard": "showWizard"
			}
			,onRoute: function( name , path , args ) {
				if( App.getView() ) {
					App.getView().emptyAllRegions();
					App.trigger( "error:clear" );
				}
			}
		});
		/*connect routes to functions in businessLogic*/
		var appRouter = new Router({
			controller: new BusinessLogic()
		});
		
		/*var channel = Backbone.Radio.channel( "notify" );*/
		
		App.on( "started" , function() {
			log( "mainContentApp Module app.on.started" );
			/*put the main layout in the main region*/
			App.showView( MainLayout );
		});
		
		/*LISTEN FOR APP-WIDE EVENTS*/
		/*show a success message via main layout*/
		App.on( "success" , function( message ) {
			App.mainContentLayout.showMessage( message , true );
			/*channel.request( "show:success" , message );*/
		});
		/*show an error message via main layout*/
		App.on( "error" , function( message ) {
			App.mainContentLayout.showMessage( message , false );
		});
		App.on( "error:clear" , function() {
			App.mainContentLayout.clearMessage( false );
		});
		return Router;
	}
);