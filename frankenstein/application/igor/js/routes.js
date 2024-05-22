define([ "marionette" , "app", "layout"
		, "logic/company" , "logic/report" , "logic/reports" , "logic/nav" ],
	function(Marionette , App, MainLayout
		, logicCompany , logicReport , logicReports , logicNav ) {
				
		/*set up router*/
		/*would like to do this in each sub-app, but that would require requirejsing all subapps into this page*/
		var Router = Marionette.AppRouter.extend({
			appRoutes: {
				"": "reports"
				,"report": "reports"
				,"company": "company"
				,"company/:reportNumber": "company"
				,"company/:ban/:encodedReceivedDate": "company"
				,"report/:ban/:encodedReceivedDate": "report"
				,"report/:reportNumber": "report"
			}
			,onRoute: function( name , path , args ) {
				if( App.getView() ) {
					App.trigger( "error:clear" );
				}
				/*determine how to highlight the nav*/
				/*the can be done in each of the logic functions, but seems more app-wide-cenric here*/
				var frag = Backbone.history.fragment;
				if( frag == "report" || frag == "" )
					logicNav( "reports" );
				else if( frag == "company" || ( frag.indexOf( "company" ) > -1 && frag.indexOf( "/" ) < frag.lastIndexOf( "/" ) ) )
					logicNav( "new" );
				else
					logicNav();
				
			}
			,execute: function(callback, args, names) {
				/*clear out all the regions before new screen*/
				if( App.getView() )
					App.getView().emptyAllRegions();
				
				/*proceed with routing as normal*/
				if (callback) callback.apply(this, args);
			}
		});
		var appRouter = new Router({
			controller: {
				/************************************************
				Reports List
				create a master detail control for mineral award glo3 reports
				sends to report entry screen upon row selection
				*/
				reports: logicReports
				
				/************************************************
					Company Info Form
					creates a FormControl to allow editing or creation of CompanyInstance info
					if creating a new report this also clears out the working MAEntriesCollectionInstance
				*/
				,company: logicCompany
				/************************************************
					Report Entry Screen
					A heavy screen that:
						1. based on parameters sets the working company and entries instances
							a. loads the ReportsInstance if needed
						2. creates company info view that links to company edit screen
						3. creates masterDetail of report entries
							a. provides empty tempate instructing to create entries
						4. creates a stated control to show one at a time of:
							a. Form control with just Save and Complete button logics
								- Save logic calls saveMineralAwardGLO3Report
							b. Tell the user they cannot save at the moment
							c. Form Control for Complete to force manual verificatoin of total amount before saving record as complete
						5. controls which stated control item is in view
				*/
				,report: logicReport
			}
		});		
		
		return Router;
	}
);