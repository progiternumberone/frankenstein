define([ "marionette" , "app" , "bootstrap.wizard" ],
	function( Marionette , App ) {
		var WizardView = Marionette.View.extend({
			initialize: function() {
				for (var key in this) {
					if( key.indexOf( "view_" ) === 0 ) {
						tmp = "this." + key.substring( 5 ) + "=this." + key + ";";
						eval( tmp );
					}
				}
				this.idx = 0;
				this.farthest = 0;
				if( ! this.config )
					this.config = {};
				
				
				this._addTabChange();
				this._addTabPrevOnly();
				this._addTabToFarthest();
				
				
				
				
				
			}
			
			,events: {
			}

			,triggers: {
			}
			,onAttach: function() {
				this._addProgressBar();
				this.$el.bootstrapWizard( this.config );
			}
			
			,_addProgressBar: function() {
				if( this.$el.find( '.progress-bar' ).length > 0 ) {
					var self = this;
					if( this.config.onTabShow )
						var tmp = this.config.onTabShow;
					this.config.onTabShow = function( tab , $navigation , index ) {
						var total = $navigation.find( 'li' ).length;
						var current = index + 1;
						var percent = ( current / total ) * 100;
						self.$el.find( '.progress-bar' ).css( { width: percent + '%' } );
						if( tmp )
							return tmp( tab , $navigation , index );
					}
				}
			}
			,_addTabChange: function() {
				var self = this;
				if( this.config.onTabChange )
					var tmpChange = this.config.onTabChange;
				this.config.onTabChange = function( curTab , navigation , curIdx , newIdx ) {
					self.farthest = self.farthest > newIdx ? self.farthest : newIdx;
					if( tmpChange ) tmpChange( curTab , navigation , curIdx , newIdx );
				}
			}
			,_addTabPrevOnly: function() {
				if( this.tabPrevOnly ) {
					var self = this;
					var tmp = null;
					if( this.config.onTabClick )
						tmp = this.config.onTabClick;
					this.config.onTabClick = function( curTab , navigation , curIdx , newIdx , newTab ) {
						if( tmp ) tmp( curTab , navigation , curIdx );
						
						var ret = newIdx <= curIdx;
						if( ! ret ) {
							self.triggerMethod( "prevent:tab" , curIdx , newIdx );
						}
						return ret;
					}
				}
			}
			,_addTabToFarthest: function() {
				if( this.tabToFarthest && ! this.tabPrevOnly ) {
					var self = this;
					var tmp = null;
					if( this.config.onTabClick )
						tmp = this.config.onTabClick;
					this.config.onTabClick = function( curTab , navigation , curIdx , newIdx , newTab ) {
						if( tmp ) tmp( curTab , navigation , curIdx );
						
						var ret = newIdx <= self.farthest;
						if( ! ret ) {
							self.triggerMethod( "prevent:tab" , curIdx , newIdx );
						}
						return ret;
					}
				}
			}
		});
		
		/*return the class so that requiring scripts can create more than one*/
		return WizardView;
	}
);