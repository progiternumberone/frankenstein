define([ "entity/MineralAwardEntry" ],
	function( model ) {
		var MA3EntryCollection = Backbone.Collection.extend({
			model: model
			//,url: "rest/entries"
			/*,fetch: function( options , diffBan ) {
				this.reset( [
					{ "LeaseNumber" : "11" + diffBan , "ReportProductType" : "Sand, Gravel, Clay" , "GLACode" : "0111" , "ProductionYearMonth" : "201607" , "PaymentAmount" : 99.11 }
					,{ "LeaseNumber" : "22" + diffBan , "ReportProductType" : "Sand, Gravel, Clay" , "GLACode" : "0222" , "ProductionYearMonth" : "201608" , "PaymentAmount" : 99.22 }
					,{ "LeaseNumber" : "33" + diffBan , "ReportProductType" : "Sand, Gravel, Clay" , "GLACode" : "0333" , "ProductionYearMonth" : "201609" , "PaymentAmount" : 99.33 }
					,{ "LeaseNumber" : "44" + diffBan , "ReportProductType" : "Sulphur" , "GLACode" : "0444" , "ProductionYearMonth" : "201610" , "PaymentAmount" : 99.44 }
				] );
				if( options && options.success )
					options.success( this );
				this.trigger( "change" );
			}*/
		});
		return MA3EntryCollection;
	}
);