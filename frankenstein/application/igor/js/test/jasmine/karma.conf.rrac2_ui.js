// Karma configuration
// Generated on Fri Jul 11 2014 11:19:48 GMT-0500 (Central Daylight Time)
var FrankensteinConfig = {};
FrankensteinConfig.root = "Q:/frankenstein/application/igor/js/";
FrankensteinConfig.templateRoot = "Q:/frankenstein/application/igor/template";

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
	//basePath: 'C:/Users/JOKing/Documents/repo/frankenstein/',
	basePath: 'Q:/frankenstein/',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'requirejs', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
		{pattern: 'control/**/*', included: false}
		,{pattern: 'control/app.js', included: false}
		,{pattern: FrankensteinConfig.root + '/logic/*.js', included: false}
		,{pattern: FrankensteinConfig.root + '*.js', included: false}
		,{pattern: FrankensteinConfig.root + 'routes.js', included: false}
		,{pattern: FrankensteinConfig.templateRoot + '/*.html', included: false}
		,{pattern: FrankensteinConfig.templateRoot + '/controls/*.html', included: false}
		,{pattern: 'data/*.js', included: false}
		,{pattern: 'lib/*', included: false}
		,{pattern: 'lib/**/*', included: false}
		,{pattern: 'test/jasmine/fixture/*.js', included: false}
		,{pattern: FrankensteinConfig.root + 'test/jasmine/*Spec.js', included: false}
		,{pattern: FrankensteinConfig.root + 'test/jasmine/specs/*Spec.js', included: false}
		//,{pattern: FrankensteinConfig.root + 'test/jasmine/specs/router-mineralAwardEntry-Spec.js', included: false}
		,FrankensteinConfig.root + 'test/jasmine/requireConf.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress','html'],

	htmlReporter: {
		outputDir: 'karma_html', // where to put the reports  
		//templatePath: null, // set if you moved jasmine_template.html 
		focusOnFailures: true, // reports show failures on start 
		namedFiles: false, // name files instead of creating sub-directories 
		pageTitle: "karma test", // page title for reports; browser info by default 
		//urlFriendlyName: false, // simply replaces spaces with _ for files/dirs 
		reportName: 'report', // report summary filename; browser info by default 
		// experimental 
		preserveDescribeNesting: false, // folded suites stay folded  
		foldAll: false // reports start folded (only with preserveDescribeNesting) 
	},
    // web server port
    port: 9876,
	crossOriginAttribute: false,

    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['PhantomJS', 'Chrome'],
    //browsers: ['PhantomJS'],
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
