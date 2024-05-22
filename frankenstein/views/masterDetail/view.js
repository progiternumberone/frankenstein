define([ "marionette" , "app" ],
function( Marionette , App ) {
	
	var MasterDetailView = Marionette.View.extend({
		initialize: function() {
			if( !this.template )
				this.template = _.template('<table class="table dataTable" cellspacing="0" width="100%"></table>aa' );
			this.datatablesConfig = this.datatablesConfig || false;
			this.detailTemplate = this.detailTemplate || null;
			this.toggleOptions = this.toggleOptions ? this.toggleOptions : {};
			this.toggleDuration = this.toggleDuration ? this.toggleDuration : 300;
			this.detailView = this.detailView ? this.detailView : ( this.detailControl ? this.detailControl : null );
			this.isDetail = false;
			
			/*take functions from the behavior and attach them to the view*/
			/*for (var key in this) {
				if( key.indexOf( "" ) === 0 ) {
					tmp = "this." + key.substring( 5 ) + "=this." + key + ";";
					eval( tmp );
				}
			}*/
			this.table = null;
			this.curRow = -1;
			
			
			if( this.autoRefresh ) {
				this.collection.on( "reset" , function() {
					log( "MasterDetailView: autoRefresh" );
					if( this.table )
						this.redraw( true );
					else
						this.render();
				} , this );
			}
			
			this.on( "grid:click" , function( model ) {
				model.off( "sync" );
				model.on( "sync" , function() {
					this.redraw();
				} , this );
				log( "MasterDetailView: handle grid:click" );
				this.renderDetails( model );
			} , this );
			
		}
		,onDestroy: function() {
			this.collection.off( "reset" );
		}
		,onRender: function() {
			if( ! this.isDetail ) {
				var self = this;
				var usingJSZip = false;
				var reqArr = [];
				/*moved these to here so they could be loaded only when needed*/
				
				if( this.collection.length > 0 ) {
					console.log( this.collection.models );
					this.datatablesConfig.data = this.collection.models;
					
					/*specify a default select style*/
					if( typeof( this.datatablesConfig.select ) == "undefined" || this.datatablesConfig.select === true )
						this.datatablesConfig.select = { style : "single" };
					
					/*listen for onSelect if business logic is not already doing so*/
					if( ! this.datatablesConfig.onSelect && this.datatablesConfig.select.style && this.datatablesConfig.select.style == "single" ) {
						this.datatablesConfig.onSelect = function( e, dt, type, indexes ) {
							self.curRow = indexes[ 0 ];
							if( self.datatablesConfig.onRowClick )
								self.datatablesConfig.onRowClick( self.collection.at( indexes[ 0 ] ) , e );
							self.triggerMethod( "grid:click" , self.collection.at( indexes[ 0 ] ) );
						};
					}
					
					log("MasterDetailView: show() - grid");
					this.showMaster();
					this.$el.find( "table" ).hide();
					
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
						
						if( self.table ) {
							self.table.destroy();
							//self.datatablesConfig.destroy = true;
							//console.log( self.datatablesConfig );
						}
						self.table = self.$el.find( "table" ).DataTable(self.datatablesConfig);
						self.$el.find( "table" ).show();
						self.table.on( 'select', function ( e, dt, type, indexes ) {
							if( self.datatablesConfig.onSelect )
								self.datatablesConfig.onSelect( e, dt, type, indexes );
						} );
						
						self.triggerMethod( "render:master" , self );
					});
				} else if( self.getRegion("empty") ) {
					log("MasterDetailView: show() - empty");
					self.showEmpty();
				}
			}
			return this;
		}
		
		,showDetails: function( model ) { return this.renderDetail( model ); }/*depreciated function name*/
		
		,renderDetail: function( model ) { return this.renderDetail( model ); }
		,renderDetails: function( model ) {
			log("MasterDetailView: renderDetails()");
			
			if( this.detailTemplate && this.detailTemplate != "" ) {
				this.showChildView( "detail" , new ( Marionette.View.extend( {
					model: model
					,template: this.detailTemplate
					,triggers: {
						"click .exit": "exit:detail"
					}
				})));
			} else if( this.detailView ) {
				this.detailView.model = model;
				log( model );
				log( this.detailView );
				if( this.getRegion( "detail" ).hasView() )
					this.detailView.render();
				else
					this.showChildView( "detail" , this.detailView );
			}
			
			if( this.autoToggle ) {
				this.once( "hide:master" , function() {
					this.once( "show:detail" , function() {
						this.triggerMethod( "render:detail" , model );
					} , this );
					this.showDetail();
				} , this );
				this.hideMaster();
			} else {
				this.showDetail();
				this.triggerMethod( "render:detail" , model );
			}
			
			return this;
		}
		,redraw: function( allRows ) {
			log( "redraw" );
			if( allRows ) {
				this.table.clear().rows.add( this.collection.models ).draw();
			} else {
				this.table.row( this.curRow ).invalidate();
			}
		}
		
		,hideDetail: function() {
			this.showHideRegion( this.getRegion( "detail" ) , true , "hide:detail" );
			return this;
		}
		
		,showDetail: function() {
			this.showHideRegion( this.getRegion( "detail" ) , false , "show:detail" );
			return this;
		}
		
		,hideEmpty: function() {
			this.showHideRegion( this.getRegion( "empty" ) , true , "hide:empty" );
			return this;
		}
		
		,showEmpty: function() {
			this.hideMaster();
			this.showHideRegion( this.getRegion( "empty" ) , false , "show:empty" );
			return this;
		}
		
		,hideMaster: function() {
			this.showHideRegion( this.getRegion( "master" ) , true , "hide:master" );
			return this;
		}
		
		,showMaster: function() {
			this.hideEmpty();
			this.showHideRegion( this.getRegion( "master" ) , false , "show:master" );
			return this;
		}
		,showHideRegion: function( region , hide , triggerName ) {
			var self = this;
			let $el = null;
			if( region ) {
				if( region.$el && region.$el.length > 0 )
					$el = region.$el;
				else
					$el = this.$( region.el );
				
				if( hide ) {
					if( this.toggleEffect ) {
						$el.hide( this.toggleEffect , this.toggleOptions , this.toggleDuration , function() { self.triggerMethod( triggerName ); } );
					} else {
						$el.hide()
						this.triggerMethod( triggerName );
					}
				}
				else {
					if( this.toggleEffect ) {
						$el.show( this.toggleEffect , this.toggleOptions , this.toggleDuration , function() { self.triggerMethod( triggerName ); } );
					} else {
						$el.show();
						this.triggerMethod( triggerName );
					}
				}
			}
		}
		
	});		
		

	return MasterDetailView;
});