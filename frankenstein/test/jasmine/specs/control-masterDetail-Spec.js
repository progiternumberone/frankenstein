define([ "marionette" , "app" , "layout" , "masterDetail/behavior" , "form/behavior"  ], 
	function( Marionette , App , MainLayout , MasterDetailBehavior , FormBehavior ) {

	beforeEach( function() {
		if( $("#main-content-region").length == 0 ) {
			this._tmpEle = $( '<div id="main-content-region">abcde</div>' );
			$(document.body).append( this._tmpEle );
			/*add the main layout to the DOM*/
			App.showView( MainLayout );
		}
		this._md_region = App.getView().getRegion( "page1Region" );
		var tmpModel = Backbone.Model.extend({
			defaults: {
				id: 0
				,name: "name"
				,type: "type"
				,color: "color"
			}
			,validation: {
				name: { required: true }
			}
		});
		
		var tmpCollection = Backbone.Collection.extend({
			model: tmpModel
		});
		
		this._onRenderMaster = function( model ) {};
		this._onRenderDetail = function( view ) {};
		this._onRenderEmpty = function( view ) {};
		this._onExitEmpty = function( view ) {};
		this._onCustomEvent = function( e ) {};
		sinon.stub( this , "_onRenderMaster" , function( model ) {} );
		sinon.stub( this , "_onRenderDetail" , function( view ) {} );
		sinon.stub( this , "_onRenderEmpty" , function( view ) {} );
		sinon.stub( this , "_onExitEmpty" , function( view ) {} );
		sinon.stub( this , "_onCustomEvent" , function( e ) {} );
		
		this._collectionData = [
			{ id: 1 , name: "name1", color: "red" }
			,{ id: 2 , name: "name2", color: "blue" }
			,{ id: 3 , name: "name3", color: "white" }
		];
		this._collection = new tmpCollection( this._collectionData );
		
		//this._datatableTemplate = _.template( '<table class="table dataTable" cellspacing="0" width="100%"></table>' );
		this._datatableTemplate = _.template( '<div class="master" style="display: none;"><table class="table dataTable" cellspacing="0" width="100%"></table></div><div class="detail" style="display: none;"></div><div class="empty" style="display: none;">No items at this time<a href="" class="btn btn-primary see-data">See the data</a></div>' );
		this._datatablesConfig = {
			columns: [
				{ "data" : "attributes.id" , "visible" : false }
				,{ "data" : "attributes.name" }
				,{ "data" : "attributes.type" }
				,{ "data" : "attributes.color" }
			]
			,buttons: [
				'excel','pdf'
			]
			,template: this._datatableTemplate
		};
		
		this._detailTemplate = _.template( '<div class="detailTemplate"><a href="#" class="custom"><%= name %></a><%= type %><%= color %></div>' );
		this._emptyTemplate = _.template( '<a href="#" class="exit">exit empty</a>' );
		
		this._md_control = new (Marionette.View.extend({
			//region: this._md_region
			collection: this._collection
			,template: this._datatableTemplate
			,regions: {
				master: ".master"
				,detail: ".detail"
				,empty: ".empty"
			}
			,behaviors: [
				{
					behaviorClass: MasterDetailBehavior
					,autoRefresh: true
					,detailTemplate: this._detailTemplate
					,datatablesConfig: this._datatablesConfig
				}
			]
			//,datatablesConfig: this._datatablesConfig
			//,detailTemplate: this._detailTemplate
			//,emptyTemplate: this._emptyTemplate
			//,gridWrapperClass: "grid-wrapper"
			//,detailWrapperClass: "detail-wrapper"
			,onRenderMaster: this._onRenderMaster
			,onRenderDetail: this._onRenderDetail
			,onShowEmpty: this._onRenderEmpty
			,onHideEmpty: this._onExitEmpty
			,events: {
				"click .custom": this._onCustomEvent
				,"click .see-data": "hideEmpty"
			}
		}));
	});
		
	afterEach( function() {
		//this._tmpEle.remove();
		this._onRenderMaster.restore();
		this._onRenderDetail.restore();
		this._onRenderEmpty.restore();
		this._onExitEmpty.restore();
		this._onCustomEvent.restore();
	});
	
	
    describe('MasterDetail Control basic:', function() {

        it('It is defined', function() {
			expect( MasterDetailBehavior ).toBeDefined();
        });
        it('It is instanciated', function() {
			expect( this._md_control ).toBeDefined();
        });
        it('Main Region Exists', function() {
			expect( this._md_region ).toEqual( jasmine.any( Marionette.Region ) );
        });
		
		it('Is added to region', function( ){
			sinon.spy( this._md_region , "show" );
			this._md_region.show( this._md_control );
			expect( this._md_region.show.calledOnce ).toEqual( true );
			this._md_region.show.restore();
		});
		
		it('Has 3 regions of its own', function( ){
			this._md_region.show( this._md_control );
			expect( this._md_control.getRegion( "master" ) ).toEqual( jasmine.any( Marionette.Region ) );
			expect( this._md_control.getRegion( "detail" ) ).toEqual( jasmine.any( Marionette.Region ) );
			expect( this._md_control.getRegion( "empty" ) ).toEqual( jasmine.any( Marionette.Region ) );
		});

    });

	describe( 'MasterDetail Control config:' , function() {
		
		it('Accepts collection config', function(){
			expect( this._md_control.collection ).toEqual( this._collection );
		});
		
		
		it('Accepts detailTemplate config', function(){
			expect( this._md_control.detailTemplate ).toEqual( this._detailTemplate );
		});
		
	});
	
	describe( 'MasterDetail Control grid view:' , function() {
		beforeEach( function( done ) {
			this._md_region.show( this._md_control );
			setTimeout( function() {
				done();
			} , 200 );
		});
		afterEach( function() {
			this._md_region.empty();
		});
		
		it( 'Renders the basic view' , function() {
			expect( $( '.master' ).length ).toBeGreaterThan( 0 );
			expect( $( '.detail' ).length ).toBeGreaterThan( 0 );
			expect( $( '.empty' ).length ).toBeGreaterThan( 0 );
		});
		
		
		it( 'Renders the grid' , function() {
			expect( $( 'tbody tr' ).length ).toEqual( this._collection.length );
		});
		
		it('onRenderMaster is called', function(){
			expect( this._onRenderMaster.calledOnce ).toEqual( true );
			expect( this._onRenderMaster.getCall(0).args[0] ).toEqual( this._md_control );
		});
	});
	
	
	describe( 'MasterDetail Control grid control:' , function() {
		beforeEach( function( done ) {
			this._md_region.show( this._md_control );
			setTimeout( function() {
				done();
			} , 200 );
		});
		afterEach( function() {
			this._md_region.empty();
		});
		it( 'Hides the grid control' , function() {
			this._md_control.hideMaster();
			expect( $( this._md_control.getRegion( "master" ).el ).css( 'display' ) ).toEqual( 'none' );
		});
		
		it( 'Shows the grid control' , function() {
			this._md_control.hideMaster();
			this._md_control.showMaster();
			expect( $( this._md_control.getRegion( "master" ).el ).css( 'display' ) ).not.toEqual( 'none' );
		});
		
	});
	
	
	describe( 'MasterDetail Control detail view:' , function() {
		beforeEach( function( done ) {
			this._md_region.show( this._md_control );
			var self = this;
			setTimeout( function() {
				self._md_control.trigger( "grid:click" , self._collection.at(0) );
				done();
			} , 200 );
		});
		afterEach( function() {
			this._md_region.empty();
		});
		
		it('onRenderDetail is called' , function() {
			expect( this._onRenderDetail.calledOnce ).toEqual( true );
			expect( this._onRenderDetail.getCall(0).args[0] ).toEqual( this._collection.at(0) );
		});
		
		it( 'Renders the detail view' , function() {
			expect( $( '.detailTemplate' ).length ).toEqual( 1 );
		});
		
		
		it( 'Hides the detail view' , function() {
			this._md_control.hideDetail();
			expect( $( this._md_control.getRegion( "detail" ).el ).css( 'display' ) ).toEqual( 'none' );
		});
		it( 'Shows the detail view' , function() {
			this._md_control.hideDetail();
			this._md_control.showDetail();
			expect( $( this._md_control.getRegion( "detail" ).el ).css( 'display' ) ).not.toEqual( 'none' );
		});
		
		
		it('Calls Custom Detail View Event', function(){
			this._md_control.$el.find( ".custom" ).click();
			expect( this._onCustomEvent.calledOnce ).toEqual( true );
			expect( this._onCustomEvent.getCall(0).args[0].target.className ).toEqual( "custom" );
		});
	});
	
	describe( 'MasterDetail Control detail control:' , function() {
		beforeEach( function( done ) {
			this._formTemplate = _.template( '<input id="name" value="<%= name %>" /><a href="#" class="save">Save</a>' );
			this._detailControl = new (Marionette.View.extend({
				template: this._formTemplate
				,model: {}
				,behaviors: [
					{
						behaviorClass: FormBehavior
					}
				]
			}));
			this._tmp_md = new (Marionette.View.extend({
				collection: this._collection
				,template: this._datatableTemplate
				,regions: {
					master: ".master"
					,detail: ".detail"
					,empty: ".empty"
				}
				,behaviors: [
					{
						behaviorClass: MasterDetailBehavior
						,detailControl: this._detailControl
						,datatablesConfig: this._datatablesConfig
					}
				]
				,onRenderMaster: this._onRenderMaster
				,onRenderDetail: this._onRenderDetail
				,onShowEmpty: this._onRenderEmpty
				,onHideEmpty: this._onExitEmpty
			}));
			this._md_region.show( this._tmp_md );
			var self = this;
			setTimeout( function() {
				self._tmp_md.trigger( "grid:click" , self._collection.at(0) );
				done();
			} , 200 );
		});
		afterEach( function() {
			this._md_region.empty();
		});
		it('onRenderDetail is called' , function() {
			expect( this._onRenderDetail.calledOnce ).toEqual( true );
			expect( this._onRenderDetail.getCall(0).args[0] ).toEqual( this._collection.at(0) );
		});
		
		it( 'Renders the detail control' , function() {
			expect( $( 'input#name' ).length ).toEqual( 1 );
		});
		
		it( 'Hides the detail control' , function() {
			this._tmp_md.hideDetail();
			expect( $( this._tmp_md.getRegion( "detail" ).el ).css( 'display' ) ).toEqual( 'none' );
		});
		
		it( 'Shows the detail control' , function() {
			this._tmp_md.hideDetail();
			this._tmp_md.showDetail();
			expect( $( this._tmp_md.getRegion( "detail" ).el ).css( 'display' ) ).not.toEqual( 'none' );
		});
	});
	
	describe( 'MasterDetail Control empty view:' , function() {
		beforeEach( function( done ) {
			this._md_control.collection.reset( [] );
			this._md_region.show( this._md_control );
			setTimeout( function() {
				done();
			} , 200 );
		});
		
		it( 'Renders the empty view' , function() {
			expect( $( this._md_control.getRegion( "empty" ).el ).css( 'display' ) ).not.toEqual( 'none' );
		});
		
		it('onRenderEmpty is called', function(){
			expect( this._onRenderEmpty.calledOnce ).toEqual( true );
			expect( this._onRenderEmpty.getCall(0).args[0] ).toEqual( this._md_control.view );
		});
		
		it('onExitEmpty is called', function(){
			this._md_control.$el.find( ".see-data" ).click();
			expect( this._onExitEmpty.calledOnce ).toEqual( true );
			expect( this._onExitEmpty.getCall(0).args[0] ).toEqual( this._md_control.view );
		});
		
		it('reloads grid after data is added', function( done ){
			this._md_control.collection.reset( this._collectionData );
			var self = this;
			setTimeout( function() {
				expect( $( 'tbody tr' ).length ).toEqual( self._collection.length );
				done();
			} , 200 );
		});
		
	});
	
	
	
	
	/*
	describe( 'MasterDetail Control BBGrid:' , function() {
		beforeEach( function( done ) {
			this._bbgridConfig = {
				colModel: [
					{ title: 'ID',  index: true, name: 'id', sorttype: 'string', filter: false }
					,{ title: 'Name',  index: false, name: 'name', sorttype: 'string', filter: false }
					,{ title: 'Type',  index: false, name: 'type', sorttype: 'string', filter: false }
					,{ title: 'Color',  index: false, name: 'color', sorttype: 'string', filter: false }
				]
				,enableSearch: false
			};
			this.control = new MasterDetailControl({
				region: this._md_region
				,collection: this._collection
				,bbgridConfig: this._bbgridConfig
				,detailTemplate: this._detailTemplate
				,emptyTemplate: this._emptyTemplate
				,gridWrapperClass: "grid-wrapper"
				,detailWrapperClass: "detail-wrapper"
				,onRenderMaster: this._onRenderMaster
				,onRenderDetail: this._onRenderDetail
				,onRenderEmpty: this._onRenderEmpty
				,onExitEmpty: this._onExitEmpty
			});
			this.control.render();
			setTimeout( function() {
				done();
			} , 200 );
		});
		it( 'Renders the grid' , function() {
			expect( $( 'tbody tr' ).length ).toEqual( this._collection.length );
		});
	});
*/
});