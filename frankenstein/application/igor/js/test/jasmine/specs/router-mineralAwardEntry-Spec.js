define([ "app" , "routes" , "logic/company" , "logic/report" , "logic/reports" ], function( App , Router , logicCompany, logicReportEntry, logicReports ) {

    describe('App Router', function() {
		beforeEach(function() {
			this.routeFunctions = {};
			this.routeFunctions.company = logicCompany;
			this.routeFunctions.report = logicReportEntry;
			this.routeFunctions.reports = logicReports;
			//this.routeFunctions = new BusinessLogic();
			sinon.stub( this.routeFunctions , "company" );
			sinon.stub( this.routeFunctions , "report" );
			sinon.stub( this.routeFunctions , "reports" );
			//var appRouter = new Router();
			//console.log( Router.routes );
			//appRouter.appRoute( "" , this.routeFunctions.showMineralAwardGLO3Reports );
			//log( Router.routes );
			var appRouter = new Router({
				controller: this.routeFunctions
			});
			try {
				Backbone.history.start();
				log('successssssssssssss');
			} catch( err ) { log(err.toString()); }
			
		});
		
		afterEach( function() {
			//this.tmpEle.remove();
			this.routeFunctions.company.restore();
			this.routeFunctions.report.restore();
			this.routeFunctions.reports.restore();
		});
        it('# calls reports logic', function() {
			App.navigate( "" , true );
			expect( this.routeFunctions.reports.calledOnce ).toEqual( true );
        });
        it('#report calls reports logic', function() {
			App.navigate( "report" , true );
			expect( this.routeFunctions.reports.calledOnce ).toEqual( true );
        });
		
        it('#company calls company logic', function() {
			App.navigate( "company" , true );
			expect( this.routeFunctions.company.calledOnce ).toEqual( true );
        });
        it('#company/RPT_NUM calls company logic', function() {
			App.navigate( "company/RPT_NUM" , true );
			expect( this.routeFunctions.company.calledOnce ).toEqual( true );
			expect( this.routeFunctions.company.getCall(0).args[0] ).toEqual( 'RPT_NUM' );
        });
        it('#company/BAN/DATE calls company logic', function() {
			App.navigate( "company/BAN/DATE" , true );
			expect( this.routeFunctions.company.calledOnce ).toEqual( true );
			expect( this.routeFunctions.company.getCall(0).args[0] ).toEqual( 'BAN' );
			expect( this.routeFunctions.company.getCall(0).args[1] ).toEqual( 'DATE' );
        });
		
		
        it('#report/RPT_NUM calls report logic', function() {
			App.navigate( "report/RPT_NUM" , true );
			expect( this.routeFunctions.report.calledOnce ).toEqual( true );
			expect( this.routeFunctions.report.getCall(0).args[0] ).toEqual( 'RPT_NUM' );
        });
        it('#mineralAward/company/BAN/DATE calls report logic', function() {
			App.navigate( "report/BAN/DATE" , true );
			expect( this.routeFunctions.report.calledOnce ).toEqual( true );
			expect( this.routeFunctions.report.getCall(0).args[0] ).toEqual( 'BAN' );
			expect( this.routeFunctions.report.getCall(0).args[1] ).toEqual( 'DATE' );
        });

    });
	

});