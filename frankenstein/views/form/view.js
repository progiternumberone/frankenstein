define(["marionette" , "app"],
	function(Marionette , App) {
		var FormView = Marionette.View.extend({
			initialize: function() {
				/*for (var key in this) {
					if( key.indexOf( "" ) === 0 ) {
						tmp = "this." + key.substring( 5 ) + "=this." + key + ";";
						eval( tmp );
					}
				}*/
				
				/*auto enable validation if the model has declared so*/
				if( Backbone.Validation && this.model && this.model.validation ) {
					
					/*validate on any attribute change*/
					this.model.on( "change" , function( model ) {
						for( var prop in this.model.changed ){
							this.model.isValid( prop )
						}
					} , this );
					
					var self = this;
					Backbone.Validation.bind( this , {
						invalid: function( view , attr , error , selector ) {
							log( "FormView: invalid attribute" );
							self.triggerMethod( "invalid:attribute" , view , attr , error , selector );
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
							log( "FormView: valid attribute" );
							self.triggerMethod( "valid:attribute" , view , attr , selector );
							var $el = view.$( "#" + attr );
							var $group = $el.closest( '.form-group' );
							var $help = $group.find( '.help-block' );
							$group.removeClass( 'has-error' );
							$help.hide();
						}
					});
					this.model.on('validated:invalid', function( model , errors ) {
						log( "FormView: invalid model" );
						self.triggerMethod( "invalid" , model , errors );
						App.trigger( "error" , errors );
					} , this );
				}
			}
			
			,events: {
				"click .toggleEdit": "doToggleEdit"	
				
				,"click .saveItem": "save"
				,"click .save": "save"
				,"click .cancel": "cancel"
				
				,"blur input":  function( e ) { this.triggerMethod( "input:blur" , this , e.target ); }
				,"blur select":  function( e ) { this.triggerMethod( "input:blur" , this , e.target ); }
				,"blur textarea":  function( e ) { this.triggerMethod( "input:blur" , this , e.target ); }
				
				,"focus input": function( e ) { this.triggerMethod( "input:focus" , this , e.target ); }
				,"focus select": function( e ) { this.triggerMethod( "input:focus" , this , e.target ); }
				,"focus textarea": function( e ) { this.triggerMethod( "input:focus" , this , e.target ); }
				
				/*events that only need to pass to controlling code*/
				/*need to do here instead of in "triggers:" cause e.target needs to be provided*/
				,"click input": function( e ) { this.triggerMethod( "input:click" , this , e.target ); }
				,"click select": function( e ) { this.triggerMethod( "input:click" , this , e.target ); }
				,"click textarea": function( e ) { this.triggerMethod( "input:click" , this , e.target ); }
				
				,"change input": function( e ) { this.triggerMethod( "input:change" , this , e.target ); }
				,"change select": function( e ) { this.triggerMethod( "input:change" , this , e.target ); }
				,"change textarea": function( e ) { this.triggerMethod( "input:change" , this , e.target ); }
								
				,"keyup input": function( e ) { this.triggerMethod( "input:keyup" , this , e.target ); }
				,"keyup select": function( e ) { this.triggerMethod( "input:keyup" , this , e.target ); }
				,"keyup textarea": function( e ) { this.triggerMethod( "input:keyup" , this , e.target ); }
			}

			,triggers: {
				/*auto trigger event for some other class to deal with*/
				"click .complete": "complete"
			}
			,onAttach: function() {
				log( "FormView: onAttach" );
				this.addDatepicker();
				$( this.$el.find( "input,select,textarea" )[0] ).focus();
			}
			,show: function() {
				this.render();
			}
			,rerender: function() {
				this.render();
				this.addDatepicker();
				$( ".datepicker-dropdown" ).hide();
				$( this.$el.find( "input,select,textarea" )[0] ).focus();
			}
			,render: function() {
				this.setInitialModelAttributes();
				Marionette.View.prototype.render.apply(this, arguments);
			}
			,onDestroy: function() {
				if( Backbone.Validation ) {
					/*make sure validation does not mult-trigger*/
					this.model.off( 'validated:invalid' );
					this.model.off( 'change' );
				}
			}
			/*event handlers*/
			,save: function( e ) {
				e.preventDefault();
				if( !Backbone.Validation || ! this.model.validation || this.model.isValid( true ) ) {
					log( "FormView: trigger save" );
					this.triggerMethod( "save" , this.model );
				}
			}
			,cancel: function( e ) {
				e.preventDefault();
				this.resetModelToInitialAttributes();
				this.triggerMethod( "cancel" , this );
			}
			,doToggleEdit: function( e ) {
				e.preventDefault();
				this.toggleEdit();
			}
			
			/*utility*/
			,setInitialModelAttributes: function() {
				if( this.options.unchangeOnCancel )
					this.initialModelAttributes = this.model.clone().attributes;
			}
			,resetModelToInitialAttributes: function() {
				if( this.options.unchangeOnCancel )
					this.model.set( this.initialModelAttributes );
			}
			,addDatepicker: function() {
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
			,toggleEdit: function() {
				var self = this;
				this.$( ".edit, .notedit" ).slideToggle( function( a ) {
					var isInEdit = $( this ).is( ":visible" ) && $( this ).hasClass( "edit" );
					if( isInEdit && ! $( self.$el.find( "input,select,textarea" )[0] ).is( ":focus" ) ) {
						$( self.$el.find( "input,select,textarea" )[0] ).focus();
					}
					self.triggerMethod( "toggled" , this , self.model , isInEdit );
				});
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
		return FormView;
	}
);