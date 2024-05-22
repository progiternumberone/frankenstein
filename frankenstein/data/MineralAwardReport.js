define([ "entity/MineralAwardCompany" , "entity/MineralAwardEntries" ],
	function( CompanyModel , EntriesColl ) {
		var MA3Report = Backbone.Model.extend({
			urlRoot: "http://devcf.glo.texas.gov/rest/IgorService/report"
			,idAttribute: "reportNumber"
			,defaults: {
				reportNumber: null
				,userName: ""
				,entries: new EntriesColl().attributes
				,company: new CompanyModel().attributes
				,reportAmount: 0
				,isComplete: false
			}
			/*temporary overrides for ui dev*/
			/*,fetch: function( options ) {
				
				if( options && options.error && this.get( "BAN" ) == "" )
					options.error( this );
				else {
					this.set(
						{ "LeaseNumber" : "11111" , "ReportProductType" : "Sand" , "GLACode" : "0111" , "ProductionYearMonth" : "201607" , "PaymentAmount" : 99.11 }
					);
					if( options && options.success )
						options.success( this );
					this.trigger( "change" );
				}
			}*/
			,save: function( attrs , options ) {
				var self = this;
				options = options ? options : {};
				if( ! arguments || arguments.length == 0 )
					arguments = [ options ];
				/*temporarily handle error and fill in data and then call success*/
				if( !options.error ) {
					options.error = function() {
						if( self.isNew() ) {
							var rand = Math.floor(Math.random() * (99 - 1)) + 1;
							self.set( "reportNumber" , rand.toString() );
						}
						if( options && options.success )
							options.success( self );
						self.trigger( "sync" );
					}
				}
				Backbone.Model.prototype.save.apply( this , arguments );
				return this;
			}
		});
		return MA3Report;
	}
);