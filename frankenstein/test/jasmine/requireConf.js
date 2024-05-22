var tests = [];
for (var file in window.__karma__.files) {
    if (/Spec\.js$/.test(file)) {
        tests.push(file);
    }
}
requirejs.config({
    /*Remember: only use shim config for non-AMD scripts,
	  scripts that do not already call define(). The shim
      config will not work correctly if used on AMD scripts,
      in particular, the exports and init config will not
      be triggered, and the deps config will be confusing
      for those cases.
	*/
	
	baseUrl : "/base",
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
		,template: "test/jasmine/ui"
		,layout: "test/jasmine/ui/layout"
		
		
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
		/*,"backbone.picky"	:	"vendor/backbone.picky"*/
		/*,"backbone.syphon"	:	"vendor/backbone.syphon"*/
		/*,"backbone.paginator":	"vendor/backbone.paginator"*/
		/*,"backbone.pageable" :   "vendor/backgrid/backbone-pageable"*/
		/*,"jquery.jeditable"	:	"vendor/jquery.jeditable"*/
		/*,"jquery-ui" 		:	"vendor/jquery-ui"*/
		/*,splitter			:	"vendor/jquery.splitter-0.14.0"*/
		/*,"jquery-1.4.3"		:	"vendor/jquery-1.4.3.min"*/
		/*,localstorage 		:	"vendor/backbone.localstorage"*/
		/*,spin 				:	"vendor/spin"*/
		/*,"spin.jquery"		:	"vendor/spin.jquery"*/
		/*,utilities			:	"common/utilities"*/
		/*,backgrid			:	"vendor/backgrid/backgrid-0.3.5"*/
		/*,"backgrid-filter"		:	"vendor/backgrid/backgrid-filter"*/
		/*,"backgrid-paginator"	:	"vendor/backgrid/backgrid-paginator" */
		/*,"backgrid-select-all"	:	"vendor/backgrid/backgrid-select-all" */
		/*,"backgrid-select2-cell"	:	"vendor/backgrid/backgrid-select2-cell" */
		/*,"backgrid-select-filter":	"vendor/backgrid/backgrid-select-filter" */
		/*,"backgrid-text-cell"	:	"vendor/backgrid/backgrid-text-cell"*/
		/*,"backgrid-infinator"	:	"vendor/backgrid/backgrid-infinator"*/
		/*,"backgrid-moment.cell"	:	"vendor/backgrid/backgrid-moment.cell" */
		/*,"backgrid-object-cell"	:	"vendor/backgrid/backgrid-object-cell" */
		/*,bootstrapValidator		:   "vendor/bootstrapValidator.min"*/
		
		
		/*application file path aliases*/
		,app: "control/app"
		,entity: "data"
		,notify: "control/notify"
		,masterDetail: "control/masterDetail"
		,dataList: "control/dataList"
		,form: "control/form"
		,stated: "control/stated"
		//,template: "../template"
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
		/*,,
		"backbone.picky"	:	[ "backbone" ],
		"backbone.paginator":	[ "backbone" ],
		"backbone.syphon"	:	{
			deps	: 	[ "backbone" ],
			exports : 	"Backbone.Syphon"
		},
		"jquery-ui"		:	[ "jquery" ],
		localstorage	:	[ "backbone" ],
		"spin.jquery"	:	[ "spin", "jquery" ],,
		
		"jquery.jeditable"	: 	{
			deps	:	[ "jquery"],
		},

		splitter		:	["jquery-1.4.3"],

		backgrid : {
			deps   : 	["backbone"],
			exports:	"Backgrid"
		},
		"backgrid-filter"		:	[ "backgrid" ],
		"backgrid-moment.cell"	:	[ "backgrid" ],		
		"backgrid-object-cell"	:	[ "backgrid" ],
		"backgrid-paginator"	:	[ "backgrid" ],
		"backgrid-select2-cell"	:	[ "backgrid" ],
		"backgrid-select-all"	:	[ "backgrid" ],
		"backgrid-select-filter":	[ "backgrid" ],
		"backgrid-text-cell"	:	[ "backgrid" ],
		"backgrid-infinator"	:	[ "backgrid" ],
		bootstrapValidator : {
			deps   : 	["bootstrap"],
			exports:	"BootstrapValidator"
		},		
		*/
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
	console.log(str); 
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
	    