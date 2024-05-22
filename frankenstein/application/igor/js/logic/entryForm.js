define(["app" , "form/behavior" , "entity/MineralAwardEntry" , "entity/MineralAwardGLALookup" , "entity/MineralAwardLeaseLookup" , "tpl!template/MineralAward_form.html" ], 
	function ( App , FormBehavior , MAEntryModel , MAEntryGLALookupModel , MA3EntryLeaseLookupModel , FormTemplate ) {
		
		return function( region , MAEntriesCollectionInstance , modelToCopy , disableCancel , fnExitAction ) {
			/*create a new model instance or copy provided model*/
			var model = modelToCopy ? modelToCopy.clone() : new MAEntryModel();
			
			/*decision to prevent cancel is provided from calling scope*/
			model.set( "cancelNotAllowed" , disableCancel );
			
			/*configure Form Control*/
			var Form_MA3Entry = new (Marionette.View.extend({
				model: model
				,template: FormTemplate
				,behaviors: [ FormBehavior ]
				,onInputChange: function( view , el ) {
					log( "Form_MA3Entry onInputChange" );
					
					/*remove any non decimal chars from payment amount value*/
					if( el.id == "paymentAmount" ) {
						el.value = el.value.replace( /[^\d\.]/g , "" );
					}
					else if( el.id == "leaseNumber" ) {
						el.value = el.value.replace( /[^\d]/g , "" );
					}
					
					/*save the entered value to the model*/
					if( [ "glaCode" ].indexOf( el.id ) == -1 )
						view.model.set( el.id , el.value );
					
					if( el.id == "reportProductType" ) {
						log( "ReportProductType changed" );
						if( el.value != "" ) {
							/*lookup GLACode based on ReportProductType*/
							/*this uses a Backbone.Model built specifically for this purpose*/
							var tmpGLALookup = new MAEntryGLALookupModel({
								"reportProductType": view.model.get( "reportProductType" ) 
							});
							tmpGLALookup.fetch({
								success: function() {
									/*fill the gla code with fetched data*/
									view.model.set( "glaCode" , tmpGLALookup.get( "code" ) );
									view.$( "#glaCode" ).val( view.model.get( "glaCode" ) );
									/*run validation to make sure GLACode is not red*/
									view.model.isValid( "glaCode" );
								}
							});
						} else {
							/*clear the GLA if they cleared the ReportProductType*/
							view.model.set( "glaCode" , "" );
							view.$( "#glaCode" ).val( "" );
						}
					} else if( el.id == "leaseNumber" && el.value != "" ) {
						log( "LeaseNumber lookup" );
						var tmpLeaseLookup = new MA3EntryLeaseLookupModel({
							"leaseNumber": "HM" + el.value
						});
						tmpLeaseLookup.fetch({
							success: function() {
								if( ! tmpLeaseLookup.get( "valid" ) ) {
									view.$( "#" + el.id ).focus().select();
									App.trigger( "error" , "The Lease Number entered is not a valid lease." );
								}
							}
						});
					}
				}
				,onSave: function( model ) {
					log( "Form_MA3Entry save" );
					if( MAEntriesCollectionInstance.where( model.attributes ).length > 0 ) {
						App.trigger( "error" , "That entry is a duplicate. Please enter new entry information." );
					} else {
						model.set( "leaseNumber" , "HM" + model.get( "leaseNumber" ).replace( /[^\d]/g , "" ) );
						/*add the new model to the collection*/
						MAEntriesCollectionInstance.add( model );
						/*clear away the new entry form*/
						region.empty();
						/*call function provided by calling scope*/
						fnExitAction();
					}
				}
				,onCancel: function( view ) {
					log( "Form_MA3Entry cancel" );
					/*clear away the new entry form*/
					region.empty();
					/*call function provided by calling scope*/
					fnExitAction();
				}
			}));
			
			region.show( Form_MA3Entry );
			$( "#leaseNumber" ).focus();
		}
	}
);