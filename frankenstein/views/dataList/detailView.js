define([ "marionette" ],
	function( Marionette ) {
		var ItemView = Marionette.View.extend({
			template: _.template( "ItemView: No template provided" )
			/*
			,className: ""
			*/
			,tagName: "dd"
			,initialize: function() {
				var self = this;
				/*listen for the model to be saved to add assigned checkbox and hide editing*/
				this.model.on( "sync" , function() {
					self.toggleEdit();
					self.render();
				});
				this.template = this.options.detailTemplate || this.template;
			}
			
			,events: {
				"click .toggleEdit": "onToggleEdit"
				,"change input": "onInputChange"
			}
			
			,triggers: {
				/*auto trigger event for some other class to deal with*/
				"click .saveItem": "save"
				,"click .save": "save"
			}
			
			,onAttach: function() {
				/*show edit mode if only one item is in the collection*/
				if( this.model.collection.length == 1 )
					this.toggleEdit();
			}
			
			,onToggleEdit: function( e ) {
				e.preventDefault();
				this.toggleEdit();
				return false;
			}
			
			,onInputChange: function( e ) {
				e.preventDefault();
				this.trigger( "input:change" , this , e.target );
				return false;
			}
			
			,toggleEdit: function() {
				this.$( ".edit, .notedit" ).slideToggle();
			}
			,enableSave: function( txt ) {
				this.$( ".saveItem" ).attr( "disabled" , false );
				this.$( ".saveItem" ).toggleClass( "btn-primary" , true ).toggleClass( "btn-default" , false );
				this.$( ".saveItem" ).html( txt );
			}
			,disableSave: function( txt ) {
				this.$( ".saveItem" ).attr( "disabled" , true );
				this.$( ".saveItem" ).toggleClass( "btn-primary" , false ).toggleClass( "btn-default" , true );
				this.$( ".saveItem" ).html( txt );
			}
		});
		
		/*return the class so that requiring scripts can create more than one*/
		return ItemView;
	}
);