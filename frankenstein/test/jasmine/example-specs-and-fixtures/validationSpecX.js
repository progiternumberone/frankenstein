define(
	[ 
		"app" 
		,"apps/reportingControl/details/reportingControlDetailsView"
		,'fixture/customerLeasesFixture'
		,'bootstrapValidator'
	]
	,function(
		RRAC
		,ReportingControlDetailsView
		,CustomerLeasesFixture
		,bootstrapValidator
	) {
		describe( 'ReportingControlDetailsView' , function() {
			beforeEach( function() {
				var model = new Backbone.Model( CustomerLeasesFixture.GET.customerLeases[ 0 ] );
				this.LeaseDetailsEditView = new ReportingControlDetailsView.LeaseDetailsEdit( { model : model } );
				this.RC_EditView = new ReportingControlDetailsView.RC_Edit( { model : model } );	
			});
			it( "renders" , function() {
				this.LeaseDetailsEditView.render();
				this.LeaseDetailsEditView.RC_Edit.show( this.RC_EditView );
				expect( this.LeaseDetailsEditView.$el.is("form") ).toEqual(true);
			});
			it( "takes changes" , function() {
				this.LeaseDetailsEditView.render();
				this.LeaseDetailsEditView.RC_Edit.show( this.RC_EditView );
				this.LeaseDetailsEditView.$el.find( "#LeaseNumber" ).val( "X1234asdfasdfasfasfasfsafd" );
				var modelx;
				this.LeaseDetailsEditView.on( "save" , function(model) {
					modelx = model;
				});
				this.LeaseDetailsEditView.$el.find( "button[type='submit']" ).click();
				expect( modelx.get( "LeaseNumber" ) ).toEqual("X1234asdfasdfasfasfasfsafd");
			});
			it( "validates" , function() {
				var tmpRegion = Marionette.Region.extend({el:'#gridLeases'});
				var tmpR = new tmpRegion();
				var self = this;
				var bvObj;	
				this.LeaseDetailsEditView.on("show", function(){
					self.LeaseDetailsEditView.render();
					self.LeaseDetailsEditView.RC_Edit.show( self.RC_EditView );
				});
				tmpR.show(this.LeaseDetailsEditView);
				
				this.LeaseDetailsEditView.$el.find('#RC_Edit')
				.bootstrapValidator({
					group: 'td'
					,excluded: []
					,fields: {
						LeaseNumber: {
							validators: {
								stringLength: {
									min: 4,
									max: 5,
									message: 'The username must be more than 6 and less than 30 characters long'
								}
							}
						}
					}
				});
				
				var bvObj = this.LeaseDetailsEditView.$el.find('#RC_Edit').data('bootstrapValidator');
				this.LeaseDetailsEditView.$el.find( "#LeaseNumber" ).val('adsfasdfasfadsf');
				//bvObj.validate();
				bvObj.validateField('LeaseNumber');
				//console.log( this.LeaseDetailsEditView.$el.find('#LeaseNumber').parent().parent().html() );
				expect( bvObj.isValidField( 'LeaseNumber' ) ).toEqual( false );
			});
		
		});
	}
);