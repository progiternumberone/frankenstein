define([ "app" , "entity/userManagement" , 'fixture/userFixture' ], function( RRAC , entity , UserFixture ) {

    describe('User Collection Entity Basic Tests', function() {
		beforeEach( function() {
			this.collection = new RRAC.Entities.UserManagementCollection();
		});
        it('RRAC.Entities.UserManagementCollection exists', function() {
			expect( RRAC.Entities.UserManagementCollection ).toBeDefined();
        });

        it('RRAC.Entities.UserManagementCollection Uses Correct REST URL', function() {
			expect( this.collection.url ).toEqual( "/rrac2_service/rest/user" );
        });

    });
	
	describe( 'User Collection Entity REST' , function() {
		beforeEach( function() {
				this.fakeServer = sinon.fakeServer.create();
				this.collection = new RRAC.Entities.UserManagementCollection();
		});
		
		afterEach( function() {
			this.fakeServer.restore();
		});
		
		it('Should fetch with a GET request', function(){
			this.collection.fetch();
			expect(this.fakeServer.requests[0].method).toEqual("GET");
		});
		
		it('Should be able to process a successful response from the server', function(){
			this.fakeServer.respondWith('GET',
				"/rrac2_service/rest/user",
				[ 200,
					{ 'Content-type': 'application/json' },
					JSON.stringify(UserFixture.GET.users)
				]);

			this.collection.fetch();
			this.fakeServer.respond();
			expect( this.collection.length ).toBe(UserFixture.GET.users.length);
			expect(this.collection.at(0).get('BusinessEntityId')).toEqual(UserFixture.GET.users[0].BusinessEntityId);
		});
		
		it('Should be able to handle an error from the server', function(){
			this.fakeServer.respondWith('GET',
				"/rrac2_service/rest/user",
				[ 500,
					{ 'Content-type': 'application/json' },
					"error"
				]);

			this.collection.fetch();
			this.fakeServer.respond();
			expect( this.collection.length ).toBe(0);
		});
	});
	/*describe( 'UserManagement App' , function() {
		it( 'dd' , function() {
			//this.mainapp = RRAC.MainContentApp;
			//this.uapp = RRAC.UserManagementApp;
			//this.uapp.API.showUserManagementPage();
			//RRAC.trigger("userManagement:show");
			RRAC.start();
		});
	});*/

});