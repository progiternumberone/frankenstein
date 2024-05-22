/*this model is specifically for the purpose of verifying a lease number exists in the database*/
define([ "backbone" ],
	function( Backbone ) {
		var MA3LeaseLookup = Backbone.Model.extend({
			urlRoot: "http://devcf.glo.texas.gov/rest/IgorService/lease/"
			,idAttribute: "leaseNumber"
			,defaults: {
				leaseNumber: ""
				,valid: false
			}
			
			/*temporary overrides for ui dev*/
			,fetchx: function( options ) {
				if( options && options.error && this.get( "leaseNumber" ) == "" )
					options.error( this , "" , { "error" : "LeaseNumber must me set to verify lease" } );
				else {
					var self = this;
					options = options ? options : {};
					if( ! arguments || arguments.length == 0 )
						arguments = [ options ];
					/*temporarily handle error and fill in data and then call success*/
					if( !options.error ) {
						options.error = function() {
							self.set(
								{ "valid" : true }
							);
							if( options && options.success )
								options.success( self );
							self.trigger( "change" );
						}
					}
					Backbone.Model.prototype.fetch.apply( this , arguments );
					return this;
				}
			}
		});
		return MA3LeaseLookup;
	}
);