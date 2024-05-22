define([ "app" 
		,"apps/pendingRequest/pendingReqApp" 
		,"apps/mainContent/mainContentApp" 
		,"entity/userManagement" 
		,"apps/pendingRequest/customers/pendingReqCustomersGridView" 
		,"apps/pendingRequest/requests/pendingReqRequestsGridView"
		,'fixture/customerFixture' 
		,'fixture/customerLeasesFixture'
		,"utilities"  ]

, function( RRAC 
	,PendingReqApp 
	,MainContentApp 
	,entity 
	,PendingReqCustomersGridView 
	,PendingReqRequestsGridView 
	,CustomerFixture 
	,CustomerLeasesFixture 
	,utilities ) {

	
	beforeEach( function() {
		this.fakeServer = sinon.fakeServer.create();
		this.fakeServer.respondWith('GET',
				"rrac2_service/rest/user/getCustomersWithPending",
				[ 200,
					{ 'Content-type': 'application/json' },
					''
				]);
	});
	describe( 'Pending Request App' , function() {
		beforeEach( function() {
			//dependencies
			if( ! MainContentApp.mainContentLayout ) {
			MainContentApp.mainContentLayout = new Marionette.Layout();
			MainContentApp.mainContentLayout.page2Region = new Marionette.Region( {el: '#page2Region' });
			}
		});
		
		it( 'Runs Page Controller showPendingRequestPage on "pendingRequest:show"' , function() {

			this.showPageSpy = sinon.spy( RRAC.PendingReqApp.Page.Controller , "showPendingRequestPage" );
			
			
			//var stub = sinon.stub( MainContentApp.mainContentLayout.page2Region , "show" );
			RRAC.trigger("pendingRequest:show");
			expect( RRAC.PendingReqApp.Page.Controller.showPendingRequestPage.calledOnce ).toEqual(true);
			//expect( RRAC.PendingReqApp.Page.Controller.showPendingRequestPage ).toHaveBeenCalled();
		});
		
		it( 'Hides Content' , function() {
			this.showPageSpy = sinon.spy( RRAC.PendingReqApp.Page.Controller , "removePendingRequestPage" );
			//console.log( MainContentApp.mainContentLayout.page2Region.currentView );
			var stub = sinon.stub( utilities , "hideContent" , function(region) {region.close();} );
			
			RRAC.trigger("pendingRequest:show");
			RRAC.trigger("pendingRequest:close");
			
			//console.log( MainContentApp.mainContentLayout.page2Region.currentView );
			expect( RRAC.PendingReqApp.Page.Controller.removePendingRequestPage.calledOnce ).toEqual(true);
			expect( MainContentApp.mainContentLayout.page2Region.currentView ).toEqual(undefined);
			
		});
	});
	
	describe( 'Pending Request Customers Grid View' , function() {
		it('Creates a Form element',function() {
			/*this.fakeServer = sinon.fakeServer.create();
			this.collection = new RRAC.Entities.PendingReqsCustomersCollection();
			this.fakeServer.respondWith('GET',
					"/rrac2_service/rest/user/getBANCustomers",
					[ 200,
						{ 'Content-type': 'application/json' },
						JSON.stringify(CustomerFixture.GET.customers)
					]);

				this.collection.fetch();
				this.fakeServer.respond();*/
			view = new PendingReqCustomersGridView.PRCustomersGrid({collection: new Backbone.Collection});
			expect( view.tagName ).toEqual("form class='gridForm'");
			
		});
		it('Displays No Rows Collection',function() {
			view = new PendingReqCustomersGridView.PRCustomersGrid({collection: new Backbone.Collection});
			view.render();
			expect( view.$el.find("div[rel='gridContents'] .bbGrid-grid tr").length ).toEqual(1);			
		});
		
		it('Displays All Rows Collection with no infinate scroll',function() {
			$.prototype.popover = function() {};
			var coll = new Backbone.Collection( CustomerFixture.GET.customers );
			view = new PendingReqCustomersGridView.PRCustomersGrid({collection: coll});
			view.render();
			expect( view.$el.find("div[rel='gridContents'] .bbGrid-grid tr").length ).toEqual(CustomerFixture.GET.customers.length);
		});
		
		it('An Item Can be selected',function() {
			$.prototype.popover = function() {};
			var tesObj = { onRowClick: function () {} };
			sinon.spy( tesObj , "onRowClick" );
			var coll = new Backbone.Collection( CustomerFixture.GET.customers );
			view = new PendingReqCustomersGridView.PRCustomersGrid({collection: coll , onRowClick: tesObj.onRowClick});
			view.render();
			$( view.$el.find(".bbGrid-row td")[1] ).click();
			//view.trigger("RRACDataGrid:rowClick", {}, {});
			expect( tesObj.onRowClick.calledOnce ).toEqual( true );
		});
	});
	
	describe( 'Pending Request Customer Leases Grid View' , function() {
		it('Creates a Form element',function() {
			view = new PendingReqRequestsGridView.PRCustomerLeasesGrid({collection: new Backbone.Collection});
			expect( view.tagName ).toEqual("form class='gridForm'");
			
		});
		it('Displays No Rows Collection',function() {
			view = new PendingReqRequestsGridView.PRCustomerLeasesGrid({collection: new Backbone.Collection});
			view.render();
			expect( view.$el.find("div[rel='gridContents'] .bbGrid-grid tr").length ).toEqual(1);			
		});
		
		it('Displays All Rows Collection with no infinate scroll',function() {
			$.prototype.popover = function() {};
			var coll = new Backbone.Collection( CustomerLeasesFixture.GET.customerLeases );
			view = new PendingReqRequestsGridView.PRCustomerLeasesGrid({collection: coll});
			view.render();
			expect( view.$el.find("div[rel='gridContents'] .bbGrid-grid tr").length ).toEqual(CustomerLeasesFixture.GET.customerLeases.length);
		});
		
		it('An Item Can be selected',function() {
			$.prototype.popover = function() {};
			var tesObj = { onRowClick: function () {} };
			sinon.spy( tesObj , "onRowClick" );
			var coll = new Backbone.Collection( CustomerLeasesFixture.GET.customerLeases );
			view = new PendingReqRequestsGridView.PRCustomerLeasesGrid({collection: coll , onRowClick: tesObj.onRowClick});
			view.render();
			$( view.$el.find(".bbGrid-row td")[1] ).click();
			//view.trigger("RRACDataGrid:rowClick", {}, {});
			expect( tesObj.onRowClick.calledOnce ).toEqual( true );
		});
	});

});
//karma start C:/Users/JOKing/Documents/repo/rrac2_ui/WebContent/assets/js/tests/jasmine/karma.conf.rrac2_ui.js