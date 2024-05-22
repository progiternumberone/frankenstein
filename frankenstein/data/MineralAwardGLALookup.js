/*this model is specifically for the purpose of getting the GLA code for a particular product type*/
define([ "backbone" ],
	function( Backbone ) {
		var MA3GLALookup = Backbone.Model.extend({
			urlRoot: "http://devcf.glo.texas.gov/rest/IgorService/gla/"
			,idAttribute: "reportProductType"
			,defaults: {
				reportProductType: ""
				,code: ""
			}
			
			/*temporary overrides for ui dev*/
			,fetch: function( options ) {
				if( options && options.error && this.get( "reportProductType" ) == "" )
					options.error( this , "" , { "error" : "reportProductType must me set to get GLA Code" } );
				else {
					var self = this;
					options = options ? options : {};
					if( ! arguments || arguments.length == 0 )
						arguments = [ options ];
					/*temporarily handle error and fill in data and then call success*/
					if( !options.error ) {
						options.error = function() {
							var rand = Math.floor(Math.random() * (99 - 1)) + 1;
							self.set(
								{ "code" : "01" + rand.toString() }
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
		return MA3GLALookup;
	}
);