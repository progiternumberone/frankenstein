define([ "app" , "logic/report" , "layout" , "stated/control" , "masterDetail/control" , "form/control" , "entity/MineralAwardCompanyInstance" , "entity/MineralAwardReportsInstance" , "entity/MineralAwardEntriesInstance" , "validation" ], 
function( App , BusinessLogic , MainLayout , StatedControl , MasterDetailControl , FormControl , CompanyInstance , ReportsInstance , MAEntriesCollectionInstance ) {
	describe('Report Entry : ', function() {
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
			this.logic.showMineralAwardGLO3Entry = BusinessLogic;//new BusinessLogic();
			CompanyInstance.noserver = true;
			ReportsInstance.noserver = true;
			CompanyInstance.reset();
			ReportsInstance.reset( [] );
			MAEntriesCollectionInstance.reset( [] );
			
			
			sinon.stub( StatedControl.prototype , "render" );
			sinon.stub( StatedControl.prototype , "showState" );
			if( MasterDetailControl.prototype.render != "render" )
				sinon.stub( MasterDetailControl.prototype , "render" );
			sinon.spy( FormControl.prototype , "render" );
			
		});
		afterEach( function() {
			CompanyInstance.noserver = false;
			ReportsInstance.noserver = false;
			
			if( StatedControl.prototype.render == "render" )
				StatedControl.prototype.render.restore();
			if( StatedControl.prototype.showState == "showState" )
				StatedControl.prototype.showState.restore();
			if( FormControl.prototype.render == "render" )
				FormControl.prototype.render.restore();
			if( MasterDetailControl.prototype.render == "render" )
				MasterDetailControl.prototype.render.restore();
		});
		describe('New Report : ', function() {
			beforeEach(function( ) {
				this.ban = "4444";
				this.encodedReceivedDate = "02%2F15%2F2017";
			});
			describe('Data', function() {
				beforeEach(function( done ) {
					sinon.spy( CompanyInstance , "fetch" );
					this.logic.showMineralAwardGLO3Entry( this.ban, this.encodedReceivedDate );
					setTimeout(function() {
						//wait for requirejs to load files inside logic function
						done();
					}, 100 );
				});
				afterEach(function(){
					CompanyInstance.fetch.restore();
				});
				it('Does not load the reports instance', function( ) {
					expect( ReportsInstance.length ).toEqual( 0 );
				});
				it('Loads the company instance', function( ) {
					expect( CompanyInstance.get( "ban" ).toString() ).toEqual( this.ban );
					expect( CompanyInstance.fetch.calledOnce ).toEqual( true );
				});
				it('Loads the entries instance', function( ) {
					expect( MAEntriesCollectionInstance.length ).toEqual( 0 );
				});
			});
			describe('Views', function() {
				it('Shows company detail with edit link', function( done ) {
					this.logic.showMineralAwardGLO3Entry( this.ban, this.encodedReceivedDate );
					var self = this;
					setTimeout(function() {
						expect( $( self.tmpEle.find( "h2" ) ).html().indexOf( "Report for ") ).toEqual( 0 );
						expect( self.tmpEle.find( "a[href='#company/" + self.ban + "/" + self.encodedReceivedDate + "']").length ).toEqual( 1 );
						done();
					}, 100 );
				});
				it('Does not show entries grid', function( done ) {
					MasterDetailControl.prototype.render.restore();
					this.logic.showMineralAwardGLO3Entry( this.ban, this.encodedReceivedDate );
					setTimeout(function() {
						expect( $( "table" ).length ).toEqual( 0 );
						done();
					}, 100 );
				});
				it('Does show empty exit button', function( done ) {
					MasterDetailControl.prototype.render.restore();
					this.logic.showMineralAwardGLO3Entry( this.ban, this.encodedReceivedDate );
					setTimeout(function() {
						expect( $( "#page2Region button" ).length ).toEqual( 1 );
						done();
					}, 100 );
				});
				it('Shows actions state control', function( done ) {
					StatedControl.prototype.render.restore();
					this.logic.showMineralAwardGLO3Entry( this.ban, this.encodedReceivedDate );
					setTimeout(function() {
						expect( $( ".statedContainer" ).length ).toEqual( 1 );
						done();
					}, 100 );
				});
				it('Shows correct state', function( done ) {
					MasterDetailControl.prototype.render.restore();
					StatedControl.prototype.render.restore();
					this.logic.showMineralAwardGLO3Entry( this.ban, this.encodedReceivedDate );
					setTimeout(function() {
						expect( StatedControl.prototype.showState.calledTwice ).toEqual( true );
						expect( StatedControl.prototype.showState.getCall(1).args[0] ).toEqual( 1 );
						done();
					}, 100 );
				});
				it('Shows no saving message', function( done ) {
					MasterDetailControl.prototype.render.restore();
					StatedControl.prototype.render.restore();
					StatedControl.prototype.showState.restore();
					this.logic.showMineralAwardGLO3Entry( this.ban, this.encodedReceivedDate );
					setTimeout(function() {
						expect( $( ".state1 div:visible" ).length ).toEqual( 1 );
						done();
					}, 100 );
				});
			});
			describe('Empty Grid', function() {
				beforeEach(function( done ) {
					MasterDetailControl.prototype.render.restore();
					//StatedControl.prototype.render.restore();
					this.logic.showMineralAwardGLO3Entry( this.ban, this.encodedReceivedDate );
					setTimeout(function() {
						done();
					}, 100 );
				});
				it('Add New Record button shows form', function( done ) {
					$( "#page2Region button" ).click();
					setTimeout(function() {
						expect( FormControl.prototype.render.calledOnce ).toEqual( true );
						expect( StatedControl.prototype.showState.calledTwice ).toEqual( true );
						expect( StatedControl.prototype.showState.getCall(1).args[0] ).toEqual( 1 );
						expect( $( '#leaseNumber' ).val() ).toEqual( "" );
						done();
					}, 100 );
				});
				it('Does not show a cancel button on the entry form', function( done ) {
					$( "#page2Region button" ).click();
					setTimeout(function() {
						expect( $( "#page3Region form .cancel" ).length ).toEqual( 0 );
						done();
					}, 100 );
				});
			});
			describe('Entry Form Saving', function() {
				beforeEach(function( done ) {
					MasterDetailControl.prototype.render.restore();
					this.logic.showMineralAwardGLO3Entry( this.ban, this.encodedReceivedDate );
					setTimeout(function() {
						$( "#page2Region button" ).click();
						setTimeout(function() {
							done();
						}, 100 );
					}, 100 );
				});
				it('Saving triggers validation', function( done ) {
					sinon.stub( App , "trigger" );
					$( "#page3Region form .save" ).click();
					setTimeout(function() {
						expect( App.trigger.calledOnce ).toEqual( true );
						expect( App.trigger.getCall(0).args[0] ).toEqual( "error" );
						App.trigger.restore();
						done();
					}, 100 );
				});
				it('Saving unique adds to the entries collection', function( done ) {
					sinon.spy( MAEntriesCollectionInstance , "add" );
					var fakeServer = sinon.fakeServer.create();
					fakeServer.respondWith( [200, { "Content-Type": "text/html" }, '{ "valid": false }'] );
					$( '#leaseNumber' ).val( '11111' ).change();
					fakeServer.respond();
					
					fakeServer.respondWith( [200, { "Content-Type": "text/html" }, '{ "code": "0175" }'] );
					$( '#reportProductType' ).val( 'TALC' ).change();
					fakeServer.respond();
					
					$( '#productionYearMonth' ).val( '01/2017' ).change();
					$( '#paymentAmount' ).val( '555' ).change();
					
					var tmpEntryCt = MAEntriesCollectionInstance.length;
					$( "#page3Region form .save" ).click();
					fakeServer.restore();
					setTimeout(function() {
						expect( MAEntriesCollectionInstance.add.calledOnce ).toEqual( true );
						expect( MAEntriesCollectionInstance.length ).toEqual( tmpEntryCt + 1 );
						MAEntriesCollectionInstance.add.restore();
						done();
					}, 100 );
				});
			});
		});
		describe('Existing Report : ', function() {
			beforeEach(function( ) {
				this.reportnum = "P2014895531";
			});
			describe('Data', function() {
				beforeEach(function( done ) {
					this.logic.showMineralAwardGLO3Entry( this.reportnum );
					setTimeout(function() {
						//wait for requirejs to load files inside logic function
						done();
					}, 100 );
				});
				it('Loads the reports instance', function( ) {
					expect( ReportsInstance.length ).toBeGreaterThan( 0 );
				});
				it('Loads the company instance', function( ) {
					expect( ReportsInstance.at( 0 ).get( "company" ).ban ).toEqual( CompanyInstance.get( "ban" ) );
				});
				it('Loads the entries instance', function( ) {
					expect( MAEntriesCollectionInstance.length ).toBeGreaterThan( 0 );
				});
			});
			
			describe('Views', function() {
				it('Shows company detail with edit link', function( done ) {
					this.logic.showMineralAwardGLO3Entry( this.reportnum );
					var self = this;
					setTimeout(function() {
						//wait for requirejs to load files inside logic function
						expect( $( self.tmpEle.find( "h2" ) ).html().indexOf( "Report for ") ).toEqual( 0 );
						expect( self.tmpEle.find( "a[href='#company/" + self.reportnum + "']").length ).toEqual( 1 );
						done();
					}, 100 );
				});
				it('Shows entries grid with a row for each entry', function( done ) {
					MasterDetailControl.prototype.render.restore();
					this.logic.showMineralAwardGLO3Entry( this.reportnum );
					setTimeout(function() {
						expect( $( "tbody tr" ).length ).toEqual( MAEntriesCollectionInstance.length );
						done();
					}, 100 );
				});
				it('Shows actions state control', function( done ) {
					StatedControl.prototype.render.restore();
					this.logic.showMineralAwardGLO3Entry( this.reportnum );
					setTimeout(function() {
						expect( $( ".statedContainer" ).length ).toEqual( 1 );
						done();
					}, 100 );
				});
				it('Shows correct state', function( done ) {
					StatedControl.prototype.render.restore();
					this.logic.showMineralAwardGLO3Entry( this.reportnum );
					setTimeout(function() {
						expect( StatedControl.prototype.showState.calledOnce ).toEqual( true );
						//expect( StatedControl.prototype.showState.getCall(0).args[0] ).toEqual( 0 );
						done();
					}, 100 );
				});
				it('Shows Save and Save & Complete buttons', function( done ) {
					StatedControl.prototype.render.restore();
					StatedControl.prototype.showState.restore();
					this.logic.showMineralAwardGLO3Entry( this.reportnum );
					setTimeout(function() {
						expect( $( ".save:visible" ).length ).toEqual( 1 );
						expect( $( ".complete:visible" ).length ).toEqual( 1 );
						done();
					}, 100 );
				});
			});
			describe('Entry Grid', function() {
				beforeEach(function( done ) {
					MasterDetailControl.prototype.render.restore();
					this.logic.showMineralAwardGLO3Entry( this.reportnum );
					setTimeout(function() {
						done();
					}, 100 );
				});
				it('Add New Record button shows form', function( done ) {
					$( ".bbGrid-navBar-buttonsContainer button" ).click();
					setTimeout(function() {
						expect( FormControl.prototype.render.calledOnce ).toEqual( true );
						expect( StatedControl.prototype.showState.calledTwice ).toEqual( true );
						expect( $( '#leaseNumber' ).val() ).toEqual( "" );
						expect( StatedControl.prototype.showState.getCall(1).args[0] ).toEqual( 1 );
						done();
					}, 100 );
				});
				it('Copy button copies record into, and shows, form', function( done ) {
					$( $( $( "tbody tr" )[ 0 ] ).find( ".bbGrid-actions-cell a" )[ 0 ] ).click();
					setTimeout(function() {
						expect( FormControl.prototype.render.calledOnce ).toEqual( true );
						expect( StatedControl.prototype.showState.getCall(1).args[0] ).toEqual( 1 );
						expect( $( '#leaseNumber' ).val() ).toEqual( MAEntriesCollectionInstance.at( 0 ).get( "leaseNumber" ).replace( /[^\d]/g , '' ) );
						done();
					}, 100 );
				});
				it('Canceling the new record clears the form', function( done ) {
					$( ".bbGrid-navBar-buttonsContainer button" ).click();
					setTimeout(function() {
						$( "#page3Region form .cancel" ).click()
						expect( StatedControl.prototype.showState.getCall(2).args[0] ).toEqual( 0 );
						expect( $( "#page3Region" ).html() ).toEqual( "" );
						done();
					}, 100 );
				});
			});
			describe('Report Action Buttons', function() {
				beforeEach(function( done ) {
					MasterDetailControl.prototype.render.restore();
					StatedControl.prototype.render.restore();
					StatedControl.prototype.showState.restore();
					
					sinon.stub( Backbone.Model.prototype , "save" ) 
					sinon.spy( StatedControl.prototype , "showState" );
					this.logic.showMineralAwardGLO3Entry( this.reportnum , false );
					setTimeout(function() {
						done();
					}, 100 );
				});
				afterEach(function() {
					Backbone.Model.prototype.save.restore();
				});
				it('Save calls save', function( ) {// done ) {
					$( ".state0 .save" ).click();
					expect( Backbone.Model.prototype.save.calledOnce ).toEqual( true );
					expect( Backbone.Model.prototype.save.getCall(0).args[0].entries ).toEqual( MAEntriesCollectionInstance.toJSON() );
					expect( Backbone.Model.prototype.save.getCall(0).args[0].company ).toEqual( CompanyInstance.toJSON() );
					expect( Backbone.Model.prototype.save.getCall(0).args[0].isComplete ).toEqual( false );
					expect( Backbone.Model.prototype.save.getCall(0).args[0].reportAmount ).toEqual( 0 );
				});
				it('Save & Complete shows the completion form', function() {
					$( ".state0 .complete" ).click();
					expect( StatedControl.prototype.showState.calledThrice ).toEqual( true );
					expect( $( "#total" ).length ).toEqual( 1 );
				});
				it('Complete calls save with complete flag', function() {
					$( ".state0 .complete" ).click();
					var total = 0;
					MAEntriesCollectionInstance.each( function( entry ) {
						total += parseFloat( entry.get( "paymentAmount" ) );
						total = parseFloat( total.toFixed(2) );
					});
					$( "#total" ).val( total ).change();
					$( ".state2 .save" ).click();
					expect( Backbone.Model.prototype.save.calledOnce ).toEqual( true );
					expect( Backbone.Model.prototype.save.getCall(0).args[0].entries ).toEqual( MAEntriesCollectionInstance.toJSON() );
					expect( Backbone.Model.prototype.save.getCall(0).args[0].company ).toEqual( CompanyInstance.toJSON() );
					expect( Backbone.Model.prototype.save.getCall(0).args[0].isComplete ).toEqual( true );
					expect( Backbone.Model.prototype.save.getCall(0).args[0].reportAmount ).toEqual( total.toString() );
				});
				it('Complete shows error when totals do not match', function() {
					sinon.stub( App , "trigger" );
					$( ".state0 .complete" ).click();
					var total = 0;
					$( "#total" ).val( total ).change();
					$( ".state2 .save" ).click();
					expect( App.trigger.calledOnce ).toEqual( true );
					expect( App.trigger.getCall(0).args[0] ).toEqual( "error" );
					expect( App.trigger.getCall(0).args[1] ).toEqual( "The entries' amounts do not sum up to the report total. Please verify the entries." );
					App.trigger.restore();
				});
			});
			
			describe('Entry Form Action', function() {
				beforeEach(function( done ) {
					MasterDetailControl.prototype.render.restore();
					this.logic.showMineralAwardGLO3Entry( this.reportnum );
					setTimeout(function() {
						done();
					}, 100 );
				});
				it('Validates LeaseNumber against server', function( done ) {
					$( $( $( "tbody tr" )[ 0 ] ).find( ".bbGrid-actions-cell a" )[ 0 ] ).click();
					setTimeout(function() {
						var fakeServer = sinon.fakeServer.create();
						$( '#leaseNumber' ).val( '11111' ).change();
						expect(fakeServer.requests[0].method).toEqual("GET");
						expect(fakeServer.requests[0].url.indexOf( "/HM11111" ) ).toBeGreaterThan(0);
						fakeServer.respond();
						fakeServer.restore();
						done();
					}, 100 );
				});
				it('Errors if the LeaseNumber is invalid', function( done ) {
					$( $( $( "tbody tr" )[ 0 ] ).find( ".bbGrid-actions-cell a" )[ 0 ] ).click();
					setTimeout(function() {
						sinon.stub( App , "trigger" );
						var fakeServer = sinon.fakeServer.create();
						fakeServer.respondWith( [200, { "Content-Type": "text/html" }, '{ "valid": false }'] );
						$( '#leaseNumber' ).val( '33333' ).change();
						fakeServer.respond();
						expect( App.trigger.calledOnce ).toEqual( true );
						expect( App.trigger.getCall(0).args[0] ).toEqual( "error" );
						fakeServer.restore();
						App.trigger.restore();
						done();
					}, 100 );
				});
				it('Looks up GLA for ReportProductType from server', function( done ) {
					$( $( $( "tbody tr" )[ 0 ] ).find( ".bbGrid-actions-cell a" )[ 0 ] ).click();
					setTimeout(function() {
						var fakeServer = sinon.fakeServer.create();
						$( '#reportProductType' ).val( 'TALC' ).change();
						expect(fakeServer.requests[0].method).toEqual("GET");
						expect(fakeServer.requests[0].url.indexOf( "/TALC" ) ).toBeGreaterThan(0);
						fakeServer.respond();
						fakeServer.restore();
						done();
					}, 100 );
				});
				it('Fill in GLA code from server', function( done ) {
					$( $( $( "tbody tr" )[ 0 ] ).find( ".bbGrid-actions-cell a" )[ 0 ] ).click();
					setTimeout(function() {
						var fakeServer = sinon.fakeServer.create();
						fakeServer.respondWith( [200, { "Content-Type": "text/html" }, '{ "code": "0175" }'] );
						$( '#reportProductType' ).val( 'TALC' ).change();
						fakeServer.respond();
						expect( $( "#glaCode" ).val() ).toEqual( "0175" );
						fakeServer.restore();
						done();
					}, 100 );
				});
			});
			describe('Entry Form Saving', function() {
				beforeEach(function( done ) {
					MasterDetailControl.prototype.render.restore();
					this.logic.showMineralAwardGLO3Entry( this.reportnum );
					setTimeout(function() {
						done();
					}, 100 );
				});
				it('Saving triggers validation', function( done ) {
					$( ".bbGrid-navBar-buttonsContainer button" ).click();
					setTimeout(function() {
						sinon.stub( App , "trigger" );
						$( "#page3Region form .save" ).click();
						setTimeout(function() {
							expect( App.trigger.calledOnce ).toEqual( true );
							expect( App.trigger.getCall(0).args[0] ).toEqual( "error" );
							App.trigger.restore();
							done();
						}, 100 );
					}, 100 );
				});
				it('Saving duplicate triggers duplicate error', function( done ) {
					$( $( $( "tbody tr" )[ 0 ] ).find( ".bbGrid-actions-cell a" )[ 0 ] ).click();
					setTimeout(function() {
						sinon.stub( App , "trigger" );
						$( "#page3Region form .save" ).click();
						setTimeout(function() {
							expect( App.trigger.calledOnce ).toEqual( true );
							expect( App.trigger.getCall(0).args[1] ).toEqual( "That entry is a duplicate. Please enter new entry information." );
							App.trigger.restore();
							done();
						}, 100 );
					}, 100 );
				});
				it('Saving unique adds to the entries collection', function( done ) {
					$( $( $( "tbody tr" )[ 0 ] ).find( ".bbGrid-actions-cell a" )[ 0 ] ).click();
					setTimeout(function() {
						sinon.spy( MAEntriesCollectionInstance , "add" );
						var tmpEntryCt = MAEntriesCollectionInstance.length;
						$( '#leaseNumber' ).val( '11111' ).change();
						$( "#page3Region form .save" ).click();
						setTimeout(function() {
							expect( MAEntriesCollectionInstance.add.calledOnce ).toEqual( true );
							expect( MAEntriesCollectionInstance.length ).toEqual( tmpEntryCt + 1 );
							MAEntriesCollectionInstance.add.restore();
							done();
						}, 100 );
					}, 100 );
				});
			});
			
		});
		
		

	});
});