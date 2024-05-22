define([ "marionette" , "app" , "routes" , "layout"  , "masterDetail/controller"  , "masterDetail/view"  ], 
	function( Marionette , App , routes , MainLayout , MasterDetailControl , MasterDetailView ) {

	beforeEach( function() {
		if( $("#main-content-region").length == 0 ) {
			this.tmpEle = $( '<div id="main-content-region">abcde</div>' );
			$(document.body).append( this.tmpEle );
			/*add the main layout to the DOM*/
			App.showView( MainLayout );
		}
		this.region = App.getView().getRegion( "page1Region" );
		
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
		
		this.onRenderMaster = function( model ) {}
		this.onRenderDetail = function( view ) {}
		this.onRenderEmpty = function( view ) {}
		this.onExitEmpty = function( view , el ) {}
		sinon.stub( this , "onRenderMaster" , function( model ) {} );
		sinon.stub( this , "onRenderDetail" , function( view ) {} );
		sinon.stub( this , "onRenderEmpty" , function( view ) {} );
		sinon.stub( this , "onExitEmpty" , function( view , el ) {} );
		
		this.collection = new tmpCollection([
			{ id: 1 , name: "name1", color: "red" }
			{ id: 2 , name: "name2", color: "blue" }
			{ id: 3 , name: "name3", color: "white" }
		]);
		
		this.bbGridConfig = {
			colModel: [
				{ title: 'ID',  index: true, name: 'id', sorttype: 'string', filter: false }
				,{ title: 'Name',  index: false, name: 'name', sorttype: 'string', filter: false }
				,{ title: 'Type',  index: false, name: 'type', sorttype: 'string', filter: false }
				,{ title: 'Color',  index: false, name: 'color', sorttype: 'string', filter: false }
			]
			,enableSearch: false
		};
		
		this.detailTemplate = _.template( '<%= name %><%= type %><%= color %>' );
		this.emptyTemplate = _.template( '<a href="#" class="exit">exit empty</a>' );
		
		this.control = new MasterDetailControl({
			region: this.region
			,collection: this.collection
			,bbGridConfig: this.bbGridConfig
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
		this.onComplete.restore();
		this.onExitEmpty.restore();;
	});
	
    describe('MasterDetail Control basic:', function() {

        it('It is defined', function() {
			expect( MasterDetailControl ).toBeDefined();
        });
        it('It is instanciated', function() {
			expect( this.control ).toBeDefined();
        });
		
		it('Is added to region', function(){
			sinon.spy( this.region , "show" );
			this.control.render();
			expect( this.region.show.calledOnce ).toEqual( true );
		});

    });
	
	describe( 'MasterDetail Control config:' , function() {
		
		it('Accepts region config', function(){
			expect( this.control.region ).toEqual( this.region );
		});
		
		it('Accepts collection config', function(){
			expect( this.control.collection ).toEqual( this.collection );
		});
		
		it('Accepts detailTemplate config', function(){
			expect( this.control.detailTemplate ).toEqual( this.detailTemplate );
		});
		
		/*it('Accepts detailTemplate config', function(){
			expect( this.control.detailControl ).toEqual( this.detailControl );
		});*/
		
		it('Accepts emptyTemplate config', function(){
			expect( this.control.emptyTemplate ).toEqual( this.emptyTemplate );
		});
		
		it('Accepts gridWrapperClass config', function(){
			expect( this.control.gridWrapperClass ).toEqual( "grid-wrapper" );
		});
		
		it('Accepts detailWrapperClass config', function(){
			expect( this.control.detailWrapperClass ).toEqual( "detail-wrapper" );
		});
	});
	
	describe( 'MasterDetail Control Empty View:' , function() {
		beforeEach( function() {
			/*this.control = new MasterDetailControl({
				region: this.region
				,collection: new Backbone.Collection();
				,bbGridConfig: this.bbGridConfig
				,detailTemplate: this.detailTemplate
				,emptyTemplate: this.emptyTemplate
			});*/
			this.control.collection = new Backbone.Collection();
		});
		
		it( 'Renders the empty view' , function() {
			this.control.render();
			expect( this.control.view.template ).toEqual( this.emptyTemplate );
		});
	});
	/*describe( 'MasterDetail Control view:' , function() {		
		it('Is created', function(){
			//sinon.stub( control.layout , "showChildView" , function( regionName , view ) {} );
			sinon.spy( this.control.layout , "showChildView" );
			this.control.render();
			expect( this.control.layout.showChildView.calledOnce ).toEqual( true );
		});
		
		it('Renders the form template', function(){
			this.control.render();
			expect( this.control.layout.$el.find( "#name" ).length ).toEqual( 1 );
		});
		
		it('First input/textarea/select has focus', function(){
			this.control.render();
			expect( this.control.layout.$el.find( "input,select,textarea" )[0] ).toEqual( document.activeElement );
		});
		
		it('Rerender is called trhrough controller', function(){
			this.control.render();
			sinon.stub( this.control.view , "rerender" , function() {});
			this.control.rerender();
			expect( this.control.view.rerender.calledOnce ).toEqual( true );
		});
		
		it('Toggles edit mode', function(){
			this.control.render();
			expect( this.control.layout.$el.find( ".complete" ).css( 'display' ) ).toEqual( "none" );
			this.control.layout.$el.find( ".toggleEdit" ).click();
			expect( this.control.layout.$el.find( ".complete" ).css( 'display' ) ).not.toEqual( "none" );
		});
		
		it('Validation is bound', function(){
			//sinon.spy( Backbone.Validation , "bind" );
			sinon.stub( Backbone.Validation , "bind" , function( view , options ) {} );
			this.control.render();
			expect( Backbone.Validation.bind.calledOnce ).toEqual( true );
			expect( Backbone.Validation.bind.getCall(0).args[0] ).toEqual( this.control.view );
			expect( Backbone.Validation.bind.getCall(0).args[1].invalid ).not.toBeFalsy();
			expect( Backbone.Validation.bind.getCall(0).args[1].valid ).not.toBeFalsy();
		});
	});
	describe( 'MasterDetail Control actions:' , function() {	
		beforeEach( function() {
			this.control.render();
		})
		it('OnSave is called', function(){
			this.control.layout.$el.find( ".save" ).click();
			expect( this.onSave.calledOnce ).toEqual( true );
			expect( this.onSave.getCall(0).args[0] ).toEqual( this.model );
		});
		it('OnCancel is called', function(){
			this.control.layout.$el.find( ".cancel" ).click();
			expect( this.onCancel.calledOnce ).toEqual( true );
			expect( this.onCancel.getCall(0).args[0] ).toEqual( this.control.view );
		});
		it('OnComplete is called', function(){
			this.control.layout.$el.find( ".complete" ).click();
			expect( this.onComplete.calledOnce ).toEqual( true );
			expect( this.onComplete.getCall(0).args[0] ).toEqual( this.control.view );
		});
		it('OnInputChange is called', function(){
			this.control.layout.$el.find( "#name" ).change();
			expect( this.onInputChange.calledOnce ).toEqual( true );
			expect( this.onInputChange.getCall(0).args[0] ).toEqual( this.control.view );
			expect( this.onInputChange.getCall(0).args[1].id ).toEqual( "name" );
		});
		it('OnInputClick is called', function(){
			this.control.layout.$el.find( "#name" ).click();
			expect( this.onInputClick.calledOnce ).toEqual( true );
			expect( this.onInputClick.getCall(0).args[0] ).toEqual( this.control.view );
			expect( this.onInputClick.getCall(0).args[1].id ).toEqual( "name" );
		});
		it('OnInputKeyup is called', function(){
			this.control.layout.$el.find( "#name" ).keyup();
			expect( this.onInputKeyup.calledOnce ).toEqual( true );
			expect( this.onInputKeyup.getCall(0).args[0] ).toEqual( this.control.view );
			expect( this.onInputKeyup.getCall(0).args[1].id ).toEqual( "name" );
		});
	});*/

});