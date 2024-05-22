define([ "app" , "logic/company" , "layout" , "form/control" , "entity/MineralAwardCompanyInstance" , "entity/MineralAwardReportsInstance" , "entity/MineralAwardEntriesInstance" , "validation" ], 
function( App , BusinessLogic , MainLayout , FormControl , CompanyInstance , ReportsInstance , MAEntriesCollectionInstance ) {

	describe('Company : ', function() {
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
			this.logic.showMineralAwardGLO3Company = BusinessLogic;//new BusinessLogic();
			CompanyInstance.noserver = true;
			
		});
		afterEach( function() {
			CompanyInstance.noserver = false;
		});
		
		describe('Data', function() {
			beforeEach(function() {
				if( FormControl.prototype.render != "render" )
					sinon.stub( FormControl.prototype , "render" );
			});
			afterEach( function() {
				if( FormControl.prototype.render == "render" )
					FormControl.prototype.render.restore();
			});
			it('Loads company from BAN', function( done ) {
				CompanyInstance.reset();
				sinon.stub( CompanyInstance , "fetch" );
				this.logic.showMineralAwardGLO3Company( '33333' , encodeURIComponent( '01/11/2017' ) );
				setTimeout(function() {
					expect(CompanyInstance.fetch.calledOnce ).toEqual( true );
					CompanyInstance.reset();
					CompanyInstance.fetch.restore();
					done();
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});
			it('Loads reports from report number', function( done ) {
				ReportsInstance.reset([]);
				sinon.stub( ReportsInstance , "fetch" );
				this.logic.showMineralAwardGLO3Company( 'P2013471846' );
				setTimeout(function() {
					expect(ReportsInstance.fetch.calledOnce ).toEqual( true );
					ReportsInstance.fetch.restore();
					done();
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});
			it('Empties CompanyInstance and EntriesCollection when new', function( done ) {
				CompanyInstance.set( "ban" , "324234" );
				MAEntriesCollectionInstance.reset( [ { "leaseNumber" : "11" , "reportProductType" : "Sand, Gravel, Clay" , "glaCode" : "0111" , "productionYearMonth" : "201607" , "paymentAmount" : 99.11 } ] );
				this.logic.showMineralAwardGLO3Company();
				setTimeout(function() {
					expect( CompanyInstance.get( "ban" ) ).toEqual( null );
					expect( MAEntriesCollectionInstance.length ).toEqual( 0 );
					done();
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});
		});
		
		describe('Creates company form', function() {
			beforeEach(function() {
				this.logic.showMineralAwardGLO3Company();
			});
			it('Creates a form', function( done ) {
				setTimeout(function() {
					expect( $( ".form-horizontal" ).length ).toEqual( 1 );
					done();
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});
			it('Creates a form with BAN input', function( done ) {
				//var self = this;
				setTimeout(function() {
					//log( self.tmpEle.html() );
					expect( $( "input#ban" ).length ).toEqual( 1 );
					done();
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});
			it('Creates a form with ReceivedDate input', function( done ) {
				setTimeout(function() {
					expect( $( "input#receivedDate" ).length ).toEqual( 1 );
					done();
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});
			it('Creates a form with disabled ReportingCompanyTaxId input', function( done ) {
				setTimeout(function() {
					expect( $( "input#reportingCompanyTaxId:disabled" ).length ).toEqual( 1 );
					done();
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});
			it('Creates a form with disabled CompanyName input', function( done ) {
				setTimeout(function() {
					expect( $( "input#companyName:disabled" ).length ).toEqual( 1 );
					done();
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});
			it('Creates a form with disabled CustomerId input', function( done ) {
				setTimeout(function() {
					expect( $( "input#customerId:disabled" ).length ).toEqual( 1 );
					done();
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});

		});
		
		
		describe('Actions for existing report', function() {
			beforeEach(function() {
				ReportsInstance.noserver = true;
				this.logic.showMineralAwardGLO3Company( 'P2013471846' );
				sinon.stub( App , "navigate" );
				sinon.stub( Backbone.Validation , "bind" );
			});
			afterEach( function() {
				App.navigate.restore();
				Backbone.Validation.bind.restore();
				CompanyInstance.reset();
				MAEntriesCollectionInstance.reset( [] );
				ReportsInstance.reset( [] );
				ReportsInstance.noserver = false;
			});
			it('Goes to report entry upon save', function( done ) {
				setTimeout(function() {
					var expectedNavigation = "report/P2013471846";
					$( ".save" ).click();
					expect( App.navigate.calledOnce ).toEqual( true );
					expect( App.navigate.getCall(0).args[0] ).toEqual( expectedNavigation );
					done();
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});
			it('Puts back old data on cancel', function( done ) {
				setTimeout(function() {
					var origVal = $( "input#ban" ).val();
					log( CompanyInstance.attributes );
					$( "input#ban" ).val( '666' ).change();
					log( CompanyInstance.attributes );
					expect( CompanyInstance.get( "ban" ) ).toEqual( '666' );
					log( $( ".cancel" ).length);
					$( ".cancel" ).click();
					log( CompanyInstance.attributes );
					expect( CompanyInstance.get( "ban" ).toString() ).toEqual( origVal );
					done();
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});
			it('Goes to report entry on cancel', function( done ) {
				setTimeout(function() {
					var expectedNavigation = "report/P2013471846";
					$( ".cancel" ).click();
					expect( App.navigate.calledOnce ).toEqual( true );
					expect( App.navigate.getCall(0).args[0] ).toEqual( expectedNavigation );
					done();
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});
		});
		describe('Action for new report w/ company', function() {
			beforeEach(function() {
				this.logic.showMineralAwardGLO3Company( '33333' , encodeURIComponent( '01/11/2017' ) );
				sinon.stub( App , "navigate" );
				sinon.stub( Backbone.Validation , "bind" );
			});
			afterEach( function() {
				App.navigate.restore();
				Backbone.Validation.bind.restore();
				CompanyInstance.reset();
				MAEntriesCollectionInstance.reset( [] );
			});
			it('Goes to report entry upon save', function( done ) {
				setTimeout(function() {
					var expectedNavigation = "report/33333/" + encodeURIComponent( '01/11/2017' );
					$( ".save" ).click();
					expect( App.navigate.calledOnce ).toEqual( true );
					expect( App.navigate.getCall(0).args[0] ).toEqual( expectedNavigation );
					done();
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});
			it('Goes to report entry upon cancel', function( done ) {
				setTimeout(function() {
					var expectedNavigation = "report/33333/" + encodeURIComponent( '01/11/2017' );
					$( ".cancel" ).click();
					expect( App.navigate.calledOnce ).toEqual( true );
					expect( App.navigate.getCall(0).args[0] ).toEqual( expectedNavigation );
					done();
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});
		});
		
		describe('Action for new report & new company', function() {
			beforeEach(function() {
				this.logic.showMineralAwardGLO3Company();
				sinon.stub( App , "navigate" );
				sinon.stub( Backbone.Validation , "bind" );
			});
			afterEach( function() {
				App.navigate.restore();
				Backbone.Validation.bind.restore();
				CompanyInstance.reset();
				MAEntriesCollectionInstance.reset( [] );
			});
			it('Goes to report entry upon save', function( done ) {
				setTimeout(function() {
					$( "input#ban" ).val( '34333' ).change();
					$( "input#receivedDate" ).val( '01/11/2017' ).change();
					var expectedNavigation = "report/34333/" + encodeURIComponent( '01/11/2017' );
					$( ".save" ).click();
					expect( App.navigate.calledOnce ).toEqual( true );
					expect( App.navigate.getCall(0).args[0] ).toEqual( expectedNavigation );
					done();
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});
			it('Updates company fields upon BAN change', function( done ) {
				setTimeout(function() {
					$( "input#ban" ).val( '34333' ).change();
					setTimeout(function() {
						expect( $( "input#reportingCompanyTaxId" ).val() ).not.toEqual( "" );
						expect( $( "input#companyName" ).val() ).not.toEqual( "" );
						expect( $( "input#customerId" ).val() ).not.toEqual( "" );
						done();
					}, 100);
				}, 100 );/*wait for requirejs to load files inside logic function*/
			});
		});
	});
	
	

});