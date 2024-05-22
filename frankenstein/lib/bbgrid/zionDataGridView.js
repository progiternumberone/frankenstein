
define([ "app", 
         "bbGrid", "tpl!common/bbgrid/templates/gridpanel.tpl", "css!../bbgrid/css/zionDataGrid.css"], 		
		function(ZION, bbGrid, gridPanelTpl){
			ZION.module('Common.DataGrid.View', 
				function(View, ZION, Backbone, Marionette, $, _){ 
				
			     View.ZIONDataGrid = bbGrid.View.extend({});

			     View.ZIONDataGridPanel =  Marionette.ItemView.extend({
					    template: gridPanelTpl,
						tagName : "form class='gridForm'",
						events : {
								  "click .rdg-refresh"		 : "refresh",
								  "click .rdg-export-excel " : "exportDataToExcel",
								  "click .rdg-export-pdf "	 : "exportDataToPdf",
								  "click .rdg-action"		 : "applyAction",
								  "click .rdg-action2"		 : "applyAction2",
								  "click .rdg-menu"			 : "enableActionItem"
									  
						},						
 
							
						initialize: function(){
							console.log("initialize datagrid " + this.cid);
							
							//setup grid option variables..
							this.PrevScrollPosition = 0,
							this.EndOfCustomerRecords = false,
							this.FilterRequested = false,
							this.FilterCollection = undefined,
							this.IgnoreScroll = true;
							this.ResetPageNum = true;
							
							//config
							this.EnableServerFilter = true,
							this.EnableMultiSelect = false;
							this.EnableExportToExcel = false;
							this.EnableExportToPdf = false;

							if (this.fetchDataRequestEntityName !== undefined)		  	this.FetchDataRequestEntityName = this.fetchDataRequestEntityName;
							if (this.options.fetchDataRequestEntityName !== undefined)	this.FetchDataRequestEntityName = this.options.fetchDataRequestEntityName;
														
							if (this.fetchDataRequestAdditionalArguments !== undefined)		  	this.FetchDataRequestAdditionalArguments = this.fetchDataRequestAdditionalArguments;
							if (this.options.fetchDataRequestAdditionalArguments !== undefined) this.FetchDataRequestAdditionalArguments = this.options.fetchDataRequestAdditionalArguments;
							
							if (this.fetchDataOnInitialLoad !== undefined)		  	  this.FetchDataOnInitialLoad = this.fetchDataOnInitialLoad;
							if (this.options.fetchDataOnInitialLoad !== undefined)    this.FetchDataOnInitialLoad = this.options.fetchDataOnInitialLoad;
							
							if (this.disableInfiniteScroll !== undefined)		  	  this.DisableInfiniteScroll = this.disableInfiniteScroll;
							if (this.options.disableInfiniteScroll !== undefined)  	  this.DisableInfiniteScroll = this.options.disableInfiniteScroll;
							
							if (this.timeDelayBeforeNextFetch !== undefined)		  this.TimeDelayBeforeNextFetch = this.timeDelayBeforeNextFetch;
							if (this.options.timeDelayBeforeNextFetch !== undefined)  this.TimeDelayBeforeNextFetch = this.options.timeDelayBeforeNextFetch;

							if (this.enableServerFilter !== undefined)		  		  this.EnableServerFilter = this.enableServerFilter;
							if (this.options.enableServerFilter !== undefined) 		  this.EnableServerFilter = this.options.enableServerFilter;
							
							if (this.contentMaxLength !== undefined)		  		  this.ContentMaxLength = this.contentMaxLength;
							if (this.options.contentMaxLength !== undefined) 		  this.ContentMaxLength = this.options.contentMaxLength;
							
							if (this.showTooltipOnLargeContent !== undefined)		  this.ShowTooltipOnLargeContent = this.showTooltipOnLargeContent;
							if (this.options.showTooltipOnLargeContent !== undefined) this.ShowTooltipOnLargeContent = this.options.showTooltipOnLargeContent;
							
							if (this.enableMultiSelect !== undefined)		  		  this.EnableMultiSelect = this.enableMultiSelect;
							if (this.options.enableMultiSelect !== undefined) 		  this.EnableMultiSelect = this.options.enableMultiSelect;
								
							if (this.onRowClick) 		  //specified in view
								this.listenTo(this, "ZIONDataGrid:rowClick", this.onRowClick);
							else if (this.options.onRowClick)  //specified in controller
								this.listenTo(this, "ZIONDataGrid:rowClick", this.options.onRowClick);
							
							if (!this.FetchDataRequestEntityName){
								// Call fetchData handler specified because request name was not provided
								if (this.onFetchData) 		   //specified in view
									this.listenTo(this, "ZIONDataGrid:fetchData", this.onFetchData);
								else if (this.options.onFetchData)  //specified in controller
									this.listenTo(this, "ZIONDataGrid:fetchData", this.options.onFetchData);			
							}
							
							if (this.onRefreshed) 		  //specified in view
								this.listenTo(this, "ZIONDataGrid:refreshed", this.onRefreshed);
							else if (this.options.onRefreshed)  //specified in controller
								this.listenTo(this, "ZIONDataGrid:refreshed", this.options.onRefreshed);
							
							if (this.menuActionItemText !== undefined)			this.MenuActionItemText = this.menuActionItemText;
							if (this.options.menuActionItemText !== undefined)	this.MenuActionItemText = this.options.menuActionItemText;
							
							if (this.menuAction2ItemText !== undefined)			this.MenuAction2ItemText = this.menuAction2ItemText;
							if (this.options.menuAction2ItemText !== undefined)	this.MenuAction2ItemText = this.options.menuAction2ItemText;

							if (this.disableOptionsMenu !== undefined)			this.DisableOptionsMenu = this.disableOptionsMenu;
							if (this.options.disableOptionsMenu !== undefined)	this.DisableOptionsMenu = this.options.disableOptionsMenu;
							
							if (this.enableExportToExcel !== undefined)			this.EnableExportToExcel = this.enableExportToExcel;
							if (this.options.enableExportToExcel !== undefined)	this.EnableExportToExcel = this.options.enableExportToExcel;
							if (this.enableExportToPdf !== undefined)			this.EnableExportToPdf = this.enableExportToPdf;
							if (this.options.enableExportToPdf !== undefined)	this.EnableExportToPdf = this.options.enableExportToPdf;

							var that = this;
							
						   							
						},
						onRender: function(){
							console.log("rendering datagrid " + this.cid);
							var _zionDataGridPanelView = this;  

							if (!this.FetchDataOnInitialLoad){
								if(this.collection!=null && this.collection.length > 0){  //Data already provided.
									this.IgnoreScroll = false;
									this.$el.find(".spinner").hide();
								}
							}
							else{	
								_zionDataGridPanelView.$el.find(".spinner").show();
								_zionDataGridPanelView.fetchData(true, _zionDataGridPanelView.FilterCollection);
							}
							
							//Create new custom bbGrid object
							this._zionDataGridView = new View.ZIONDataGrid({        
						        colModel: (_zionDataGridPanelView.options.colModel == undefined)? _zionDataGridPanelView.colModel : _zionDataGridPanelView.options.colModel,						                   
								autofetch: false,
						        collection: (this.collection == null)? new Backbone.Collection : this.collection,
			                    onSubmitFilter: function(filter){
			                    	
			                    	_zionDataGridPanelView.FilterRequested = true;
			                    	_zionDataGridPanelView.FilterCollection = filter;
									_zionDataGridPanelView.ResetPageNum = true;

									_zionDataGridPanelView.$el.find(".spinner").show();
									_zionDataGridPanelView.fetchData(_zionDataGridPanelView.ResetPageNum, _zionDataGridPanelView.FilterCollection);
									   
			                    },			                   
			                    onClearFilter: function(filter){
			           	
			                    	_zionDataGridPanelView.FilterRequested = false;
			                    	_zionDataGridPanelView.FilterCollection = filter;
			                    	_zionDataGridPanelView.ResetPageNum = true;
			                    	
			                    	_zionDataGridPanelView.$el.find(".spinner").show();
			                    	_zionDataGridPanelView.fetchData(_zionDataGridPanelView.ResetPageNum, _zionDataGridPanelView.FilterCollection);
			                    		                    	 
			                    },
			                    onRowClick: function(model, options){
			                    	_zionDataGridPanelView.toggleActionItem();
			                    	_zionDataGridPanelView.trigger("ZIONDataGrid:rowClick", model, options);			                    	
			                    },				                    
						        
			                    enableServerFilter: this.EnableServerFilter,
			                    contentMaxLength: this.ContentMaxLength,
			                    showTooltipOnLargeContent: this.ShowTooltipOnLargeContent,
			                    multiselect: this.EnableMultiSelect
			                   
			                   							        
							});
							 console.log(this._zionDataGridView);
	
							//Add rendered bbGrid object to custom panel...
							this.$el.find('div[rel="gridContents"]').append(this._zionDataGridView.render().el);
						
							if (this.DisableOptionsMenu){	//Disable options menu
								this.$el.find(".rdg-menu").addClass("hide");
							}	
							else if (this.MenuActionItemText)
						    		this.$el.find(".rdg-action-text").text(this.MenuActionItemText);
							
					    		this.$el.find(".rdg-action2-text").text(this.MenuAction2ItemText);

							if (!this.DisableInfiniteScroll){
								//Code block for converting to a fixed grid header..
								this.$el.find('div[rel="gridFixedHeader"] table').append(this.$el.find('thead')); //Create fixed header mv.

							
								//************** Infinite scroll ******************************/	
								this.$el.find("div[rel='gridContentsPanel']").scroll( function() {
			 
									   var scrollHeight = $(this).prop('scrollHeight');
									   var divHeight =     $(this).height();
									   var scrollerEndPoint = scrollHeight - divHeight;								
									   var divScrollerTop =   $(this).scrollTop();  //Current position
	
									   if (_zionDataGridPanelView.PrevScrollPosition < divScrollerTop){  //User is scrolling down
	
										   if (_zionDataGridPanelView.IgnoreScroll == false){
											   if(divScrollerTop >= scrollerEndPoint - scrollerEndPoint * 1/4)
											   {   
												   _zionDataGridPanelView.IgnoreScroll = true;  //ignore further scrolling until data is returned from last request.
													   	
												  	console.log("processing request");
													    	
												   	_zionDataGridPanelView.$el.find(".spinner").show();
												   	_zionDataGridPanelView.ResetPageNum = false;
												   	_zionDataGridPanelView.fetchData(_zionDataGridPanelView.ResetPageNum, _zionDataGridPanelView.FilterCollection);
												   
											   }
										   }
									   }
									   _zionDataGridPanelView.PrevScrollPosition = divScrollerTop;
								   
								});
								
								//*************************************************************/		
							}
							else{
								this.$el.find(".gridFixedHeaderPanel").addClass("disabled");
								this.$el.find(".gridContentsPanel").css({"overflow" : "auto", "height" : "100%"});
							}
								
							
							if(this.EnableExportToExcel){
								this.$el.find(".rdg-menu .rdg-export-excel").removeClass("disabled");
							}
							if(this.EnableExportToPdf){
								this.$el.find(".rdg-menu .rdg-export-pdf").removeClass("disabled");
							}
						},
						onDomRefresh : function(){ //revisit
							if (!this.fetchDataOnInitialLoad){
								this.onFetchCompleted();
							}	
							
						},
						onShow: function(){
							

						},
						onFetchCompleted: function(){
							var that = this;
				    	
							setTimeout(function(){
								that.IgnoreScroll = false;
								console.log("completed");
								that.$el.find(".spinner").hide();
								
								//temporary fix for smaller resolution screens.  will run after each fetch. future combine into resizegridcontentheight
								if (!this.DisableInfiniteScroll){
									if (that.$el.find('div[rel="gridFixedHeader"]').height() > 31){  //reduce height of grid contents when header is taller
										that.$el.find("div[rel='gridContentsPanel']").addClass("tallHeader");
									}										
								}
								else{
									if (that.$el.find('.bbGrid-grid-head').height() > 31){  //reduce height of grid contents when header is taller
										that.$el.find(".bbGrid-grid-head").addClass("tallHeader");
									}	
								}
							
							}, this.TimeDelayBeforeNextFetch);

						},
						onIgnoreScroll: function(){
							this.IgnoreScroll = true;
							this.EndOfCustomerRecords = true;
							this.$el.find(".spinner").hide();
							if(this.ResetPageNum == true)  //no data returned on first fetch.
								this.$el.find(".bbGrid-noRows").addClass("visible");
						},
						fetchData: function(ResetPageNum, FilterCollection){console.log("fetchdata");
							if (this.FetchDataRequestEntityName){
						    	var obj = undefined;
						    	
						    	if (this.FetchDataRequestAdditionalArguments == undefined){
							    	if (!this.DisableInfiniteScroll)
							    		obj = ZION.request(this.FetchDataRequestEntityName, this.collection, ResetPageNum, FilterCollection);
							    	else
							    		obj = ZION.request(this.FetchDataRequestEntityName, this.collection, FilterCollection);
						    	}
						    	else {
							    	if (!this.DisableInfiniteScroll){ 
							    		obj = ZION.request(this.FetchDataRequestEntityName, this.collection, ResetPageNum, FilterCollection, this.FetchDataRequestAdditionalArguments);
							    	}
							    	else
							    		obj = ZION.request(this.FetchDataRequestEntityName, this.collection, FilterCollection, this.FetchDataRequestAdditionalArguments);
						    	}

						    	var that = this;
							    $.when(obj).done(
							    		function(retObj) {
							    			if (retObj == null)  //handle empty records
							    				that.onIgnoreScroll();
							    			else
							    				that.onFetchCompleted();
							    		});								
							}
							else{ //Call custom handler onFetchData specified in the view/controller where-ever this gridview is configured.
								if (!this.DisableInfiniteScroll){
									this.trigger("ZIONDataGrid:fetchData", ResetPageNum, FilterCollection);
								}
								else
									this.trigger("ZIONDataGrid:fetchData", FilterCollection);
									
							}

						},
						resizeGridContentHeight: function() {
							console.log("resize datagrid");
							this.$el.find("div[rel='gridContentsPanel']").css("height", 
									this.$el.height() - this.$el.find('div[rel="gridFixedHeader"]').height());
							
						},
						refresh: function(e){
							this._zionDataGridView.onSubmitGridFilter(null,this.FilterCollection);
							this.toggleActionItem();
							this.toggleAction2Item();
							
							this.trigger("ZIONDataGrid:refreshed");	//Added to fix disappearing approve button due to context of object this used in controller.	
						},
						exportDataToExcel: function(e){  //leave actual exporting to the extended views
							e.preventDefault();

							if(this.onExportData){  //Check View first 
								this.onExportData(this.FilterCollection, "excel");
							}
							else if(this.options.onExportData){ //Check Controller
								this.options.onExportData(this.FilterCollection, "excel");
							}
							else {// default basic html export.	not supported in IE.
								var that = this;
								var tableToExcel = (function() {
									  var uri = 'data:application/vnd.ms-excel;base64,'
									    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
									    , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))); }
									    , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }); } ;
									  return function(name) {

										  var tableHTML = "";
										  if (!that.DisableInfiniteScroll){											  
											  tableHTML = that.$el.find(".gridFixedHeader .bbGrid-grid").clone().find(".rdg-filter").remove().end().html();

										      tableHTML  += that.$el.find(".gridContentsPanel .bbGrid-grid").clone().find(".bbGrid-noRows").remove().end().html();
										    	
										  }
										  else
											  tableHTML = that.$el.find(".gridContentsPanel .bbGrid-grid").html();
										  
									    var ctx = {worksheet: name || 'Worksheet', table: tableHTML};
									    window.location.href = uri + base64(format(template, ctx));
									  };
									})();
								
								tableToExcel("GridDataExport");											
								
					
							}
						},
						exportDataToPdf: function(e){  //leave actual exporting to the extended views
							e.preventDefault();

							if(this.onExportData){  //Check View first 
								this.onExportData(this.FilterCollection, "pdf");
							}
							else if(this.options.onExportData){ //Check Controller
								this.options.onExportData(this.FilterCollection, "pdf");
							}

						},
						applyAction: function(e){
							e.preventDefault();
							
							if(this.onApplyAction){
								this.onApplyAction(this._zionDataGridView.selectedRows);
							}
							else if(this.options.onApplyAction){
								this.options.onApplyAction(this._zionDataGridView.selectedRows);
							}							
							
						},
						toggleActionItem: function(e){
							if ( this.EnableMultiSelect){
								if (this.$el.find(".bbGrid-row.checked").length > 1)
									this.$el.find(".rdg-action").removeClass("hide");
								else
									this.$el.find(".rdg-action").addClass("hide");								
							}

						},
						
						applyAction2: function(e){
							e.preventDefault();
							
							if(this.onApplyAction2){
								this.onApplyAction2(this._zionDataGridView.selectedRows);
							}
							else if(this.options.onApplyAction2){
								this.options.onApplyAction2(this._zionDataGridView.selectedRows);
							}							
							
						},
						toggleAction2Item: function(e){
							if ( this.EnableMultiSelect){
								if (this.$el.find(".bbGrid-row.checked").length > 1)
									this.$el.find(".rdg-action2").removeClass("hide");
								else
									this.$el.find(".rdg-action2").addClass("hide");								
							}

						}
							
				 });
			     
				 //---------------------------------------------------------------------//
					View.addInitializer(function(){
						// Do things once the module has started
						console.log("ZION.Common.DataGrid.View has started");
					});
					View.addFinalizer(function(){
					    // Do things once the module has stopped
						console.log("ZION.Common.DataGrid.View has stopped.");
						//unbind resize handler..
					});					     
			    	 
				 

	});

	return ZION.Common.DataGrid.View;

});