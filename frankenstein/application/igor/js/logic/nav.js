define([ "app" , "tpl!template/MineralAward_nav.html" ], function ( App , template ) {
	
	return function( activeClassId ) {
		return false;
		if( App.getView() && App.getView().getRegion( "pageNavRegion" ) && ! App.getView().getRegion( "pageNavRegion" ).hasView() ) {
			/*show basic view in a region*/
			App.getView().showChildView( "pageNavRegion" , new Marionette.View( { template: template } ) );
		}
		/*highlight the active nav tab*/
		$( ".nav li" ).removeClass( "active" );
		if( activeClassId ) {
			$( ".nav li." + activeClassId ).addClass( "active" );
		}
	}
});