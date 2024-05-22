define([ "app", "tpl!template/mainLayout.html"], 
 	function(App, LayoutTemplate){ 
			 
	    var mainLayout = Backbone.Marionette.View.extend({
	        template: LayoutTemplate
	        /*tagName: 'div',*/
	        ,className: 'row'
			
			/*list of containers that can have view pushed into them*/
		    ,regions: {
		        pageNavRegion: "#pageNavRegion"
		        ,page0Region: "#page0Region" 
		        ,viewCodeLinkRegion: "#viewCodeLinkRegion"
		        ,page1Region: "#page1Region" 
		        ,page2Region: "#page2Region"
		        ,page3Region: "#page3Region"
		        ,page4Region: "#page4Region"
			}
			,emptyAllRegions: function() {
				this.getRegion( "pageNavRegion" ).empty();
				this.getRegion( "page0Region" ).empty();
				this.getRegion( "viewCodeLinkRegion" ).empty();
				this.getRegion( "page1Region" ).empty();
				this.getRegion( "page2Region" ).empty();
				this.getRegion( "page3Region" ).empty();
				this.getRegion( "page4Region" ).empty();
			}
			
			/*create some variable paths to get to ui elements*/
			,ui: {
				success: "#success"
				,error: "#error"
			}
			
			/*layout is responsible for how to show messages*/
			,showMessage: function( message , isSuccess ) {
				var container = isSuccess ? this.ui.success : this.ui.error;
				var displayMessage = message;
				var displayTime = ( isSuccess ? 4000 : 8000 );
				if( typeof message == "object" ) {
					displayMessage = '<ol>';
					for( var prop in message ) {
						displayMessage += '<li>' + eval( "message." + prop ) + '</li>';
					}
					displayMessage += '</ol>';
					var displayTime = ( isSuccess ? 5000 : 20000 );
				}
				container.append( '<div class="alert alert-' + ( isSuccess ? "success" : "danger" ) + ' alert-dismissible"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + displayMessage + '</div>' );
				if( container.offset().top < $(window).scrollTop() ) {
					$('html, body').animate({ scrollTop: container.offset().top - 10 }, 500);
				}
				/*attempt to make the message display next to last click location*/
				/*if( window.event.type == "click") {
					container.css( "top" , window.event.clientY + 50 + "px" );
				}*/
				setTimeout( function() { container.children( "div:first-child" ).remove(); } , displayTime );	
			}
			,clearMessage: function( isSuccess ) {
				var container = isSuccess ? this.ui.success : this.ui.error;
				container.html( '' );
			}
	    });
		
		/*create an instance and attach it to a variable of App*/
		/*provides similar . pathing as a marionette module would have*/
		App.mainContentLayout = new mainLayout();
		/*return the one instance for all requiring scripts to use*/
		return App.mainContentLayout;
 	});
