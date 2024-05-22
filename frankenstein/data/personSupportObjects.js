define([ "entity/personSupportObject" ],
	function( PersonSupportObject ) {
		var PersonSupportObjectCollection = Backbone.Collection.extend({
			model: PersonSupportObject
			,url: "zionrest/fcnGetPersonsSupportObjects"
			,fetchRelated: function( id , options ) {
				var tmp = this.url;
				this.url = this.url + "/" + id
				this.fetch( options );
				_.each( this.models , function( model ) {
					model.set( "ObjName" , model.get( "ObjName" ) + "-" + id );
				});
				this.url = tmp;
			}
			,fetch: function( options ) {
				this.reset( [
					{ "ObjName" : "ObjName 1" , "SupType" : "SupType 1" }
					,{ "ObjName" : "ObjName 2" , "SupType" : "SupType 2" }
					,{ "ObjName" : "ObjName 3" , "SupType" : "SupType 3" }
				] );
				if( options && options.success )
					options.success( this );
				this.trigger( "change" );
			}
		});
		return new PersonSupportObjectCollection();
	}
);