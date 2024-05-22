define([ "entity/person" ],
	function( PersonModel ) {
		var PeopleCollection = Backbone.Collection.extend({
			model: PersonModel
			,url: "zionrest/fcnGetPersons"
			,fetch: function( options ) {
				this.reset( [
					{ "EmployeeID" : 1 , "FName" : "Jordan" , "LName" : "King" , "Program" : "ETS" }
					,{ "EmployeeID" : 2 , "FName" : "Landon" , "LName" : "Camp" , "Program" : "ETS" }
					,{ "EmployeeID" : 3 , "FName" : "Patrick" , "LName" : "Holland" , "Program" : "TES" }
				] );
				if( options && options.success )
					options.success( this );
				this.trigger( "change" );
			}
		});
		return new PeopleCollection();
	}
);