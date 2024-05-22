define([ "app" 
		,"apps/pendingRequest/requests/pendingReqRequestsGridController"
		,"apps/pendingRequest/requests/pendingReqRequestsGridView"
		,"common/bbgrid/rracDataGridView"
		,"apps/pendingRequest/page/pendingReqPageView"
		,'fixture/customerLeasesFixture'
		,'fixture/changeRequestFixture'
		//,'entities/pendingRequest'
		,"utilities"
		,"jquery"]

, function( RRAC  
	,PendingReqRequestsGridController
	,PendingReqRequestsGridView
	,RRACDataGridView
	,PageView
	,CustomerLeasesFixture 
	,ChangeRequestFixture
	//,PendingRequestEntity
	,utilities
	,$) {

	
	//beforeEach( function() {
		/*this.fakeServer = sinon.fakeServer.create();
		this.fakeServer.respondWith('GET',
				"rrac2_service/rest/user/getCustomersWithPending",
				[ 200,
					{ 'Content-type': 'application/json' },
					JSON.stringify(CustomerLeasesFixture.GET.customerLeases)
				]);*/
				
		/*this.fakeServer2 = sinon.fakeServer.create();
		this.fakeServer2.respondWith('GET',
				"rrac2_service/rest/control_record/getPendingRequestsByCustomerId",
				[ 200,
					{ 'Content-type': 'application/json' },
					JSON.stringify(ChangeRequestFixture.GET.changeRequests)
				]);*/
	//});
	describe( 'Pending Request App' , function() {
		beforeEach( function() {
			this.tmpView = RRACDataGridView.RRACDataGridPanel.extend({});
			sinon.stub( PendingReqRequestsGridView , "PRCustomerLeasesGrid" ,  this.tmpView );
			var tmpRegion = Marionette.Region.extend({el:'#gridLeases'});
			this.tmpR = new tmpRegion();
			var self = this;
			sinon.stub( this.tmpR , "show" , function(view) { /*console.log( view );*/ } );
			sinon.stub( RRAC.PendingReqApp , "getRegions" , function() {return {requestsRegion: self.tmpR };} );
			sinon.stub( RRAC.PendingReqApp.RequestsGrid.MassApprove.Controller , "showPopup" );
			
			spyOn($, 'ajax').and.callFake(function (req) {
				var d = $.Deferred();
				var col = new Backbone.Collection();
				_.each(ChangeRequestFixture.GET.changeRequests, function( req ) {
					col.add( req );
				} );
				d.resolve( col );
				return d.promise();
			});
			
			RRAC.reqres.setHandler("pendingReqCustomerLeases:entities", function(collectionObj, resetPageNum, filterObj, arguments) {
				return $.ajax({});
			});
		});
		
		afterEach( function() {
			PendingReqRequestsGridView.PRCustomerLeasesGrid.restore();
			RRAC.PendingReqApp.getRegions.restore();
			this.tmpR.show.restore();
			RRAC.PendingReqApp.RequestsGrid.MassApprove.Controller.showPopup.restore();
		});
		
		it( 'Controller showGrid() shows a RRACDataGridPanel view' , function() {
			var modelx = Backbone.Model.extend({defaults: {BusinessEntityId:1}});
			var model = new modelx();
			PendingReqRequestsGridController.showGrid(model);
			expect( this.tmpR.show.calledOnce ).toEqual( true );
			expect( this.tmpR.show.getCall(0).args[0] ).toEqual( jasmine.any(RRACDataGridView.RRACDataGridPanel) );
		});
		
		it( 'Controller handles onApplyAction' , function() {
			var modelx = Backbone.Model.extend({defaults: {BusinessEntityId:1}});
			var model = new modelx();
			
			PendingReqRequestsGridController.showGrid(model);
			var selectedIds = [ChangeRequestFixture.GET.changeRequests[0].get("ControlRecordChangeRequestSystemId")];
			//test onApplyAction
			PendingReqRequestsGridView.PRCustomerLeasesGrid.getCall(0).args[0].onApplyAction( selectedIds );
			expect( RRAC.PendingReqApp.RequestsGrid.MassApprove.Controller.showPopup.calledOnce ).toEqual( true );
			expect( RRAC.PendingReqApp.RequestsGrid.MassApprove.Controller.showPopup.getCall(0).args[0].length ).toEqual(1);
			
			//console.log(RRAC.PendingReqApp.RequestsGrid.MassApprove.Controller.showPopup.getCall(0));			
			//console.log(PendingReqRequestsGridView.PRCustomerLeasesGrid.getCall(0).args[0].onApplyAction);
			//console.log(PendingReqRequestsGridView.PRCustomerLeasesGrid.getCall(0).args[0].collection);
			//console.log(PendingReqRequestsGridView.PRCustomerLeasesGrid.collection);
		});
		
		it( 'Controller onApplyAction handles 2 selected ids' , function() {
			var modelx = Backbone.Model.extend({defaults: {BusinessEntityId:1}});
			var model = new modelx();
			
			PendingReqRequestsGridController.showGrid(model);
			var selectedIds = [
									ChangeRequestFixture.GET.changeRequests[0].get("ControlRecordChangeRequestSystemId")
									,ChangeRequestFixture.GET.changeRequests[1].get("ControlRecordChangeRequestSystemId")
								];
			//test onApplyAction
			PendingReqRequestsGridView.PRCustomerLeasesGrid.getCall(0).args[0].onApplyAction( selectedIds );
			expect( RRAC.PendingReqApp.RequestsGrid.MassApprove.Controller.showPopup.getCall(0).args[0].length ).toEqual(2);
		});
	});

});
//karma start C:/Users/JOKing/Documents/repo/rrac2_ui/WebContent/assets/js/tests/jasmine/karma.conf.rrac2_ui.js