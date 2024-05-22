define([ "app" , "logic/reports" , "layout" , "masterDetail/control" , "entity/MineralAwardCompanyInstance" , "entity/MineralAwardReportsInstance" , "entity/MineralAwardEntriesInstance" ], 
function( App , BusinessLogic , MainLayout , MasterDetailControl , CompanyInstance , ReportsInstance , MAEntriesCollectionInstance ) {

	describe('Reports : ', function() {
		beforeEach(function() {
			if( $("#main-content-region").length == 0 ) {
				this.tmpEle = $( '<div id="main-content-region">abcde</div>' );
				$(document.body).append( this.tmpEle );
				/*add the main layout to the DOM*/
				App.showView( MainLayout );
			} else {
				this.tmpEle = $("#main-content-region");
			}
			this.logic = {};
			this.logic.showMineralAwardGLO3Reports = BusinessLogic;//new BusinessLogic();
			ReportsInstance.noserver = true;
		});
		afterEach( function() {
			ReportsInstance.noserver = false;
		});
		describe('Creates Grid', function() {
			beforeEach(function() {
				$("#page1Region").html('');
				if( MasterDetailControl.prototype.render == "render" )
				MasterDetailControl.prototype.render.restore();
				this.logic.showMineralAwardGLO3Reports();
			});
			it('Has a row for each report', function( done ) {
				//var self = this;
				setTimeout(function() {
					expect( $( "table" ).length ).toEqual( 1 );
					expect( $( "tbody tr" ).length ).toEqual( ReportsInstance.length );
					done();
				}, 200 );/*wait for requirejs to load files inside logic function*/
			});
			it('Edit links link to report entry with report num in url', function( done ) {
				var self = this;
				sinon.stub( App , "navigate" );
				setTimeout(function() {
					var expectedNavigation = "report/" + ReportsInstance.at( 0 ).get( "reportNumber" );
					$( $( "a.view" )[ 0 ] ).click();
					expect( App.navigate.calledOnce ).toEqual( true );
					expect( App.navigate.getCall(0).args[0] ).toEqual( expectedNavigation );
					App.navigate.restore();
					done();
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});
			it('Print links link to report server with report num in url', function( done ) {
				var self = this;
				sinon.stub( window , "open" );
				setTimeout(function() {
					$( $( "a.print" )[ 0 ] ).click();
					expect( window.open.calledOnce ).toEqual( true );
					expect( window.open.getCall(0).args[0] ).toContain( "gloreports" );
					expect( window.open.getCall(0).args[0] ).toContain( ReportsInstance.at( 0 ).get( "reportNumber" ) );
					window.open.restore();
					done();
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});
		});
		describe('Data', function() {
			beforeEach(function() {
				if( MasterDetailControl.prototype.render != "render" )
					sinon.stub( MasterDetailControl.prototype , "render" );
			});
			afterEach( function() {
				if( MasterDetailControl.prototype.render == "render" )
					MasterDetailControl.prototype.render.restore();
			});
			it('Loads reports', function( done ) {
				ReportsInstance.reset([]);
				sinon.stub( ReportsInstance , "fetch" );
				this.logic.showMineralAwardGLO3Reports();
				setTimeout(function() {
					expect(ReportsInstance.fetch.calledOnce ).toEqual( true );
					ReportsInstance.fetch.restore();
					done();
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});
			it('Empties CompanyInstance and EntriesCollection', function( done ) {
				CompanyInstance.set( "ban" , "324234" );
				MAEntriesCollectionInstance.reset( [ { "LeaseNumber" : "11" , "ReportProductType" : "Sand, Gravel, Clay" , "GLACode" : "0111" , "ProductionYearMonth" : "201607" , "PaymentAmount" : 99.11 } ] );
				this.logic.showMineralAwardGLO3Reports();
				setTimeout(function() {
					expect( CompanyInstance.get( "ban" ) ).toEqual( null );
					expect( MAEntriesCollectionInstance.length ).toEqual( 0 );
					done();
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});
		});
	});
});