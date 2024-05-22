define([ "app" , "form/behavior" , "entity/MineralAwardCompanyInstance" , "entity/MineralAwardReportsInstance" , "entity/MineralAwardEntriesInstance" , "tpl!template/MineralAwardCompany_form.html" ], 
	function( App , FormBehavior , CompanyInstance , ReportsInstance , MAEntriesCollectionInstance , template ) {

		return function( banOrReportNum , encodedReceivedDate ) {
			log( "BusinessLogic: showMineralAwardGLO3Company"  );
			
			/*pull reportNum or BAN out of banOrReportNum parameter*/
			var reportNum = encodedReceivedDate ? "0" : banOrReportNum;
			var ban = encodedReceivedDate ? parseInt( banOrReportNum ) : 0;
			
			/*set up the form control*/
			var Form_MA3Company = new (Marionette.View.extend({
				model: CompanyInstance
				,template: template
				,behaviors: [
					{
						behaviorClass: FormBehavior
						,unchangeOnCancel: true
					}
				]
				,onSave: function( model ) {
					log( "Form_MA3Company save" );
					/*no need to save to server yet, that will happen when the report is saved*/
					if( model.get( "reportNumber" ) == null )
						App.navigate( "report/" + model.get( "ban" ) + "/" + encodeURIComponent( model.get( "receivedDate" ) ) , { trigger : true } );
					else
						App.navigate( "report/" + model.get( "reportNumber" ) , { trigger : true } );
				}
				,onCancel: function( view ) {
					if( view.model.get( "reportNumber" ) == null )
						App.navigate( "report/" + view.model.get( "ban" ) + "/" + encodeURIComponent( view.model.get( "receivedDate" ) ) , { trigger : true } );
					else
						App.navigate( "report/" + view.model.get( "reportNumber" ) , { trigger : true } );
				}
				,onInputChange: function( view , el ) {
					log( "Form_MA3Company inputChange" );
					/*clean non decimals from BAN number*/
					if( el.id == "ban" ) {
						el.value = el.value.replace( /[^\d]/g , "" );
					}
					
					/*save the entered value to the model*/
					if( [ "reportingCompanyTaxId" , "companyName" , "customerId" ].indexOf( el.id ) == -1 ) {
						view.model.set( el.id , el.value );
					}
					
					if( el.id == "ban" ) {
						/*lookup company info based on BAN number*/
						view.model.fetch({
							success: function() {
								/*fill inputs with fetched data*/
								view.$( "#reportingCompanyTaxId" ).val( view.model.get( "reportingCompanyTaxId" ) );
								view.$( "#companyName" ).val( view.model.get( "companyName" ) );
								view.$( "#customerId" ).val( view.model.get( "customerId" ) );
								/*12-13-16 rerendering broke the date picker*/
								/*view.render();*/
								/*view.rerender();*/
							}
						});
					}
				}
			}));
			
			if( ! banOrReportNum ) {
				/*coming in as a new report make sure company data is empty*/
				CompanyInstance.reset();
				MAEntriesCollectionInstance.reset( [] );
			} else if( CompanyInstance.get( "ban" ) == null ) {
				/*if instance is not in memory load it*/
				if( ban ) {
					/*load new entry company from BAN*/
					CompanyInstance.set( { "ban": ban , "receivedDate": decodeURIComponent( encodedReceivedDate ) } ).fetch({
						success: function() {
							/*update form with loaded company info*/
							Form_MA3Company.rerender();
						}
					});
				} else {
					/*load existing report company from reportNum*/
					if( ReportsInstance.length == 0 ) {
						/*this would only run from a on a page reload or bookmarked URL*/
						/*fetch all reports to get company data from the server*/
						ReportsInstance.fetch({
							success: function() {
								
								CompanyInstance.set( ReportsInstance.getCompany( reportNum ) );
								/*update form with loaded company info*/
								Form_MA3Company.rerender();
							
								MAEntriesCollectionInstance.reset( ReportsInstance.getEntries( reportNum ) );
							}
						});
					} else {
						alert( "This should never run" );
						/*this is accessed after the ReportsInstance is already loaded either above or from the Reports list screen*/
						var tmp = ReportsInstance.getCompany( reportNum );
						/*only reset if company is of a different report than the working instanace*/
						if( tmp.reportNumber != CompanyInstance.get( "reportNumber" ) ) {
							
							CompanyInstance.set( tmp );
							/*update form with loaded company info*/
							Form_MA3Company.rerender();
						}
					}
				}
			}
			App.getView().getRegion( "page1Region" ).show( Form_MA3Company );
			//Form_MA3Company.render();
		}
	}
);