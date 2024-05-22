define([ "entity/GLALease" ],
	function( LeaseModel ) {
		var LeaseCollection = Backbone.Collection.extend({
			model: LeaseModel
			,url: "http://localhost:55483/api/GLALease/"
			,fetch: function( options ) {
				this.reset([
						{"LeaseNumber":"CE20160038","LeaseStatus":"Active","Category":"Coastal","AutoBillFlag":"None","PaymentFrequency":"None","PeriodicPaymentAmount":0.000000,"ControlNums":[{"ControlNumber":"02-021591"}],"GLAs":[{"RentalGLACode":"3340006","Percent":0.0}]}
						,{"LeaseNumber":"ME20160096","LeaseStatus":"Active","Category":"Uplands","AutoBillFlag":"One-time","PaymentFrequency":"One-time","PeriodicPaymentAmount":1108.000000,"ControlNums":[{"ControlNumber":"01-001542"},{"ControlNumber":"01-001560"}],"GLAs":[{"RentalGLACode":"3340001","Percent":0.0},{"RentalGLACode":"3340002","Percent":0.0},{"RentalGLACode":"3340007","Percent":0.0},{"RentalGLACode":"3340008","Percent":0.0},{"RentalGLACode":"3340011","Percent":0.0},{"RentalGLACode":"3340012","Percent":0.0},{"RentalGLACode":"3340013","Percent":0.0},{"RentalGLACode":"3340014","Percent":0.0},{"RentalGLACode":"3340026","Percent":0.0},{"RentalGLACode":"3340027","Percent":0.0},{"RentalGLACode":"3340029","Percent":0.0},{"RentalGLACode":"3342004","Percent":0.0},{"RentalGLACode":"3746001","Percent":0.0},{"RentalGLACode":"3746005","Percent":0.0},{"RentalGLACode":"3746008","Percent":0.0}]}
						,{"LeaseNumber":"CE20160067","LeaseStatus":"Processing","Category":"Coastal","AutoBillFlag":null,"PaymentFrequency":null,"PeriodicPaymentAmount":null,"ControlNums":[{"ControlNumber":null}],"GLAs":[{"RentalGLACode":"3340006","Percent":0.0}]}
						,{"LeaseNumber":"GE20000001","LeaseStatus":"Active","Category":"Coastal","AutoBillFlag":"One-time","PaymentFrequency":"One-time","PeriodicPaymentAmount":0.000000,"ControlNums":[{"ControlNumber":"01-002998"}],"GLAs":[]}
				]);
				if( options && options.success )
					options.success( this );
				this.trigger( "change" );
			}
		});
		return new LeaseCollection();
	}
);