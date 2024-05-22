define([ "app" , "entity/MineralAwardReportsInstance" , 'fixture/MineralAwardReportsFixture' ], function( App , ReportsInstance , MineralAwardReportsFixture) {

    describe('Mineral award reports instance basic tests:', function() {

        it('It is defined', function() {
			expect( ReportsInstance ).toBeDefined();
        });

    });
	
	describe( 'Mineral award reports instance GET tests:' , function() {
		beforeEach( function() {
				this.fakeServer = sinon.fakeServer.create();
				ReportsInstance.reset([]);
				ReportsInstance.noserver = false;
		});
		
		afterEach( function() {
			this.fakeServer.restore();
		});
		
		it('Fetched with a GET request', function(){
			ReportsInstance.fetch();
			expect(this.fakeServer.requests[0].method).toEqual("GET");
		});
		
		it('Filled with data from successful GEt request', function(){
			this.fakeServer.respondWith('GET',
				"http://devcf.glo.texas.gov/rest/IgorService/report",
				[ 200,
					{ 'Content-type': 'application/json' },
					JSON.stringify(MineralAwardReportsFixture.GET.reports)
				]);

			ReportsInstance.fetch();
			this.fakeServer.respond();
			expect( ReportsInstance.length ).toBe(MineralAwardReportsFixture.GET.reports.length);
			expect(ReportsInstance.at(0).get('reportNumber')).toEqual(MineralAwardReportsFixture.GET.reports[0].reportNumber);
		});
		
		it('Can stay empty if the server returns an error', function(){
			this.fakeServer.respondWith('GET',
				"http://devcf.glo.texas.gov/rest/IgorService/report",
				[ 500,
					{ 'Content-type': 'application/json' },
					"error"
				]);

			ReportsInstance.fetch( { error: function(){} } );
			this.fakeServer.respond();
			expect( ReportsInstance.length ).toBe(0);
		});
		
		it('Can be filled with data if server returns an error', function(){
			this.fakeServer.respondWith('GET',
				"http://devcf.glo.texas.gov/rest/IgorService/report",
				[ 500,
					{ 'Content-type': 'application/json' },
					"error"
				]);

			ReportsInstance.fetch();
			this.fakeServer.respond();
			expect( ReportsInstance.length ).toBeGreaterThan(0);
		});
	});

});