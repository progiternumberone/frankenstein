define([ "marionette" , "app" , "layout"  , "form/behavior" , "validation"  ], 
function( Marionette , App , MainLayout , FormBehavior , validation ) {

	beforeEach( function() {
		if( $("#main-content-region").length == 0 ) {
			this.tmpEle = $( '<div id="main-content-region">abcde</div>' );
			$(document.body).append( this.tmpEle );
			/*add the main layout to the DOM*/
			App.showView( MainLayout );
		}
		this.region = App.getView().getRegion( "page1Region" );
		this.tagName = "p";
		var tmpModel = Backbone.Model.extend({
			defaults: {
				name: "test name"
				,title: "test title"
			}
			,validation: {
				name: { required: true }
			}
		});
		
		this.onSave = function( model ) {}
		this.onCancel = function( view ) {}
		this.onComplete = function( view ) {}
		this.onInputChange = function( view , el ) {}
		this.onInputClick = function( view , el ) {}
		this.onInputKeyup = function( view , el ) {}
		this.onInvalidAttribute = function( view , attr , error , selector ) {}
		this.onValidAttribute = function( view , attr , selector ) {}
		this.onInvalid = function( model , error ) {}
		sinon.stub( this , "onSave" , function( model ) {} );
		sinon.stub( this , "onCancel" , function( view ) {} );
		sinon.stub( this , "onComplete" , function( view ) {} );
		sinon.stub( this , "onInputChange" , function( view , el ) { view.model.set( el.id , el.value); } );
		sinon.stub( this , "onInputClick" , function( view , el ) {} );
		sinon.stub( this , "onInputKeyup" , function( view , el ) {} );
		sinon.stub( this , "onInvalidAttribute" );
		sinon.stub( this , "onValidAttribute" );
		sinon.stub( this , "onInvalid" );
		sinon.stub( Backbone.Validation , "bind" , function( view , options ) {} );
		
		this.model = new tmpModel();
		this.template = _.template( '<input id="name" value="<%= name %>" /><a href="#" class="save">Save</a><a href="#" class="cancel">Cancel</a><a href="#" class="complete edit" style="display: none;">Complete</a><a href="#" class="notedit toggleEdit">Edit</a>' );
		this.control = new (Marionette.View.extend({
			model: this.model
			,template: this.template
			
			,behaviors: [
				{
					behaviorClass: FormBehavior
					,unchangeOnCancel: true
				}
			]
			,onSave: this.onSave
			,onCancel: this.onCancel
			,onComplete: this.onComplete
			,onInputChange: this.onInputChange
			,onInputClick: this.onInputClick
			,onInputKeyup: this.onInputKeyup
			,onInvalidAttribute: this.onInvalidAttribute
			,onValidAttribute: this.onValidAttribute
			,onInvalid: this.onInvalid
		}));
	});
		
	afterEach( function() {
		//this.tmpEle.remove();
		this.onSave.restore();
		this.onCancel.restore();
		this.onComplete.restore();
		this.onInputChange.restore();
		this.onInputClick.restore();
		this.onInputKeyup.restore();
		this.onInvalidAttribute.restore();
		this.onValidAttribute.restore();
		this.onInvalid.restore();
		Backbone.Validation.bind.restore();
	});
	
    describe('Form Control basic:', function() {

        it('It is defined', function() {
			expect( FormBehavior ).toBeDefined();
        });
		
		it('Is added to region', function(){
			sinon.spy( this.region , "show" );
			//this.control.render();
			this.region.show( this.control );
			expect( this.region.show.calledOnce ).toEqual( true );
			this.region.show.restore();
		});

    });
	describe( 'Form Control config:' , function() {
				
		it('Accepts model config', function(){
			expect( this.control.model ).toEqual( this.model );
		});
		
		it('Accepts detailTemplate config', function(){
			this.control.render();
			expect( this.control.template ).toEqual( this.template );
		});
		
	});
	
	describe( 'Form Control view:' , function() {
		
		beforeEach( function() {
			this.region.show( this.control );
		});
		afterEach( function() {
			this.region.empty();
		});
		it('Renders the form template', function(){
			expect( this.control.$el.find( "#name" ).length ).toEqual( 1 );
		});
	
		
		it('First input/textarea/select has focus', function(){
			expect( this.control.$el.find( "input,select,textarea" )[0] ).toEqual( document.activeElement );
		});
		
		it('Rerender is called', function(){
			sinon.stub( this.control , "rerender" , function() {});
			this.control.rerender();
			expect( this.control.rerender.calledOnce ).toEqual( true );
		});
		
		it('Validation is bound', function() {
			expect( Backbone.Validation.bind.calledOnce ).toEqual( true );
			expect( Backbone.Validation.bind.getCall(0).args[0] ).toEqual( this.control );
			expect( Backbone.Validation.bind.getCall(0).args[1].invalid ).not.toBeFalsy();
			expect( Backbone.Validation.bind.getCall(0).args[1].valid ).not.toBeFalsy();
		});

	});
	
	describe( 'Utility functions:' , function() {
		beforeEach( function() {
			this.region.show( this.control );
		});
		afterEach( function() {
			this.region.empty();
		});
		it( "setInitialModelAttributes" , function() {
			//this.control.setInitialModelAttributes();
			this.control.model.set( "name" , "changed name" );
			expect( this.control.model.get( "name" ) ).toEqual( "changed name" );
		});
		it( "resetModelToInitialAttributes" , function() {
			//this.control.setInitialModelAttributes();
			this.control.model.set( "name" , "changed name" );
			//this.control.resetModelToInitialAttributes();
			this.control.$el.find( ".cancel" ).click();
			expect( this.control.model.get( "name" ) ).toEqual( "test name" );
		});
		/*it('addDatepicker', function(){
			var tempalteWithDate = _.template( '<input id="name" value="<%= name %>" /><div class="datepicker"><input id="date" /></div><a href="#" class="save">Save</a><a href="#" class="cancel">Cancel</a><a href="#" class="complete">Complete</a>' );
			this.control.detailTemplate = tempalteWithDate;
			sinon.spy( this.control.view , "addDatepicker" , function() {});
			this.control.render();
			expect( this.control.view.addDatepicker.calledOnce ).toEqual( true );
		});*/
	});
	describe( 'Public functions:' , function() {
		beforeEach( function() {
			this.region.show( this.control );
		});
		afterEach( function() {
			this.region.empty();
		});
		it('Toggles edit mode', function(){
			//this.control.render();
			expect( this.control.$el.find( ".complete" ).css( 'display' ) ).toEqual( "none" );
			this.control.$el.find( ".toggleEdit" ).click();
			expect( this.control.$el.find( ".complete" ).css( 'display' ) ).not.toEqual( "none" );
		});
	/*
		it( 'Disables the save button' , function() {
			this.control.disableSave();
			expect( this.control.$el.find( '.save[disabled=false]' ).length ).toEqual( 0 );
		});
		it( 'Disables the save button and changes text' , function() {
			this.control.disableSave( "test" );
			expect( this.control.$el.find( '.save[disabled=true]' ).length ).toEqual( 0 );
			expect( this.control.$el.find( '.save' ).html() ).toEqual( "test" );
		});
		it( 'Enables the save button' , function() {
			this.control.disableSave();
			this.control.enableSave();
			expect( this.control.$el.find( '.save[disabled=true]' ).length ).toEqual( 0 );
		});
		it( 'Enables the save button' , function() {
			this.control.disableSave();
			this.control.enableSave( 'enabled' );
			expect( this.control.$el.find( '.save[disabled=false]' ).length ).toEqual( 0 );
			expect( this.control.$el.find( '.save' ).html() ).toEqual( "enabled" );
		});
		*/
	});
	
	describe( 'Form Control actions:' , function() {
		beforeEach( function() {
			this.region.show( this.control );
		});
		afterEach( function() {
			this.region.empty();
		});
		it('OnSave is called', function(){
			this.control.$el.find( ".save" ).click();
			expect( this.onSave.calledOnce ).toEqual( true );
			expect( this.onSave.getCall(0).args[0] ).toEqual( this.model );
		});
		it('OnCancel is called', function(){
			this.control.$el.find( ".cancel" ).click();
			expect( this.onCancel.calledOnce ).toEqual( true );
			expect( this.onCancel.getCall(0).args[0] ).toEqual( this.control );
		});
		
		it('Puts back old data on cancel', function() {
			var origVal = $( "input#name" ).val();
			$( "input#name" ).val( 'changed name' ).change();
			expect( this.model.get( "name" ) ).toEqual( 'changed name' );
			$( ".cancel" ).click();
			expect( this.model.get( "name" ).toString() ).toEqual( origVal );
        });
		it('OnComplete is called', function(){
			this.control.$el.find( ".complete" ).click();
			expect( this.onComplete.calledOnce ).toEqual( true );
			expect( this.onComplete.getCall(0).args[0] ).toEqual( this.control );
		});
		
		it('OnInputChange is called', function(){
			this.control.$el.find( "#name" ).change();
			expect( this.onInputChange.calledOnce ).toEqual( true );
			expect( this.onInputChange.getCall(0).args[0] ).toEqual( this.control );
			expect( this.onInputChange.getCall(0).args[1].id ).toEqual( "name" );
		});
		it('Validation is called after attribute value change', function(){
			sinon.stub( this.control.model , "isValid" );// , function( attr ) {} );
			this.control.$el.find( "#name" ).val( '34' ).change();
			expect( this.control.model.isValid.calledOnce ).toEqual( true );
			expect( this.control.model.isValid.getCall(0).args[0] ).toEqual( 'name' );
			this.control.model.isValid.restore();			
		});
		/*
		it('OnInvalidAttribute is called on failed validation', function(){
			this.control.$el.find( "#name" ).val( '34' ).change();
			this.control.$el.find( "#name" ).val( '' ).change();
			
			expect( this.onInvalidAttribute.calledOnce ).toEqual( true );
			expect( this.onInvalidAttribute.getCall(0).args[0] ).toEqual( this.control );
			expect( this.onInvalidAttribute.getCall(0).args[1] ).toEqual( 'name' );
			expect( this.onInvalidAttribute.getCall(0).args[2] ).toEqual( 'Name is required' );
			expect( this.onInvalidAttribute.getCall(0).args[3] ).toEqual( 'name' );
		});
		it('OnValidAttribute is called on passed validation', function(){
			this.control.$el.find( "#name" ).val( '34' ).change();
			expect( this.onValidAttribute.calledOnce ).toEqual( true );
			expect( this.onValidAttribute.getCall(0).args[0] ).toEqual( this.control );
			expect( this.onValidAttribute.getCall(0).args[1] ).toEqual( 'name' );
			expect( this.onValidAttribute.getCall(0).args[2] ).toEqual( 'name' );
		});
		it('OnInvalid is called on failed model validation', function( done ){
			this.control.$el.find( "#name" ).val( '34' ).change();
			this.control.$el.find( "#name" ).val( '' ).change();
			this.control.model.isValid( true );
			var self = this;
			setTimeout( function() {
				expect( self.onInvalid.calledOnce ).toEqual( true );
				expect( self.onInvalid.getCall(0).args[0] ).toEqual( self.control.model );
				expect( self.onInvalid.getCall(0).args[1].name ).toEqual( 'Name is required' );
				done();
			} , 100 );
		});
		*/
		it('OnInputClick is called', function(){
			this.control.$el.find( "#name" ).click();
			expect( this.onInputClick.calledOnce ).toEqual( true );
			expect( this.onInputClick.getCall(0).args[0] ).toEqual( this.control );
			expect( this.onInputClick.getCall(0).args[1].id ).toEqual( "name" );
		});
		it('OnInputKeyup is called', function(){
			this.control.$el.find( "#name" ).keyup();
			expect( this.onInputKeyup.calledOnce ).toEqual( true );
			expect( this.onInputKeyup.getCall(0).args[0] ).toEqual( this.control );
			expect( this.onInputKeyup.getCall(0).args[1].id ).toEqual( "name" );
		});
		
	});

});