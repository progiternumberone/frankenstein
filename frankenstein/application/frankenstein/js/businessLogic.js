define([ "marionette" , "app", "layout"],
	function(Marionette , App, MainLayout) {
		var mainController = Marionette.Object.extend({
			/************************************************
				route handler to show home page
			*/
			views: function() {
				log( "BusinessLogic: views" );
				require(["tpl!template/controls.html"], function ( template ) {
					/*give it a region to display in*/
					App.getView().showChildView( "page0Region" , new Marionette.View( { template: template } ) );
				});
			}
			/************************************************
				route handler to show help page
			*/
			,home: function() {
				log( "BusinessLogic: home" );
				require([ "tpl!template/home.html" ], function ( template ) {
					/*give it a region to display in*/
					App.getView().showChildView( "page0Region" , new Marionette.View( { template: template } ) );
				});
			}
			/************************************************
				route handler to show models page
			*/
			,models: function() {
				log( "BusinessLogic: models" );
				require([ "tpl!template/models.html" ], function ( template ) {
					/*give it a region to display in*/
					App.getView().showChildView( "page0Region" , new Marionette.View( { template: template } ) );
				});
			}
			/************************************************
				route handler to show examples page
			*/
			,examples: function() {
				log( "BusinessLogic: examples" );
				require([ "controls/view" ], function ( view ) {
					/*give it a region to display in*/
					App.getView().showChildView( "page0Region" , new view() );
				});
			}
			
			/************************************************
				route handlers that put together UI controls 
				with business specific rules, data, and templates
			************************************************/
			
			
			/************************************************
				run a data list control for GLA leases as a card grid
			*/
			,showLeases: function( id ) {
				var self = this;
				require(["DataListView" , "entity/GLALease" , "entity/GLALeasesInstance" , "tpl!template/leaseDetail.html" , "tpl!template/dataList_layout.html"], 
					function ( DataListView , leaseModel , collection , detailTemplate , layoutTemplate ) {
						self.showLinkToFunctionLine( 54 );
						var DataListLayout = Marionette.View.extend({
							className: "dataListLayoutContainer"
							,template: layoutTemplate			
							,regions: {
								main: ".dataListContainer"
							}			
							,events: {
								"click .clearAssigned": "clearAssigned"
							}
							,showClearAssignedButton: function() {
								this.$( ".clearAssignedContainer" ).show();
							}
							,clearAssigned: function( e ) {
								e.preventDefault();
								log("DataListLayout: clearAssigned");
								/*remove freshly saved items from the collection*/
								this.$( "#clearAssignedContainer" ).hide();
								this.getChildView( 'main' ).setFilter( function ( model , index , collection ) {
									return ! model.get( 'justSaved' );
								});
							}
						});
						
						var LeasesView = DataListView.extend({
							collection: collection
							,itemPerRow: 2
							,childViewOptions: function( model , idx ) {
								return {
									template: detailTemplate
									,className: "cardContainer col-sm-6 col-xs-10 col-xs-offset-1 col-sm-offset-0"
								};
							}
							,onChildviewInputChange: function( view , el ) {
								var glas = view.model.get( "GLAs" );
								var val = $( el ).val().replace( /[^0-9\.]/g , '' );
								$( el ).val( val );
								for( var i = 0; i < glas.length; i++ ) {
									if( glas[ i ].RentalGLACode == el.id ) {
										glas[ i ].Percent = val ? val : 0;
										i = glas.length;
									}
								}
								
								if( view.model.getGLAPercentTotal() != 100 ) {
									view.disableSave( "Percent total must = 100" );
								} else {
									view.enableSave( "Save GLA Allocations" );
								}
							}
							,onChildviewSave: function( view ) {
								App.trigger( "error:clear" );
								var total =  view.model.getGLAPercentTotal();
								if( total != 100 ) {
									App.trigger( "error" , "GLA allocations do not equal 100%" );
								} else {
									log( "DataList_Leases: save" );
									view.model.save( null , { 
										success: function( model ) {
											log( "DataList_Leases: saved" );
											App.trigger( "success" , "Updates were saved" );
											if( model.collection && model.collection.length > 1 ) {
												Layout.showClearAssignedButton();
											}
										}
									});
								}
							}
						});
						var Layout = new DataListLayout();
						var View = new LeasesView();
						if( id == null ) {
							collection.fetch({
								success: function() {
									App.getView().getRegion( "page1Region" ).show( Layout );
									Layout.showChildView( "main" , View );
								}
							});
						} else {
							id = id.replace( /[^\d]/g , "" );
							var model = new leaseModel( { id : id } );
							model.fetch({ success: function() {
									collection.reset( [ model ] );
									App.getView().getRegion( "page1Region" ).show( Layout );
									Layout.showChildView( "main" , View );
								}
								, error: function() {
									App.trigger( "error" , "No Lease of Number " + id + " exists." );
								}
							});
						}
					}
					
				);
			}
			
			/************************************************
				run a master detail control for people
				when detail view shows:
					- adds an edit form for person
					- adds support objects master detail
			*/
			,showPeople: function() {
				log( "BusinessLogic: showPeople"  );
				var self = this;
				require([ "bbGrid" , "entity/people" , "tpl!template/person_detail.html" ], 
					function ( bbGrid , PeopleCollectionInstance , DetailTemplate ) {
						self.showLinkToFunctionLine( 159 );
						var MasterDetail_People = new (bbGrid.View.extend({
							collection: PeopleCollectionInstance
							,colModel: [
								{ title: 'First Name',  index: true, name: 'FName', sorttype: 'string',filter: false }
								,{ title: 'Last Name',  index: true, name: 'LName', sorttype: 'string',filter: false }
								,{ title: 'Division',  index: true, name: 'Program', sorttype: 'string',filter: false }
							]
							,rows: 15
							,rowList: [5, 15, 30, 45, 100]
							,enableSearch: true
							,caption: ''
							
							,onRowClick: function( model ) {
								App.navigate( "people/read/" + model.id , { trigger : false } );
								let tmpMasterView = App.getView().getRegion( "page1Region" ).detachView();
								App.getView().getRegion( "page1Region" ).show( new( Marionette.View.extend( {
										template: DetailTemplate
										,model: model
										,events: {
											"click .exit": "leave"
										}
										,leave: function() {
											App.getView().getRegion( "page2Region" ).empty();
											App.getView().getRegion( "page1Region" ).show( tmpMasterView );
										}
									} ) ) 
								);
								self.addSupportObjects( model , App.getView().getRegion( "page2Region" ) );
								/*this.addPersonForm( model , App.getView().getRegion( "page3Region" ) );*/
							}
						}));
						PeopleCollectionInstance.fetch({
							success: function() {
								log( "MasterDetail_People.render()" );
								App.getView().getRegion( "page1Region" ).show( MasterDetail_People );
							}
						});
					}
				);
			}
			
			,showPeopleDT: function() {
				log( "BusinessLogic: showPeopleDT" );
				var self = this;
				require(["MasterDetailView" , "entity/people" , "tpl!template/person_detail.html" , "tpl!template/people_datatable.html" ],
					function ( MasterDetailView , PeopleCollectionInstance , DetailTemplate , DatatablesTemplate ) {
						self.showLinkToFunctionLine( 211 );
						var MasterDetail_People = new (MasterDetailView.extend({
							collection: PeopleCollectionInstance
							,template: DatatablesTemplate
							,detailTemplate: DetailTemplate
							,autoRefresh: true
							,regions: {
								master: ".master"
								,detail: ".detail"
								,empty: ".empty"
							}
							,onRender: function() {
								console.log( "onRenderOverride" );
								MasterDetailView.prototype.onRender.call(this);
							}
							,events: {
								/*event just to load data after showing the empty view/region*/
								"click .see-data": "showData"
							}
							,datatablesConfig: {
								/*onSelect: function( e, dt, type, indexes ) {
									log( e ); log( dt ); log( type ); log( indexes );
								}
								,*/
								columns: [
									{ "data" : "attributes.EmployeeID" , "visible" : false }
									,{ "data" : "attributes.FName" }
									,{ "data" : "attributes.LName" }
									,{ "data" : "attributes.Program" }
								]
								,buttons: [
									'excel','pdf'
								]
							}
							,childViewEvents: {
								"exit:detail": "exitDetail"
							}
							,exitDetail: function() {
								this.hideDetail();
								App.getView().getRegion( "page2Region" ).empty();
								this.showMaster();
							}
							,onRenderMaster: function() {
								log( "renderMaster" );
							}
							,onRenderDetail: function( model ) {
								App.navigate( "dtpeople/read/" + model.id , { trigger : false } );
								this.hideMaster();
								self.addSupportObjects( model , App.getView().getRegion( "page2Region" ) );
								/*this.addPersonForm( model , App.getView().getRegion( "page3Region" ) );*/
							}
							/*event handler just to go from empty view to then fetching the data*/
							,showData: function( e ) {
								e.preventDefault();
								PeopleCollectionInstance.fetch({
									success: function() {
										log( "MasterDetail_People.render()" );
										/*not needed cause autoRefresh is enabled
										MasterDetail_People.render();
										*/
									}
								});
							}
						}));
						
						App.getView().getRegion( "page1Region" ).show( MasterDetail_People );
						PeopleCollectionInstance.fetch();
				});
			}
			/************************************************
				run a master detail control for people
				provides an edit form control for the person detail view
				when detail view shows:
					- adds support objects master detail
			*/
			,showEditablePeople: function() {
				log( "BusinessLogic: showEditablePeople"  );
				var self = this;
				require(["MasterDetailView" , "FormView" , "entity/people" , "tpl!template/people_datatable.html" ,"tpl!template/person_form.html" ], 
					function ( MasterDetailView , FormView , PeopleCollectionInstance , DatatablesTemplate , PersonFormTemplate ) {
						self.showLinkToFunctionLine( 289 );
						var model = new Backbone.Model();
						var Form_Person = self.getPersonForm( FormView , PersonFormTemplate , null );
						
						var MasterDetail_People = new (MasterDetailView.extend({
							template: DatatablesTemplate
							,collection: PeopleCollectionInstance
							,regions: {
								master: ".master"
								,detail: ".detail"
								,empty: ".empty"
							}
							,detailView: Form_Person
							,datatablesConfig: {
								columns: [
									{ "data" : "attributes.EmployeeID" , "visible" : false }
									,{ "data" : "attributes.FName" }
									,{ "data" : "attributes.LName" }
									,{ "data" : "attributes.Program" }
								]
							}
							,onRenderDetail: function( model ) {
								App.navigate( "people/edit/" + model.id , { trigger : false } );
								/*this.addPersonForm( model , App.getView().getRegion( "page2Region" ) );*/
								self.addSupportObjects( model , App.getView().getRegion( "page3Region" ) );
							}
						}));
						
						PeopleCollectionInstance.fetch({
							success: function() {
								log( "MasterDetail_People.render()" );
								App.getView().getRegion( "page1Region" ).show( MasterDetail_People );
							}
						});
				});
			}
			
			/************************************************
				run an edit form control for a person
			*/
			,showPersonForm: function( id ) {
				log( "BusinessLogic: showPersonForm"  );
				var self = this;
				require(["FormView" , "entity/person" , "tpl!template/person_form.html" ], 
					function ( FormView , PersonModel , DetailTemplate ) {
						self.showLinkToFunctionLine( 333 );
						var model = new PersonModel( { id : id } );
						
						var Form_Person = self.getPersonForm( FormView , DetailTemplate , model );
						
						model.fetch({ success: function() {
								App.getView().getRegion( "page1Region" ).show( Form_Person );
							}
							, error: function() {
								App.trigger( "error" , "No person with id of " + id + " exists." );
							}
						});
					}
				);
			}
			
			
			/************************************************
				run an edit form control for a person
			*/
			,showStatedExample: function() {
				log( "BusinessLogic: showStatedExample"  );
				var self = this;
				require(["FormView" , "StatedView" , "entity/person" , "entity/MineralAwardCompany" , "tpl!template/stated_layout.html" , "tpl!template/person_form.html" , "tpl!template/MineralAwardCompany_form.html" ], 
					function ( FormView , StatedView , PersonModel , CompanyModel , StatedLayout , PersonFormTemplate , CompanyFormTemplate ) {
						self.showLinkToFunctionLine( 359 );
						
						var person = new PersonModel();
						var Form_Person = new (FormView.extend({
							model: person
							,template: PersonFormTemplate
							,onInputChange: function( view , el ) {
								view.model.set( el.id , el.value );
							}
							,onSave: function( model ) {
								statedView.next();
							}
						}))();
						
						var company = new CompanyModel();
						var Form_Company = new (FormView.extend({
							model: company
							,template: CompanyFormTemplate
							,onInputChange: function( view , el ) {
								view.model.set( el.id , el.value );
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
										}
									});
								}
							}
							,onSave: function( model ) {
								statedView.next();
							}
						}))();
						
						var statedView = new (StatedView.extend({
							template: StatedLayout
							,views: [
								Form_Person
								,Form_Company
								,new Marionette.View( { template: _.template( '<div class="panel panel-default"><div class="panel-heading">End</div><div class="panel-body">Thank you. That is all.<br /><a href="#" class="btn btn-default">Home</a></div></div>' ) } )
							]
						}));
						App.getView().getRegion( "page2Region" ).show( statedView );
					}
				);
			}
			
			/************************************************
				run a bootstrap wizard example
			*/
			,showWizard: function() {
				var self = this;
				require(["FormView" , "WizardView" , "entity/person" , "entity/MineralAwardCompany" , "tpl!template/wizard_example.html" , "tpl!template/person_form.html" , "tpl!template/MineralAwardCompany_form.html" ], 
					function ( FormView , WizardView , PersonModel , CompanyModel , WizardTemplate , PersonFormTemplate , CompanyFormTemplate ) {
						self.showLinkToFunctionLine( 429 );
						var person = new PersonModel();
						var Form_Person = new (FormView.extend({
							model: person
							,template: PersonFormTemplate
							,onAttach: function() {
								this.toggleEdit();
							}
							,onInputChange: function( view , el ) {
								view.model.set( el.id , el.value );
							}
							,onSave: function( model ) {
								Wizard.$el.bootstrapWizard( 'next' );
							}
						}));
						
						
						
						var company = new CompanyModel();
						var Form_Company = new (FormView.extend({
							model: company
							,template: CompanyFormTemplate
							,onInputChange: function( view , el ) {
								view.model.set( el.id , el.value );
							}
							,onSave: function( model ) {
								Wizard.$el.bootstrapWizard( 'next' );
							}
						}));
						
						
						
						var Wizard = new (WizardView.extend({
							template: WizardTemplate
							,regions: {
								tab2: "#tab2"
								,tab3: "#tab3"
							}
							,tabToFarthest: true
							,config: {
									'nextSelector': '.wnext'
									,'previousSelector': '.cancel,.wprev'
									,onTabChange: function() {
										console.log( "TAB CHANGE" );
									}
									,onTabClick: function() {
										console.log( "TAB CLICK" );
									}
							}
							,onPreventTab: function( curIdx , newIdx ) {
								App.trigger( "error" , "You may only proceed to the next tab." );
							}
						}));
						App.getView().getRegion( "page1Region" ).show( Wizard );
						Wizard.getRegion( "tab2" ).show( Form_Person );
						Wizard.getRegion( "tab3" ).show( Form_Company );
					}
				);
			}
			
			
			
			
			
			/************************************************
				non-route functions that put together UI controls 
				with business specific rules, data, and templates
			************************************************/
			
			/************************************************
				shows an edit form control for a provided person model in the provided region
				called by:
					- MasterDetail_People.on( "show:detail"...		
			*/					
			,addPersonForm: function( model , region ) {
				log( "BusinessLogic: addPersonForm"  );
				var self = this;
				require(["form/view" , "entity/person" , "tpl!template/person_form.html" ], 
					function ( FormView , PersonModel , DetailTemplate ) {
						
						var item = model;
						var Form_Person = self.getPersonForm( FormView , DetailTemplate , model );
						Form_Person.render();
					}
				);
			}
			
			/************************************************
				show a master detail control of support objects for a provided person model in the provided region
				has no detail view
				called by:
					- MasterDetail_People.on( "show:detail"...
			*/
			,addSupportObjects: function( model , region ) {
				log( "BusinessLogic: showSupportObjects"  );
				require([ "bbGrid" , "entity/personSupportObjects" ],
					function ( bbGrid , PersonSupportObjectCollection ) {
						
						var MasterDetail_SupportObjects = new (bbGrid.View.extend({
							collection: PersonSupportObjectCollection
							,colModel: [
								{ title: 'Name',  index: true, name: 'ObjName', sorttype: 'string',filter: false }
								,{ title: 'Role',  index: true, name: 'SupType', sorttype: 'string',filter: false }
							]
							,enableSearch: false
							,onRowDblClick: function( model ) {
								log( "MasterDetail_SupportObjects: onRowDblClick" );
								alert( model.get( "ObjName" ) );
							}
							,caption: "<h3>Support Objects</h3>"
						}));
						
						PersonSupportObjectCollection.fetchRelated( model.id , {
							success: function() {
								region.show( MasterDetail_SupportObjects );
							}
						});
				});
			}
			
			
			
			
			/************************************************
				utilities
			*************************************************/
			
			
			/************************************************
				puts together a form for a person with control and template provided by what calling functions have requireJS'd
			*/
			,getPersonForm: function( FormView , PersonFormTemplate , model ) {
				var Form_Person = new (FormView.extend({
					template: PersonFormTemplate
					,model: model
					,onInputChange: function( view , el ) {
						log( "Form_Person onInputChange" );
						if( [ "EmployeeID" ].indexOf( el.id ) == -1 )
							view.model.set( el.id , el.value );
					}
					,onSave: function( model ) {
						log( "Form_Person save" );
						var self = this;
						model.save( null , { 
							success: function( model ) {
								log( "Form_Person: saved" );
								App.trigger( "success" , "Person was saved" );
								self.rerender();
							}
						});
					}
				}));
				
				return Form_Person;
			}
			
			,showLinkToFunctionLine: function( lineNum ) {
				App.getView().showChildView( "viewCodeLinkRegion" , new Marionette.View( { template: _.template( '<a href="http://shemp:7990/projects/WT/repos/frankenstein/browse/application/frankenstein/js/businessLogic.js?at=refs%2Fheads%2Fmaster#' + lineNum + '" target="_blank" class="pull-right btn btn-success">View Code</a>' ) } ) );
			}
		});

	return mainController;
});;