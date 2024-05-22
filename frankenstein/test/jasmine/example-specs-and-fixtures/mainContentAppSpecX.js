define([ "app" ,  "apps/mainContent/mainContentApp"  ], function( RRAC , MainContentApp ) {
//define([ "app" ,  "apps/userManagement/userManagementApp"  ], function( RRAC , UserApp ) {

	describe( 'Main Content App' , function() {
		beforeEach( function() {
		});
		it( 'Does Start' , function() {
			//RRAC.start();
			RRAC.mainContentApp.start();
			expect( RRAC.mainContentApp.IsStarted ).toEqual(true);			
		});
		
		it( 'Runs Add Controller showPage on "mainContent:show"' , function() {

			this.showPageSpy = sinon.spy( RRAC.mainContentApp.Add.Controller , "showPage" );
			RRAC.trigger("mainContent:show", null, 1);
			//expect( RRAC.mainContentApp.Add.Controller.showPage.callCount ).toEqual(1);
			expect( RRAC.mainContentApp.Add.Controller.showPage.calledWith( 1 ) ).toEqual(true);
		});
		
		/*it( '' , function() {
			
		});*/
	});

});