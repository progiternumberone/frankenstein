define([ "entity/MineralAwardCompany" ],
	function( companyModel ) {
		/*returns the same company instance to all that require this file*/
		return new companyModel();
	}
);