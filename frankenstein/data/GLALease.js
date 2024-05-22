define([],
	function() {
		var LeaseModel = Backbone.Model.extend({
			urlRoot: "http://localhost:55483/api/GLALease/"
			,defaults: {
				justSaved: false
				,LeaseStatus: ""
				,Category: ""
				,AutoBillFlag: ""
				,PaymentFrequency: ""
				,PeriodicPaymentAmount: ""
				,ControlNums: []
				,GLAs: []
				,username: "not authenticated"
			}
			,getGLAPercentTotal: function() {
				var glas = this.get( "GLAs" );
				var total = 0;
				for( var i = 0; i < glas.length; i++ ) {
					total += parseInt( glas[ i ].Percent );
				}
				log( "LeaseModel: getGLAPercentTotal=" + total );
				return total;
			}
			
			/*temporary overrides for ui dev*/
			,fetch: function( options ) {
				if( options.error && this.get( "id" ) == 0 )
					options.error( this );
				else {
					this.set(
						{"LeaseNumber":"SL20050021","LeaseStatus":"Active","Category":"Coastal","AutoBillFlag":"Monthly","PaymentFrequency":"Monthly","PeriodicPaymentAmount":1778.000000,"ControlNums":[{"ControlNumber":"02-015152"}],"GLAs":[{"RentalGLACode":"3341001","Percent":0.0},{"RentalGLACode":"3341002","Percent":50.00000000},{"RentalGLACode":"3342004","Percent":0.0},{"RentalGLACode":"3746001","Percent":50.00000000},{"RentalGLACode":"3746005","Percent":0.0},{"RentalGLACode":"3746008","Percent":0.0}]}
					);
					if( options.success )
						options.success( this );
					this.trigger( "change" );
				}
			}
			,save: function( attrs , options ) {
				alert( "TO DO: create save - " + JSON.stringify( this.get( "GLAs" ) ) );
				this.set( "justSaved" , true );
				if( options.success )
					options.success( this );
				this.trigger( "sync" );
			}
		});
		return LeaseModel;
	}
);