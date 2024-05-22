define(["validation"],
	function() {
		var PersonModel = Backbone.Model.extend({
			urlRoot: "zionrest/fcnGetObjectsByPerson/"
			,idAttribute: "EmployeeID"
			,defaults: {
				FName: ""
				,LName: ""
				,Program: ""
				,EmployeeID: 0
			}
			,validation: {
				FName: {
					required: true
				}
			}
			/*temporary overrides for ui dev*/
			,fetch: function( options ) {
				
				if( options && options.error && this.get( "id" ) == 0 )
					options.error( this );
				else {
					this.set(
						{ "EmployeeID" : 1 , "FName" : "Jordan" , "LName" : "King" , "Program" : "ETS" }
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
		return PersonModel;
	}
);