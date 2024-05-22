define([ "app" , "tpl!template/examples.html" ],
	function( App , Template ) {
		var HomeView = Marionette.View.extend({
			template: Template
			,initialize: function() {
				this.render();
				this.template = this.options.template || this.template;
			}
			,events: {
				"click #leaseSearchBtn": "searchLease"
			}
			,ui: {
				"tbLeaseSearch": "#leaseSearch"
			}
			,searchLease: function( e ) {
				e.preventDefault();
				var id = this.ui.tbLeaseSearch.val();
				App.navigate( "lease/" + id , { trigger: true } );
				return false;
			}
		});
		
		/*return the class so that requiring scripts can create more than one*/
		return HomeView;
	}
);