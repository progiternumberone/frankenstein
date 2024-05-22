var tests = [];
for (var file in window.__karma__.files) {
    if (/Spec\.js$/.test(file)) {
        tests.push(file);
    }
}
var FrankensteinConfig = {};
FrankensteinConfig.root = "/absoluteQ:/frankenstein/application/igor/js/";
FrankensteinConfig.templateRoot = "/absoluteQ:/frankenstein/application/igor/template";
requirejs.config({
    /*Remember: only use shim config for non-AMD scripts,
	  scripts that do not already call define(). The shim
      config will not work correctly if used on AMD scripts,
      in particular, the exports and init config will not
      be triggered, and the deps config will be confusing
      for those cases.
	*/
	
	baseUrl : "base",
	paths : {
		backbone 			:	"lib/backbone-min"
		,"backbone.radio"	:	"lib/backbone.radio.min"
		,"datepicker"		:	"lib/bootstrap-datepicker.min"
		,validation			: 	"lib/backbone-validation"
		,jquery 			:	"lib/jquery.min"
		,json2 				:	"lib/json2"
		,marionette 		:	"lib/backbone.marionette.min"
		,tpl				:	"lib/tpl"
		,underscore			:	"lib/underscore-min"
		,bootstrap			:	"lib/bootstrap.min"
		,bbGrid				:   "lib/bbgrid/bbGrid"
		,fixture: "test/jasmine/fixture"
		
		
		/*application file path aliases*/
		,app: "control/app"
		,entity: "data"
		,notify: "control/notify"
		,masterDetail: "control/masterDetail"
		,dataList: "control/dataList"
		,form: "control/form"
		,stated: "control/stated"
		,template: ( FrankensteinConfig.templateRoot ? FrankensteinConfig.templateRoot : ( FrankensteinConfig.root ? FrankensteinConfig.root + "template" : "../template" ) )
		,routes: ( FrankensteinConfig.root ? FrankensteinConfig.root + "routes" : "routes" )
		,layout: ( FrankensteinConfig.root ? FrankensteinConfig.root + "layout" : "layout" )
		,logic: ( FrankensteinConfig.root ? FrankensteinConfig.root + "logic" : "logic" )
		//,businessLogic: ( FrankensteinConfig.root ? FrankensteinConfig.root + "businessLogic" : "businessLogic" )
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
			exports : "validation"
		},
		bbGrid : {
			deps	:	[ "backbone" , "css!lib/bbgrid/css/bbGrid.css" ],
			exports : "bbGrid"
		},
		bootstrap : ["jquery"]
	},
	map: {
			'*': {
				'css': 'lib/css.min' /*path to require-css*/
			}
	},
	urlArgs: "bust=" +  (new Date()).getTime(),
	deps: tests,
	callback: window.__karma__.start
});
function log(str) { 
	//console.log(str); 
}
var Marionette = null;
require([ "marionette" ],
  function( m ) {
	 Marionette = m;
});
/*var Marionette = null;
require([ "bootstrap" , "marionette" , "app" , "routes"],
  function( b , m , App , MainSubApp ) {
	 Marionette = m;
	log("Starting ZION App...");
	App.start();
	
});	*/
	    