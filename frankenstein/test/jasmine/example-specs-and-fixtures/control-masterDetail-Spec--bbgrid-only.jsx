define([ "marionette" , "app" , "layout" , "masterDetail/control" , "form/control"  ], 
	function( Marionette , App , MainLayout , MasterDetailControl , FormControl ) {

	beforeEach( function() {
		if( $("#main-content-region").length == 0 ) {
			this.tmpEle = $( '<div id="main-content-region">abcde</div>' );
			$(document.body).append( this.tmpEle );
			/*add the main layout to the DOM*/
			App.showView( MainLayout );
		}
		this.md_region = App.getView().getRegion( "page1Region" );
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
		
		this.onRenderMaster = function( model ) {};
		this.onRenderDetail = function( view ) {};
		this.onRenderEmpty = function( view ) {};
		this.onExitEmpty = function( view ) {};
		sinon.stub( this , "onRenderMaster" , function( model ) {} );
		sinon.stub( this , "onRenderDetail" , function( view ) {} );
		sinon.stub( this , "onRenderEmpty" , function( view ) {} );
		sinon.stub( this , "onExitEmpty" , function( view ) {} );
		
		this.collectionData = [
			{ id: 1 , name: "name1", color: "red" }
			,{ id: 2 , name: "name2", color: "blue" }
			,{ id: 3 , name: "name3", color: "white" }
		];
		this.collection = new tmpCollection( this.collectionData );
		
		this.bbgridConfig = {
			colModel: [
				{ title: 'ID',  index: true, name: 'id', sorttype: 'string', filter: false }
				,{ title: 'Name',  index: false, name: 'name', sorttype: 'string', filter: false }
				,{ title: 'Type',  index: false, name: 'type', sorttype: 'string', filter: false }
				,{ title: 'Color',  index: false, name: 'color', sorttype: 'string', filter: false }
			]
			,enableSearch: false
		};
		
		this.detailTemplate = _.template( '<div class="detail"><%= name %><%= type %><%= color %></div>' );
		this.emptyTemplate = _.template( '<a href="#" class="exit">exit empty</a>' );
		
		this.md_control = new MasterDetailControl({
			region: this.md_region
			,collection: this.collection
			,bbgridConfig: this.bbgridConfig
			,detailTemplate: this.detailTemplate
			,emptyTemplate: this.emptyTemplate
			,gridWrapperClass: "grid-wrapper"
			,detailWrapperClass: "detail-wrapper"
			,onRenderMaster: this.onRenderMaster
			,onRenderDetail: this.onRenderDetail
			,onRenderEmpty: this.onRenderEmpty
			,onExitEmpty: this.onExitEmpty
		});
	});
		
	afterEach( function() {
		//this.tmpEle.remove();
		this.onRenderMaster.restore();
		this.onRenderDetail.restore();
		this.onRenderEmpty.restore();
		this.onExitEmpty.restore();
	});
	
    describe('MasterDetail Control basic:', function() {

        it('It is defined', function() {
			expect( MasterDetailControl ).toBeDefined();
        });
        it('It is instanciated', function() {
			expect( this.md_control ).toBeDefined();
        });
		
		it('Is added to region', function( done ){
			sinon.spy( this.md_region , "show" );
			this.md_control.render();
			var self = this;
			setTimeout( function() {
				expect( self.md_region.show.calledOnce ).toEqual( true );
				self.md_region.show.restore();
				done();
			} , 200 );
		});
		
		it('Has 3 regions of its own', function( done ){
			this.md_control.render();
			
			var self = this;
			setTimeout( function() {
				expect( self.md_control.view.getRegion( "gridRegion" ) ).toEqual( jasmine.any( Marionette.Region ) );
				expect( self.md_control.view.getRegion( "detailRegion" ) ).toEqual( jasmine.any( Marionette.Region ) );
				expect( self.md_control.view.getRegion( "introRegion" ) ).toEqual( jasmine.any( Marionette.Region ) );
				done();
			} , 200 );
		});

    });
	
	describe( 'MasterDetail Control config:' , function() {
		
		it('Accepts region config', function(){
			expect( this.md_control.region ).toEqual( this.md_region );
		});
		
		it('Accepts collection config', function(){
			expect( this.md_control.collection ).toEqual( this.collection );
		});
		
		it('Accepts detailTemplate config', function(){
			expect( this.md_control.detailTemplate ).toEqual( this.detailTemplate );
		});
		
		it('Accepts emptyTemplate config', function(){
			expect( this.md_control.emptyTemplate ).toEqual( this.emptyTemplate );
		});
		
		it('Accepts gridWrapperClass config', function(){
			expect( this.md_control.gridWrapperClass ).toEqual( "grid-wrapper" );
		});
		
		it('Accepts detailWrapperClass config', function(){
			expect( this.md_control.detailWrapperClass ).toEqual( "detail-wrapper" );
		});
	});
	
	describe( 'MasterDetail Control grid view:' , function() {
		beforeEach( function( done ) {
			this.md_control.render();
			setTimeout( function() {
				done();
			} , 200 );
		});
		
		it( 'Renders the layout' , function() {
			expect( $( '.MasterDetailGrid' ).length ).toBeGreaterThan( 0 );
		});
		
		it( 'Applys the gridWrapperClass' , function() {
			expect( $( '.grid-wrapper' ).length ).toBeGreaterThan( 0 );
		});
		
		it( 'Renders the grid' , function() {
			expect( $( 'tbody tr' ).length ).toEqual( this.collection.length );
		});
		
		it('onRenderMaster is called', function(){
			expect( this.onRenderMaster.calledOnce ).toEqual( true );
			expect( this.onRenderMaster.getCall(0).args[0] ).toEqual( this.md_control.view );
		});
	});
	describe( 'MasterDetail Control grid control:' , function() {
		beforeEach( function( done ) {
			this.md_control.render();
			setTimeout( function() {
				done();
			} , 200 );
		});
		it( 'Hides the grid control' , function() {
			this.md_control.hideGrid();
			expect( this.md_control.view.ui.gridContainer.css('display') ).toEqual( 'none' );
		});
		it( 'Shows the grid control' , function() {
			this.md_control.hideGrid();
			this.md_control.showGrid();
			expect( this.md_control.view.ui.gridContainer.css('display') ).not.toEqual( 'none' );
		});
	});
	describe( 'MasterDetail Control detail view:' , function() {
		beforeEach( function( done ) {
			this.md_control.render();
			var self = this;
			setTimeout( function() {
				self.md_control.renderDetails( self.collection.at(0) );
				done();
			} , 200 );
		});
		it('onRenderDetail is called' , function() {
			expect( this.onRenderDetail.calledOnce ).toEqual( true );
			expect( this.onRenderDetail.getCall(0).args[0] ).toEqual( this.collection.at(0) );
		});
		
		it( 'Renders the detail view' , function() {
			expect( $( '.detail' ).length ).toEqual( 1 );
		});
		
		it( 'Hides the detail control' , function() {
			this.md_control.hideDetail();
			expect( this.md_control.view.$el.find( '.MasterDetailPanel' ).css('display') ).toEqual( 'none' );
		});
	});
	describe( 'MasterDetail Control detail control:' , function() {
		beforeEach( function( done ) {
			this.formTemplate = _.template( '<input id="name" value="<%= name %>" /><a href="#" class="save">Save</a>' );
			this.detailControl = new FormControl({
				detailTemplate: this.formTemplate
			});
			this.md_control.detailTemplate = null;
			this.md_control.detailControl = this.detailControl;
			this.md_control.render();
			var self = this;
			setTimeout( function() {
				self.md_control.renderDetails( self.collection.at(0) );
				done();
			} , 200 );
		});
		it('onRenderDetail is called' , function() {
			expect( this.onRenderDetail.calledOnce ).toEqual( true );
			expect( this.onRenderDetail.getCall(0).args[0] ).toEqual( this.collection.at(0) );
		});
		
		it( 'Renders the detail control' , function() {
			expect( $( 'input#name' ).length ).toEqual( 1 );
		});
		
		it( 'Hides the detail control' , function() {
			this.md_control.hideDetail();
			expect( this.md_control.view.$el.find( '.MasterDetailPanel' ).css('display') ).toEqual( 'none' );
		});
		
		it( 'Shows the detail control' , function() {
			this.md_control.hideDetail();
			this.md_control.showDetail();
			expect( this.md_control.view.$el.find( '.MasterDetailPanel' ).css('display') ).not.toEqual( 'none' );
		});
	});
	
	describe( 'MasterDetail Control empty view:' , function() {
		beforeEach( function( done ) {
			this.md_control.collection = new Backbone.Collection();
			this.md_control.render();
			setTimeout( function() {
				done();
			} , 200 );
		});
		
		it( 'Renders the empty view' , function() {
			expect( this.md_control.view.template ).toEqual( this.emptyTemplate );
		});
		
		it('onRenderEmpty is called', function(){
			expect( this.onRenderEmpty.calledOnce ).toEqual( true );
			expect( this.onRenderEmpty.getCall(0).args[0] ).toEqual( this.md_control.view );
		});
		
		it('onExitEmpty is called', function(){
			this.md_control.view.$el.find( ".exit" ).click();
			expect( this.onExitEmpty.calledOnce ).toEqual( true );
			expect( this.onExitEmpty.getCall(0).args[0] ).toEqual( this.md_control.view );
		});
		
		it('reloads grid after data is added', function( done ){
			this.md_control.collection.add( this.collection.models );
			var self = this;
			setTimeout( function() {
				expect( self.md_control.view.template ).not.toEqual( self.emptyTemplate );
				done();
			} , 200 );
		});
	});

});