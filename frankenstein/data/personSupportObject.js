define([],
	function() {
		var PersonSupportObject = Backbone.Model.extend({
			urlRoot: "zionrest/fcnGetObjectsByPerson/"
			,defaults: {
				ObjName: ""
				,SupType: ""
			}
			/*temporary overrides for ui dev*/
			,fetch: function( options ) {
				
				if( options && options.error && this.get( "id" ) == 0 )
					options.error( this );
				else {
					this.set(
						{ "ObjName" : "ObjName 1" , "SupType" : "SupType 1" }
					);
					if( options && options.success )
						options.success( this );
					this.trigger( "change" );
				}
			}
			,save: function( attrs , options ) {
				alert( "TO DO: create save - " + JSON.stringify( this.attributes ) );
				if( options && options.success )
					options.success( this );
				this.trigger( "sync" );
			}
		});
		return PersonSupportObject;
	}
);