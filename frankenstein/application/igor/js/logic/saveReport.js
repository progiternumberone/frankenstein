define([ "app" , "entity/MineralAwardReportsInstance" ], 
	function ( App , ReportsInstance ) {
		return function( MAEntriesCollectionInstance , CompanyInstance , isCompletion , amount ) {
			/*pull reportNum from company, it is there for several other purposes*/
			var reportNum = CompanyInstance.get( "reportNumber" );/*will be null for a newly created report*/
			/*load or create new report*/
			var reportToSave = reportNum == null ? new ReportsInstance.model() : ReportsInstance.getReport( reportNum );
			
			/*set report values from working instances and send to server*/
			reportToSave.save(
				{
					reportNumber: reportNum//(reportNum ? reportNum : 0)
					,reportAmount: amount
					,isComplete: isCompletion
					,company: CompanyInstance.toJSON()
					,entries: MAEntriesCollectionInstance.toJSON()
				}
				,{
					success: function() {
						if( reportNum == null ) {
							/*if a new model that is not being immediately completed*/
							/*then add to reports collection to show in list*/
							if( ReportsInstance.length == 0 && ! isCompletion ) {
								/*if ReportsInstance has not been loaded, load it so we can add the new report then goto report list*/
								ReportsInstance.fetch({
									success: function() {
										log( "BusinessLogic: saveMineralAwardGLO3Report -> fetch ReportsInstance success" );
										ReportsInstance.add( reportToSave );
										App.navigate( "report" , { trigger: true } );
										App.trigger( "success" , "Report was saved" );
									}
								});
							} else {
								/*if the new report was not immediately completed add it to the reports collection*/
								if( ! isCompletion ) {
									ReportsInstance.add( reportToSave );
								}
								/*if ReportsInstance has been loaded or the report was new goto report list*/
								App.trigger( "success" , "Report was saved" + ( isCompletion ? " &amp; marked as completed." : "" ) );
								App.navigate( "report" , { trigger: true } );
							}
						} else {
							/*if we are editing a report the ReportsInstance was already loaded so we just goto report list*/
							/*though first, if it is now completed, remove it from the reports collection*/
							if( isCompletion || reportToSave.get( "entries" ).length == 0 ) {
								ReportsInstance.remove( reportToSave );
							}
							App.navigate( "report" , { trigger: true } );
							App.trigger( "success" , "Report was saved" + ( isCompletion ? " &amp; marked as completed." : "" ) );
						}
					}
				}
			);
		}
	}
);