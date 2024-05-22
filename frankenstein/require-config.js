if( typeof( FrankensteinConfig ) === "undefined" ) {
	FrankensteinConfig = {};
}
requirejs.config({
    /*Remember: only use shim config for non-AMD scripts,
	  scripts that do not already call define(). The shim
      config will not work correctly if used on AMD scripts,
      in particular, the exports and init config will not
      be triggered, and the deps config will be confusing
      for those cases.
	*/
	
	baseUrl : "/frankenstein",
	//baseUrl : "https://s3.glo.texas.gov/frankenstein",
	paths : {
		backbone            :	"lib/backbone-min"
		,"backbone.radio"   :	"lib/backbone.radio.min"
		,"datepicker"		:	"lib/bootstrap-datepicker.min"
		,validation			: 	"lib/backbone-validation"
		,jquery 			:	"lib/jquery.min"
		,'jquery-ui' 			:	"lib/jquery-ui.min"
		,json2 				:	"lib/json2"
		,marionette 		:	"lib/backbone.marionette.min"
		,tpl				:	"lib/tpl"
		,underscore			:	"lib/underscore-min"
		//,bootstrap			:	"lib/bootstrap.min"
		,bootstrap			:	"lib/script.min"
		,bbGrid				:   "lib/bbgrid/bbGrid"
		,"bootstrap.wizard"	:	"lib/jquery.bootstrap.wizard.min"
		
		/*DT core*/
		,"datatables.net"	:   "lib/datatable/jquery.dataTables.min"
		,"datatables.net-bs"	: "lib/datatable/dataTables.bootstrap.min"
		//,"datatables.bs"	: "lib/datatable/dataTables.bootstrap.min"
		/*DT buttons*/
		,"datatables.net-buttons": "lib/datatable/dataTables.buttons.min"
		,"datatables.buttons.html5": "lib/datatable/buttons.html5.min"
		,"datatables.net-buttons-bs"	: "lib/datatable/buttons.bootstrap.min"
		,jszip			:	"lib/jszip.min"
		,pdfmake			:	"lib/pdfmake.min"
		,"vs_fonts": "lib/vs_fonts"
		/*DT select*/
		,"datatables.select": "lib/datatable/dataTables.select.min"
		
		/*frankenstein file path aliases*/
		,app: "views/app"
		,entity: "data"
		,notify: "views/notify"
		
		,masterDetail: "views/masterDetail"
		,MasterDetailView: "views/masterDetail/view"
		
		,form: "views/form"
		,FormView: "views/form/view"
		
		,dataList: "views/dataList"
		,DataListView: "views/dataList/view"
		
		,stated: "views/stated"
		,StatedView: "views/stated/view"
		
		,wizard: "views/wizard"
		,WizardView: "views/wizard/view"
		
		
		/*calling application specific*/
		,template: ( FrankensteinConfig.templateRoot ? FrankensteinConfig.templateRoot : ( FrankensteinConfig.root ? FrankensteinConfig.root + "template" : "../template" ) )
		,routes: ( FrankensteinConfig.root ? FrankensteinConfig.root + "routes" : "routes" )
		,layout: ( FrankensteinConfig.root ? FrankensteinConfig.root + "layout" : "layout" )
		,businessLogic: ( FrankensteinConfig.root ? FrankensteinConfig.root + "businessLogic" : "businessLogic" )
		,logic: ( FrankensteinConfig.root ? FrankensteinConfig.root + "logic" : "logic" )
		,appEntity: ( FrankensteinConfig.root ? FrankensteinConfig.root + "appEntity" : "appEntity" )
		,local: ( FrankensteinConfig.root ? FrankensteinConfig.root : "local" )
	},

	shim : {
		underscore : {
			exports	:	"_"
		},
		backbone : {   
			deps	:	[ "jquery", "underscore", "json2" ],
			exports	:	"Backbone"
		},
		marionette : {
			deps	:	[ "backbone" , "backbone.radio" ],
			exports : "Marionette"
		},
		validation : {
			deps	:	[ "backbone" ],
			exports : "bbValidation"
		},
		bbGrid : {
			deps	:	[ "backbone" , "css!lib/bbgrid/css/bbGrid.css" ],
			exports : "bbGrid"
		},
		/*datatable : {
			deps	:	[ "jquery" , "css!lib/datatable/datatables.min" ],
			exports : "datatable"
		},*/
		bootstrap : ["jquery"],
		'jquery-ui': ["jquery"]
	},
	map: {
			'*': {
				'css': 'lib/css.min' /*path to require-css*/
			}
	},
	urlArgs: "bust=" +  (new Date()).getTime()
});
if( FrankensteinConfig.customPaths ) {
	requirejs.config({
		paths: FrankensteinConfig.customPaths
	});
}
var lastLogTime = new Date().valueOf();
var origLogTime = new Date().valueOf();
function log(str) {
	let tmpT = new Date().valueOf();
	console.log(str + " - " + ( tmpT - lastLogTime ) + " - " + ( tmpT - origLogTime ));
	lastLogTime = tmpT; 
}
var Marionette = null;
FrankensteinConfig.theme = FrankensteinConfig.theme ? "." + FrankensteinConfig.theme : "";
require([ "bootstrap" , "marionette" , "app" , "routes"
			//,"https://s3.glo.texas.gov/uilib/js/script." + FrankensteinConfig.theme + ".min.js"
			//,"css!https://s3.glo.texas.gov/uilib/css/styles" + FrankensteinConfig.theme + ".min" 
			,"css!" + FrankensteinConfig.root + "../css/styles" + FrankensteinConfig.theme + ".min" 
			,"css!" + FrankensteinConfig.root + "../css/style", 'jquery-ui'],
  function( b , m , App , MainSubApp ) {
	 Marionette = m;
	log("Starting ZION App...");
	App.start();
	
});	
	    