define([ "marionette" , "app" , "bootstrap.wizard" ],
	function( Marionette , App ) {
		var WizardBehavior = Marionette.Behavior.extend({
			initialize: function() {
				for (var key in this) {
					if( key.indexOf( "view_" ) === 0 ) {
						tmp = "this.view." + key.substring( 5 ) + "=this." + key + ";";
						eval( tmp );
					}
				}
				this.view.idx = 0;
				this.view.farthest = 0;
				if( ! this.options.config )
					this.options.config = {};
				
				
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
				this.$el.bootstrapWizard( this.options.config );
			}
			
			,_addProgressBar: function() {
				if( this.$el.find( '.progress-bar' ).length > 0 ) {
					var self = this;
					if( this.options.config.onTabShow )
						var tmp = this.options.config.onTabShow;
					this.options.config.onTabShow = function( tab , $navigation , index ) {
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
				if( this.options.config.onTabChange )
					var tmpChange = this.options.config.onTabChange;
				this.options.config.onTabChange = function( curTab , navigation , curIdx , newIdx ) {
					self.view.farthest = self.view.farthest > newIdx ? self.view.farthest : newIdx;
					if( tmpChange ) tmpChange( curTab , navigation , curIdx , newIdx );
				}
			}
			,_addTabPrevOnly: function() {
				if( this.options.tabPrevOnly ) {
					var self = this;
					var tmp = null;
					if( this.options.config.onTabClick )
						tmp = this.options.config.onTabClick;
					this.options.config.onTabClick = function( curTab , navigation , curIdx , newIdx , newTab ) {
						if( tmp ) tmp( curTab , navigation , curIdx );
						
						var ret = newIdx <= curIdx;
						if( ! ret ) {
							self.view.triggerMethod( "prevent:tab" , curIdx , newIdx );
						}
						return ret;
					}
				}
			}
			,_addTabToFarthest: function() {
				if( this.options.tabToFarthest && ! this.options.tabPrevOnly ) {
					var self = this;
					var tmp = null;
					if( this.options.config.onTabClick )
						tmp = this.options.config.onTabClick;
					this.options.config.onTabClick = function( curTab , navigation , curIdx , newIdx , newTab ) {
						if( tmp ) tmp( curTab , navigation , curIdx );
						
						var ret = newIdx <= self.view.farthest;
						if( ! ret ) {
							self.view.triggerMethod( "prevent:tab" , curIdx , newIdx );
						}
						return ret;
					}
				}
			}
		});
		
		/*return the class so that requiring scripts can create more than one*/
		return WizardBehavior;
	}
);