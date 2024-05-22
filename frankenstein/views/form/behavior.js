define(["marionette" , "app"],
	function(Marionette , App) {
		var FormBehavior = Marionette.Behavior.extend({
			initialize: function() {
				for (var key in this) {
					if( key.indexOf( "view_" ) === 0 ) {
						tmp = "this.view." + key.substring( 5 ) + "=this." + key + ";";
						eval( tmp );
					}
				}
				
				/*auto enable validation if the model has declared so*/
				if( Backbone.Validation && this.view.model && this.view.model.validation ) {
					
					/*validate on any attribute change*/
					this.view.model.on( "change" , function( model ) {
						for( var prop in this.view.model.changed ){
							this.view.model.isValid( prop )
						}
					} , this );
					
					var self = this;
					Backbone.Validation.bind( this.view , {
						invalid: function( view , attr , error , selector ) {
							log( "FormBehavior: invalid attribute" );
							self.view.triggerMethod( "invalid:attribute" , view , attr , error , selector );
							var $el = view.$( "#" + attr );
							if( $el.length > 0 ) {
								var $group = $el.closest( '.form-group' );
								var $help = $group.find( '.help-block' );
								$group.addClass( 'has-error' );
								if( $help.length > 0 ) {
									$help.show();
									$help.html( error );
								}
								else {
									$( '<span class="help-block">' + error + '</span>' ).insertAfter( $el.parent().hasClass( "input-group" ) ? $el.parent() : $el );
								}
							}
						}
						,valid: function( view , attr , selector ) {
							log( "FormBehavior: valid attribute" );
							self.view.triggerMethod( "valid:attribute" , view , attr , selector );
							var $el = view.$( "#" + attr );
							var $group = $el.closest( '.form-group' );
							var $help = $group.find( '.help-block' );
							$group.removeClass( 'has-error' );
							$help.hide();
						}
					});
					this.view.model.on('validated:invalid', function( model , errors ) {
						log( "FormBehavior: invalid model" );
						self.view.triggerMethod( "invalid" , model , errors );
						App.trigger( "error" , errors );
					} , this );
				}
			}
			
			,events: {
				"click .toggleEdit": "doToggleEdit"	
				
				,"click .saveItem": "save"
				,"click .save": "save"
				,"click .cancel": "cancel"
				
				,"blur input":  function( e ) { this.view.triggerMethod( "input:blur" , this.view , e.target ); }
				,"blur select":  function( e ) { this.view.triggerMethod( "input:blur" , this.view , e.target ); }
				,"blur textarea":  function( e ) { this.view.triggerMethod( "input:blur" , this.view , e.target ); }
				
				,"focus input": function( e ) { this.view.triggerMethod( "input:focus" , this.view , e.target ); }
				,"focus select": function( e ) { this.view.triggerMethod( "input:focus" , this.view , e.target ); }
				,"focus textarea": function( e ) { this.view.triggerMethod( "input:focus" , this.view , e.target ); }
				
				/*events that only need to pass to controlling code*/
				/*need to do here instead of in "triggers:" cause e.target needs to be provided*/
				,"click input": function( e ) { this.view.triggerMethod( "input:click" , this.view , e.target ); }
				,"click select": function( e ) { this.view.triggerMethod( "input:click" , this.view , e.target ); }
				,"click textarea": function( e ) { this.view.triggerMethod( "input:click" , this.view , e.target ); }
				
				,"change input": function( e ) { this.view.triggerMethod( "input:change" , this.view , e.target ); }
				,"change select": function( e ) { this.view.triggerMethod( "input:change" , this.view , e.target ); }
				,"change textarea": function( e ) { this.view.triggerMethod( "input:change" , this.view , e.target ); }
								
				,"keyup input": function( e ) { this.view.triggerMethod( "input:keyup" , this.view , e.target ); }
				,"keyup select": function( e ) { this.view.triggerMethod( "input:keyup" , this.view , e.target ); }
				,"keyup textarea": function( e ) { this.view.triggerMethod( "input:keyup" , this.view , e.target ); }
			}

			,triggers: {
				/*auto trigger event for some other class to deal with*/
				"click .complete": "complete"
			}
			,onAttach: function() {
				log( "FormBehavior: onAttach" );
				this.view.addDatepicker();
				$( this.$el.find( "input,select,textarea" )[0] ).focus();
			}
			,show: function() {
				this.view.render();
			}
			,view_rerender: function() {
				this.render();
				this.addDatepicker();
				$( ".datepicker-dropdown" ).hide();
				$( this.$el.find( "input,select,textarea" )[0] ).focus();
			}
			,onRender: function() {
				log("FormBehavior: show()");
				this.setInitialModelAttributes();
				
			}
			,onDestroy: function() {
				if( Backbone.Validation ) {
					/*make sure validation does not mult-trigger*/
					this.view.model.off( 'validated:invalid' );
					this.view.model.off( 'change' );
				}
			}
			/*event handlers*/
			,save: function( e ) {
				e.preventDefault();
				if( !Backbone.Validation || this.view.model.isValid( true ) ) {
					log( "FormBehavior: trigger save" );
					this.view.triggerMethod( "save" , this.view.model );
				}
			}
			,cancel: function( e ) {
				e.preventDefault();
				this.resetModelToInitialAttributes();
				this.view.triggerMethod( "cancel" , this.view );
			}
			,doToggleEdit: function( e ) {
				e.preventDefault();
				this.view.toggleEdit();
			}
			
			/*utility*/
			,setInitialModelAttributes: function() {
				if( this.options.unchangeOnCancel )
					this.initialModelAttributes = this.view.model.clone().attributes;
			}
			,resetModelToInitialAttributes: function() {
				if( this.options.unchangeOnCancel )
					this.view.model.set( this.initialModelAttributes );
			}
			,view_addDatepicker: function() {
				if( this.$el.find( ".datepicker" ).length > 0 ) {
					var self = this;
					log( "add datepicker" );
					require( ["datepicker" , "css!lib/bootstrap-datepicker.min.css"] , function() {
						self.$( ".datepicker" ).each( function() {
							log( "adding datepicker to" + this.className );
							$( this ).datepicker( $( this ).data( 'datePickerOptions' ) );
						});
					});
				}
			}
			
			/*public functions*/
			,view_toggleEdit: function() {
				this.$( ".edit, .notedit" ).slideToggle();
				$( this.$el.find( "input,select,textarea" )[0] ).focus();
			}
			,enableSave: function( txt ) {
				this.$( ".saveItem, .save" ).attr( "disabled" , false );
				this.$( ".saveItem, .save" ).toggleClass( "btn-primary" , true ).toggleClass( "btn-default" , false );
				this.$( ".saveItem, .save" ).html( txt );
			}
			,disableSave: function( txt ) {
				this.$( ".saveItem, .save" ).attr( "disabled" , true );
				this.$( ".saveItem, .save" ).toggleClass( "btn-primary" , false ).toggleClass( "btn-default" , true );
				this.$( ".saveItem, .save" ).html( txt );
			}
		});
		
		/*return the class so that requiring scripts can create more than one*/
		return FormBehavior;
	}
);