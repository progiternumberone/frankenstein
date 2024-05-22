define(["marionette" , "app"],
	function(Marionette , App) {
		var StatedView = Marionette.View.extend({
			state: 0
			,initialize: function() {
				this.model = new Backbone.Model({
					stateCount: this.stateCount()
				});
			}
			,stateCount: function() {
				return this.views.length;
			}
			,regions: function() {
				let ret = {};
				for( var i = 0; i < this.stateCount(); i++ ) {
					eval( "ret.state" + i + "='.state" + i + "';" );
				}
				return ret;
			}
			,onRender: function() {
				for( var i = 0; i < this.stateCount(); i++ ) {
					this.showChildView( "state" + i , this.views[ i ] );
					this.getRegion( "state" + i ).currentView.$el.hide();
				}
				this.showState();
			}
			,showState: function( state ) {
				this.getRegion( "state" + this.state ).currentView.$el.hide();
				if( typeof state != "undefined" ) {
					this.state = state;
				}
				this.getRegion( "state" + this.state ).currentView.$el.show();
			}
			,next: function() { this.showNextState(); }
			,showNextState: function() {
				this.getRegion( "state" + this.state ).currentView.$el.hide();
				this.state++;
				if( this.state >= this.stateCount() )
					this.state = 0;
				this.showState();
			}
		});
		
		/*return the class so that requiring scripts can create more than one*/
		return StatedView;
	}
);