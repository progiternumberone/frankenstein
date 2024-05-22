define([ "entity/MineralAwardReport" ],
	function( model ) {
		var coll = Backbone.Collection.extend({
			model: model
			,url: "http://devcf.glo.texas.gov/rest/IgorService/report"
			,getReport: function( ReportNumber ) {
				return this.findWhere( { reportNumber: ReportNumber } );
			}
			,getEntries: function( ReportNumber ) {
				var entries = [];
				var tmp = this.findWhere( { reportNumber: ReportNumber } );
				if( tmp )
					 entries = tmp.get( "entries" );
				return entries;
			}
			,getCompany: function( ReportNumber ) {
				var company = null;
				var tmp = this.findWhere( { reportNumber: ReportNumber } );
				if( tmp ) {
					company = tmp.get( "company" );
					company.reportNumber = ReportNumber;
				}
				else
					company = {};
				return company;
			}
			
			,fillFakeData: function( options ) {
				log( "MineralAwardReports: fill fake data" );
				this.reset([{"reportNumber":"P2014895531","reportAmount":0.0,"userName":"GMARTINE","company":{"reportNumber":"P2014895531","receivedDate":"4/10/2014","ban":2070,"reportingCompanyTaxId":"17413896063","companyName":"Texas Architectural Aggregate INC","customerId":"C000047449"},"entries":[{"leaseNumber":"HM086324","reportProductType":"OTHER PSF HARD MINER","glaCode":"3335005","productionYearMonth":"201403","paymentAmount":184.4000}]},{"reportNumber":"P2012348742","reportAmount":0.0,"userName":"GMARTINE","company":{"reportNumber":"P2012348742","receivedDate":"9/28/2012","ban":2734,"reportingCompanyTaxId":"18611334071","companyName":"Jobe Materials, L.P.","customerId":"C000044723"},"entries":[{"leaseNumber":"HM104945","reportProductType":"OTHER PSF HARD MINER","glaCode":"3335005","productionYearMonth":"201208","paymentAmount":16259.2000}]},{"reportNumber":"P2014803045","reportAmount":0.0,"userName":"GMARTINE","company":{"reportNumber":"P2014803045","receivedDate":"1/16/2014","ban":2901,"reportingCompanyTaxId":"17603061056","companyName":"Cemex Construction Materials LP","customerId":"C000048205"},"entries":[{"leaseNumber":"HM099047","reportProductType":"SAND, GRAVEL, CLAY,","glaCode":"3344009","productionYearMonth":"201312","paymentAmount":10814.9900}]},{"reportNumber":"P2013471846","reportAmount":0.0,"userName":"JMARTINE","company":{"reportNumber":"P2013471846","receivedDate":"2/20/2013","ban":3050,"reportingCompanyTaxId":"12080755460","companyName":"Rcl Rocks LLC","customerId":"C000045900"},"entries":[{"leaseNumber":"HM107721","reportProductType":"OTHER PSF HARD MINER","glaCode":"3335005","productionYearMonth":"201301","paymentAmount":70531.5800},{"leaseNumber":"HM107721","reportProductType":"COAL","glaCode":"3334001","productionYearMonth":"201301","paymentAmount":70531.5800},{"leaseNumber":"HM107721","reportProductType":"OTHER PSF HARD MINER","glaCode":"3335005","productionYearMonth":"201401","paymentAmount":70531.5000},{"leaseNumber":"HM107721","reportProductType":"COAL","glaCode":"3334001","productionYearMonth":"201501","paymentAmount":70531.5800}]},{"reportNumber":"P20151522664","reportAmount":0.0,"userName":"JMARTINE","company":{"reportNumber":"P20151522664","receivedDate":"8/10/2015","ban":2073,"reportingCompanyTaxId":"18302812112","companyName":"American Talc Company","customerId":"C000038538"},"entries":[{"leaseNumber":"HM109562","reportProductType":"SAND, GRAVEL, CLAY,","glaCode":"3344009","productionYearMonth":"201505","paymentAmount":318.7100}]}]);
				if( options && options.success )
					options.success( this );
				this.trigger( "change" );
			}
			,fetch: function( options ) {
				var self = this;
				options = options ? options : {};
				if( ! arguments || arguments.length == 0 )
					arguments = [ options ];
				/*temporarily handle error and fill in data and then call success*/
				if( !options.error ) {
					options.error = function() {
						self.fillFakeData( options );
					}
				}
				if( ! this.noserver )
					Backbone.Model.prototype.fetch.apply( this , arguments );
				else
					self.fillFakeData( options );
				return this;
			}
		});
		return new coll();
	}
);