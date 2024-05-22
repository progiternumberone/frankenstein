define(["app" , "bbGrid" , "entity/MineralAwardReportsInstance" , "entity/MineralAwardEntriesInstance" , "entity/MineralAwardCompanyInstance" , "tpl!template/MineralAward_reports_grid_intro.html" , "tpl!template/MineralAward_reports_new_button.html" ], 
	function ( App , bbGrid , ReportsInstance , MAEntriesCollectionInstance , CompanyInstance , IntroTemplate , NewReportButtonTemplate ) {
		
		return function() {
			log( "BusinessLogic: showMineralAwardGLO3Reports"  );

			/*clear the working collection as we are now going to load a new one*/
			MAEntriesCollectionInstance.reset( [] );
			/*clear the working company data so that showMineralAwardGLO3Entry will look up company info from the newly selected one*/
			CompanyInstance.reset();
			
			/*set up master list for reports*/
			var MasterDetail_Reports = new (bbGrid.View.extend({
				collection: ReportsInstance
				,colModel: [
					{ title: 'Received Date',  index: true, name: 'company.receivedDate', sorttype: 'string',filter: false }
					,{ title: 'BAN',  index: true, name: 'company.ban', sorttype: 'string',filter: false }
					,{ title: 'Reporting Company Tax Id',  index: true, name: 'company.reportingCompanyTaxId', sorttype: 'string',filter: false }
					,{ title: 'User',  index: true, name: 'userName', sorttype: 'string',filter: false }
					,{ title: '&nbsp;',  actions: function(a,b,c,d) { 
						return '<a class="btn-sm btn-link view pointer">Edit</a> | <a class="btn-sm btn-link print pointer">Print</a>';
					} }
				]
				,enableSearch: false
				,onRowDblClick: function( model ) {
					App.navigate( "report/" + model.get( "reportNumber" ) , { trigger: true } );
				}
				,onRowClick: function( model , e ) {
					if( e.target.className.indexOf( "view" ) > -1 ) {
						/*send to the report entry screen*/
						App.navigate( "report/" + model.get( "reportNumber" ) , { trigger: true } );
					} else if( e.target.className.indexOf( "print" ) > -1 ) {
						/*send to the report print control*/
						window.open( "http://gloreports/ReportServer/Pages/ReportViewer.aspx?%2fDevelopment%2fPublic%2fFinancial+Management%2fGLO3RoyaltyPayment&rs:Command=Render&CFReportNumber=" + model.get( "reportNumber" ) );
					}
				}
				,caption: IntroTemplate()
			}));
			/*if ReportsInstance has not been loaded load it*/
			if( ReportsInstance.length == 0 ) {
				ReportsInstance.fetch();
			}
			//MasterDetail_Reports.render();
			App.getView().getRegion( "page1Region" ).show( MasterDetail_Reports );
			
			App.getView().showChildView( "page2Region" , new Marionette.View( { template: NewReportButtonTemplate } ) );
		}
});