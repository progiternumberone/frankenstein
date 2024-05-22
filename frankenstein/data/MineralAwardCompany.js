define(["validation"],
	function() {
		var MA3Company = Backbone.Model.extend({
			urlRoot: "http://devcf.glo.texas.gov/rest/IgorService/company"
			,idAttribute: "ban"
			,defaults: {
				reportNumber: null
				,ban: null
				,receivedDate: ""
				,reportingCompanyTaxId: ""
				,companyName: ""
				,customerId: ""
			}
			,validation: {
				ban: {
					required: true
					,msg: "BAN is required"
				}
				,receivedDate: {
					required: true
				}
			}
			,reset: function() {
				this.set( this.defaults );
				
			}
			,fillFakeData: function( options ) {
				log( "MineralAwardCompany: fill fake data" );
				this.set( { "reportingCompanyTaxId" : "11111" + this.get( "ban" ) , "companyName" : "The Company Name" , "customerId" : "0111" } );
				if( options && options.success )
					options.success( this );
				this.trigger( "change" );
			}
			/*temporary overrides for ui dev*/
			,fetch: function( options ) {
				
				if( options && options.error && this.get( "ban" ) == null && this.get( "reportNumber" ) == null )
					options.error( this );
				else {
					var self = this;
					options = options ? options : {};
					if( ! arguments || arguments.length == 0 )
						arguments = [ options ];
					if( this.get( "ban" ) != null ) {
						
						/*temporarily handle error and fill in data and then call success*/
						if( !options.error ) {
							options.error = function() {
								self.fillFakeData( options );
							}
						}
						if( ! this.noserver )
							Backbone.Model.prototype.fetch.apply( this , arguments );
						else
							this.fillFakeData( options );
						
					}
					else {
						alert("MineralAwardCompany - this should not happen");
						/*var tmp = this.urlRoot;
						this.urlRoot = "rest/company/reportNum/" + this.get( "ReportNumber" );
						Backbone.Model.prototype.fetch.apply( this , arguments );
						this.urlRoot = tmp;
						
						this.set( { "BAN": "000" + this.get( "ReportNumber" ) , "ReceivedDate": "12/6/2016" , "ReportingCompanyTaxId" : "11111" + this.get( "ReportNumber" ) , "CompanyName" : "The Company Name" , "CustomerId" : "0111" } );
						
						if( options && options.success )
							options.success( this );
						this.trigger( "change" );*/
					}
				}
				return this;
			}
			/*,save: function( attrs , options ) {
				alert( "TO DO: create save - " + JSON.stringify( this.attributes ) );
				if( options && options.success )
					options.success( this );
				this.trigger( "sync" );
				return this;
			}*/
		});
		return MA3Company;
	}
);