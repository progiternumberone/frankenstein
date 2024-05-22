define(["validation"],
	function() {
		var MA3Entry = Backbone.Model.extend({
			/*urlRoot: "zionrest/fcnGetObjectsByPerson/"*/
			/*,idAttribute: "LeaseNumber"*/
			defaults: {
				leaseNumber: ""
				,reportProductType: ""
				,glaCode: ""
				,productionYearMonth: ""
				,paymentAmount: ""
				,cancelNotAllowed: false
			}
			,initialize: function() {
				/*adjust the way the date is delivered by the REST*/
				var tmp = this.get( "productionYearMonth" );
				if( /^\d\d\d\d\d\d$/.test( tmp ) )
					this.set( "productionYearMonth" , tmp.substr( 4 ) + "/" + tmp.substr( 0 , 4 ) );
			}
			,validation: {
				leaseNumber: {
					required: true
				}
				,reportProductType: {
					required: true
				}
				,glaCode: {
					required: true
					,msg: "The GLA Code was not found, please make sure Product Type and Lease Number are correct."
				}
				,productionYearMonth: {
					fn: 'validateYearMonth'
				}
				,paymentAmount: {
					fn: 'validatePaymentAmount'
				}
			}
			,validatePaymentAmount: function( value , attr , computedState ) {
				if( value == "" )
					return "Payment Amount is required"
				else if( /^\$?[\d,]+(\.\d*)?$/.test( value ) === false )
					return "Payment Amount must be a money amount"
			}
			,validateYearMonth: function( value , attr , computedState ) {
				if( value == "" )
					return "Production Month/Year is required"
				else if( 
					/^\d\d\/\d\d\d\d$/.test( value ) === false
					|| parseInt( value.substr( 0 , 2 ) ) < 1
					|| parseInt( value.substr( 0 , 2 ) ) > 12
					|| parseInt( value.substr( 3 ) ) < 1950
					|| parseInt( value.substr( 3 ) ) > 2100
				) {
					return 'Production Month/Year must digits be in format MM/YYYY';
				}
			}
			/*temporary overrides for ui dev*/
			/*,fetch: function( options ) {
				
				if( options && options.error && this.get( "LeaseNumber" ) == "" )
					options.error( this );
				else {
					this.set(
						{ "LeaseNumber" : "11111" , "ReportProductType" : "Sand" , "GLACode" : "0111" , "ProductionYearMonth" : "201607" , "PaymentAmount" : 99.11 }
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
			}*/
		});
		return MA3Entry;
	}
);