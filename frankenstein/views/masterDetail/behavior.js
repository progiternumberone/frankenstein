define([ "marionette" , "app" ],
function( Marionette , App ) {
	
	var MasterDetailBehavior = Marionette.Behavior.extend({
		initialize: function() {
			if( !this.view.template )
				this.view.template = _.template('<table class="table dataTable" cellspacing="0" width="100%"></table>aa' );
			this.datatablesConfig = this.options.datatablesConfig || false;
			this.view.detailTemplate = this.options.detailTemplate || null;
			this.view.detailControl = this.options.detailControl || null;
			this.view.isDetail = false;
			
			/*take functions from the behavior and attach them to the view*/
			for (var key in this) {
				if( key.indexOf( "view_" ) === 0 ) {
					tmp = "this.view." + key.substring( 5 ) + "=this." + key + ";";
					eval( tmp );
				}
			}
			this.view.table = null;
			this.view.curRow = -1;
			
			
			if( this.options.autoRefresh ) {
				this.view.collection.on( "reset" , function() {
					log( "MasterDetailBehavior: autoRefresh" );
					this.view.render();
				} , this );
			}
			
			this.view.on( "grid:click" , function( model ) {
				model.off( "sync" );
				model.on( "sync" , function() {
					this.view.redraw();
				} , this );
				log( "MasterDetailBehavior: handle grid:click" );
				this.renderDetails( model );
			} , this );
			
		}
		,onDestroy: function() {
			this.view.collection.off( "reset" );
		}
		,onRender: function() {
			if( ! this.view.isDetail ) {
				var self = this;
				var usingJSZip = false;
				var reqArr = [];
				/*moved these to here so they could be loaded only when needed*/
				
				if( this.view.collection.length > 0 ) {
					
					this.datatablesConfig.data = this.view.collection.models;
					/*specify a default select style*/
					if( typeof( this.datatablesConfig.select ) == "undefined" || this.datatablesConfig.select === true )
						this.datatablesConfig.select = { style : "single" };
					
					/*listen for onSelect if business logic is not already doing so*/
					if( ! this.datatablesConfig.onSelect && this.datatablesConfig.select.style && this.datatablesConfig.select.style == "single" ) {
						this.datatablesConfig.onSelect = function( e, dt, type, indexes ) {
							self.view.curRow = indexes[ 0 ];
							if( self.datatablesConfig.onRowClick )
								self.datatablesConfig.onRowClick( self.view.collection.at( indexes[ 0 ] ) , e );
							self.view.triggerMethod( "grid:click" , self.view.collection.at( indexes[ 0 ] ) );
						};
					}
					reqArr.push( "datatables.net" );
					reqArr.push( "datatables.net-bs" );
					reqArr.push( "css!lib/datatable/dataTables.bootstrap.min" );
					reqArr.push( "datatables.select" );
					reqArr.push( "css!lib/datatable/select.bootstrap.min" );
					if( typeof this.datatablesConfig.buttons != "undefined" ) {
						if( this.datatablesConfig.buttons.indexOf( "excel" ) > -1 ) {
							reqArr.push( "jszip" );
							usingJSZip = true;
						}
						if( this.datatablesConfig.buttons.indexOf( "pdf" ) > -1 ) {
							reqArr.push( "vs_fonts" );
							reqArr.push( "pdfmake" );
						}
						reqArr.push( "datatables.net-buttons-bs" );
						reqArr.push( "datatables.buttons.html5" );
						reqArr.push( "css!lib/datatable/dataTables.buttons.min" );
					}
								
					require( reqArr ,
					function( a , b , c , d , e , jszip ) {
						
						/*need to make jszip global to work with datatable buttons*/
						if( usingJSZip && jszip && typeof window.JSZip == "undefined" )
							window.JSZip = jszip;
						
						log("MasterDetailBehavior: show() - grid");					
						self.view.showMaster();
						self.view.triggerMethod( "render:master" , self.view );

						if( self.view.table )
							self.view.table.destroy();
						self.view.table = self.$el.find( "table" ).DataTable(self.datatablesConfig);
						
						self.view.table.on( 'select', function ( e, dt, type, indexes ) {
							if( self.datatablesConfig.onSelect )
								self.datatablesConfig.onSelect( e, dt, type, indexes );
						} );
					});
				} else if( self.view.getRegion("empty") ) {
					log("MasterDetailBehavior: show() - empty");
					self.view.showEmpty();
				}
			}
			return this.view;
		}
		
		,showDetails: function( model ) { return this.renderDetail( model ); }/*depreciated function name*/
		
		,renderDetails: function( model ) {
			log("MasterDetailBehavior: renderDetails()");
			if( this.view.detailTemplate && this.view.detailTemplate != "" ) {
				this.view.showChildView( "detail" , new ( Marionette.View.extend( {
					model: model
					,template: this.view.detailTemplate
					,triggers: {
						"click .exit": "exit:detail"
					}
				})));
			} else if( this.view.detailControl ) {
				this.view.detailControl.model = model;
				log( model );
				log( this.view.detailControl );
				if( this.view.getRegion( "detail" ).hasView() )
					this.view.detailControl.render();
				else
					this.view.showChildView( "detail" , this.view.detailControl );
			}
			this.view.showDetail();
			this.view.triggerMethod( "render:detail" , model );
			return this.view;
		}
		,view_redraw: function( allRows ) {
			log( "redraw" );
			if( allRows )
				this.table.draw( false );
			else
				this.table.row( this.curRow ).invalidate();
		}
		
		,view_hideDetail: function() {
			this.showHideRegion( this.getRegion( "detail" ) , true );
			this.triggerMethod( "hide:detail" );
			return this;
		}
		
		,view_showDetail: function() {
			this.showHideRegion( this.getRegion( "detail" ) );
			this.triggerMethod( "show:detail" );
			return this;
		}
		
		,view_hideEmpty: function() {
			this.showHideRegion( this.getRegion( "empty" ) , true );
			this.triggerMethod( "hide:empty" );
			return this;
		}
		
		,view_showEmpty: function() {
			this.hideMaster();
			this.showHideRegion( this.getRegion( "empty" ) );
			this.triggerMethod( "show:empty" );
			return this;
		}
		
		,view_hideMaster: function() {
			this.showHideRegion( this.getRegion( "master" ) , true );
			this.triggerMethod( "hide:master" );
			return this;
		}
		
		,view_showMaster: function() {
			this.hideEmpty();
			this.showHideRegion( this.getRegion( "master" ) );
			this.triggerMethod( "show:master" );
			return this;
		}
		,view_showHideRegion: function( region , hide ) {
			if( region ) {
				if( region.$el && region.$el.length > 0 )
					region.$el.toggle( !hide );
				else
					this.$( region.el ).toggle( !hide );
			}
		}
		
	});		
		

	return MasterDetailBehavior;
});