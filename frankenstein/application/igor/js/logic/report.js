define(["app" , "masterDetail/behavior" , "stated/view" , "form/behavior" , 
		"entity/MineralAwardEntriesInstance" , "entity/MineralAwardCompanyInstance" , "entity/MineralAwardReportsInstance" ,
		"tpl!template/MineralAward_detail.html" , "tpl!template/MineralAward_grid_intro.html" , "tpl!template/MineralAwardCompany_detail.html" , 
		"tpl!template/MineralAward_grid_empty.html" , "tpl!template/MineralAward_entry_actions.html" , "tpl!template/MineralAward_report_completion.html" ,
		"tpl!template/stated_layout.html" ,"logic/entryForm" , "logic/saveReport"], 
		
	function ( App , MasterDetailBehavior , StatedView , FormBehavior ,
				MAEntriesCollectionInstance , CompanyInstance , ReportsInstance ,
				DetailTemplate , IntroTemplate , CompanyDetailTemplate , 
				EmptyGridTemplate , EntryActionsTemplate , ReportCompletionTemplate ,
				StateControlLayout, logicEntryForm , logicSaveReport ) {
					
		return function( banOrReportNum , encodedReceivedDate ) {
			log( "BusinessLogic: showMineralAwardGLO3Entry"  );
			
			/*set regions to local vars to avoid confusion*/
			var regionForCompany = App.getView().getRegion( "page0Region" );
			var regionForRecords = App.getView().getRegion( "page2Region" );
			var regionToCreateIn = App.getView().getRegion( "page3Region" );
			var regionForActions = App.getView().getRegion( "page4Region" );
			
			/*pull reportNum or BAN out of banOrReportNum parameter*/
			var reportNum = encodedReceivedDate ? "0" : banOrReportNum;
			var ban = encodedReceivedDate ? parseInt( banOrReportNum ) : 0;
			
			/*show a super basic detail view*/
			var companyInfoView = new Marionette.View( { template: CompanyDetailTemplate , model: CompanyInstance } );
			regionForCompany.show( companyInfoView );
			
			/*if instance is not in memory load it*/
			if( CompanyInstance.get( "ban" ) == null ) {
				
				if( ban ) {
					/*if we have a BAN we know this is a new/unsaved report*/
					/*this would only run if they refresh or bookmark the URL*/
					/*we can load the company info from the BAN so they do not have to re-enter company info, but possibly previously entered entries will be gone*/
					CompanyInstance.set( { "ban": ban , "receivedDate": decodeURIComponent( encodedReceivedDate ) } ).fetch({
						success: function() {
							/*update display with loaded company info*/
							companyInfoView.render();
						}
					});
					
				} else {
					/*this is a previously existing report so we can load saved company info and saved report entries*/
					if( ReportsInstance.length == 0 ) {
						/*this would only run from a on a page reload or bookmarked URL*/
						/*fetch all reports to get company and entry data from the server*/
						/*then pull out the data for this currently viewed report*/
						/*this allows for one REST/SQL call instead of mulitple*/
						ReportsInstance.fetch({
							success: function() {
								
								CompanyInstance.set( ReportsInstance.getCompany( reportNum ) );
								/*update display with loaded company info*/
								companyInfoView.render();
								MAEntriesCollectionInstance.reset( ReportsInstance.getEntries( reportNum ) );
								/*trigger change so that MasterDetail_MA3 will show entries collection*/
								//MAEntriesCollectionInstance.trigger( "change" );
								//MasterDetail_MA3.render();
							}
						});
					} else {
						/*this is accessed after the ReportsInstance is already loaded either above or from the Reports list screen*/
						var tmp = ReportsInstance.getCompany( reportNum );
						/*only reset if company is of a different report than the working instanace*/
						if( tmp.reportNumber != CompanyInstance.get( "reportNumber" ) ) {
							
							CompanyInstance.set( tmp );
							/*update display with loaded company info*/
							companyInfoView.render();
							
							MAEntriesCollectionInstance.reset( ReportsInstance.getEntries( reportNum ) );
							/*trigger change so that MasterDetail_MA3 will show entries collection*/
							//MAEntriesCollectionInstance.trigger( "change" );
							//MasterDetail_MA3.render();
						}
					}
				}
			}
			
			
			/*anonymous function for when the entry form is done being used*/
			var entryFormExitAction = function() { stateControl.showState( 0 ); }
			
			/*set up master detail control*/
			var MasterDetail_MA3 = new (Marionette.View.extend({
				//region: regionForRecords
				initialize: function() {
					MAEntriesCollectionInstance.on( "add" , this.render );
					MAEntriesCollectionInstance.on( "reset" , this.render );
				}
				,onBeforeDestroy: function() {
					MAEntriesCollectionInstance.off( "add" , this.render );
					MAEntriesCollectionInstance.off( "reset" , this.render );
				}
				,collection: MAEntriesCollectionInstance
				,template: IntroTemplate
				,regions: {
					master: ".master"
					,detail: ".detail"
					,empty: ".empty"
				}
				,behaviors: [
					{
						behaviorClass: MasterDetailBehavior
						//,emptyTemplate: EmptyGridTemplate/*provide messaging to tell user they need to add entries to their report*/
						,datatablesConfig: {
							/*onSelect: function( e, dt, type, indexes ) {
								log( e ); log( dt ); log( type ); log( indexes );
							}
							,*/
							columns: [
								{ "data" : "attributes.leaseNumber" }
								,{ "data" : "attributes.reportProductType" }
								,{ "data" : "attributes.glaCode" }
								,{ "data" : "attributes.productionYearMonth" }
								,{ "data" : "attributes.paymentAmount" }
								,{ "data" : null, "defaultContent" : '<a href="#" class="btn-xs btn-link copy" title="Copy">Copy</a> | <a href="#" class="btn-xs btn-link remove" title="Remove">Remove</a>' }
							]
							,searching: false
							,paging: false
							,ordering: false
							,info: false
						}
					}
				]
				,events: {
					"click .start": "exitEmpty"
				}
				,exitEmpty: function( e ) {
					e.preventDefault();
					this.hideEmpty();
					/*since the master detail view is destoryed, we need to tell it to re-show when the new entry is added*/
					MAEntriesCollectionInstance.once( "add" , function() { 
						//MasterDetail_MA3.render();
						this.showMaster();
					} , this );
					
					/*start entry form with disabled cancel button*/
					logicEntryForm( regionToCreateIn , MAEntriesCollectionInstance , null , true , entryFormExitAction );
					
					/*hide report actions and show a message*/
					stateControl.showState( 1 );
				}
				,onRenderMaster: function( view ) {
					/*listen to row actions*/
					var self = this;
					this.$el.find( "table" ).on( "click" , "a.copy" , function(e) {
						e.preventDefault();
						var model = self.collection.at( $(this).closest('tr').index() );
						/*start entry form and provide model to copy*/
						logicEntryForm( regionToCreateIn , MAEntriesCollectionInstance , model , false , entryFormExitAction );
						
						/*hide report actions and show a message*/
						stateControl.showState( 1 );
					});
					this.$el.find( "table" ).on( "click" , "a.remove" , function(e) {
						e.preventDefault();
						if( confirm( 'Remove selected record?' ) ) {
							var model = self.collection.at( $(this).closest('tr').index() );
							MAEntriesCollectionInstance.remove( model );	
							if( MAEntriesCollectionInstance.length == 0 && reportNum == "0" )
								MasterDetail_MA3.render();
							else
								$(this).closest('tr').remove();
						}
					});
					/*ensure report actions are visible*/
					stateControl.showState( 0 );
				}
				,onShowEmpty: function( view ) {
					/*hide report actions and show a message*/
					stateControl.showState( 1 );
				}
			}));
		
			/*set up stated control to show action buttons or not*/
			/*make form control for actions*/
			var ReportActionsForm = new (Marionette.View.extend({
				region: null/*to be set by stateControl*/
				,model: new Backbone.Model()/*form control is expecting, but it is not really needed for use*/
				,template: EntryActionsTemplate
				,behaviors: [ FormBehavior ]
				,events: {
					"click .add-new": "addNew"
				}
				,addNew: function() {
					/*start entry form*/
					logicEntryForm( regionToCreateIn , MAEntriesCollectionInstance , null , false , entryFormExitAction );
					
					/*hide report actions and show a message*/
					stateControl.showState( 1 );
				}
				,onSave: function( model ) {
					/*if( MAEntriesCollectionInstance.hasChanged() )*/
						logicSaveReport( MAEntriesCollectionInstance , CompanyInstance , false , 0 );
					/*else {
						App.navigate( "report" , { trigger: true } );
						App.trigger( "success" , "Report had no changes to save" );
					}*/
				}
				,onComplete: function( model ) {
					/*show the completion verification form*/
					stateControl.showState( 2 );
				}
			}));
			/*make form for completion verification*/
			var ReportCompletionForm = new (Marionette.View.extend({
				region: null/*to be set by stateControl*/
				,model: new Backbone.Model({ total: "" })
				,template: ReportCompletionTemplate
				,behaviors: [ FormBehavior ]
				,onInputChange: function( view , el ) {
					view.model.set( el.id , el.value );
				}
				,onSave: function( model ) {
					var entryTotal = 0;
					MAEntriesCollectionInstance.each( function( entry ) {
						entryTotal += parseFloat( entry.get( "paymentAmount" ) );
						/*stoopid computers dont know how to add even though it is the only thing they can do*/
						entryTotal = parseFloat( entryTotal.toFixed(2) );
					});
					if( entryTotal != model.get( "total" ) ) {
						App.trigger( "error" , "The entries' amounts do not sum up to the report total. Please verify the entries." );
					} else {
						/*save the report to the server*/
						logicSaveReport( MAEntriesCollectionInstance , CompanyInstance , true , model.get( "total" ) );
						
					}
				}
				,onCancel: function( model ) {
					stateControl.showState( 0 );
				}
			}));
			var stateControl = new (StatedView.extend({
				template: StateControlLayout
				,views: [
					ReportActionsForm
					,new Marionette.View( { template: _.template( "Add records before saving Report" ) } )
					,ReportCompletionForm
				]
			}));
			
			regionForActions.show( stateControl );
			//MasterDetail_MA3.render();
			regionForRecords.show( MasterDetail_MA3 );
			
		}
	}
);