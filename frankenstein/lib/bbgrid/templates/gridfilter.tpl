<a class="rdg-sort" role="button" href="#" >
      <span class="icon-chevron-up"></span>
</a> 
<div class="rdg-filter" style="display:none">
	<div class="dropdown">
	    <a role="button" data-toggle="dropdown" class="dropdown-toggle" href="#">
	      <span class="glyphicon glyphicon-filter"></span>
	    </a>    
	    <div class="dropdown-menu pull-right">
	      <form role="form">
	        <input name="column" type="text" value="<%=column%>" hidden="true">
	        <div class="form-group">
	          <select name="operator" class="form-control input-sm operator-dropdown">
	            <option data-show="default" selected="true" value="equals">Equal To</option>
	            <option data-show="default" value="not">Not Equal To</option>
	            <option data-show="optional" value="gt">Greater Than</option>
	            <option data-show="optional" value="lt">Less Than</option>	            
	            <option data-show="optional" value="contains">Contains</option>
	            <option data-show="optional" value="between">Between</option>
	          </select>
	        </div>
	        <div class="form-group rdg-criteria1">
	          <input name="criterion" class="form-control input-sm" type="text"  value="<%=criterion%>" >
	        </div>
	        <div class="form-group  rdg-criteria2" style="display:none">
	         From <input name="criterion1" class="datepicker" id="criterion1" type="text"  value="<%=criterion1%>" >
	         To <input name="criterion2" class="datepicker" id="criterion2" type="text"  value="<%=criterion2%>" >
	        </div>
	        <div class="form-group">
		        <button class="btn btn-primary js-submit" type="submit">Filter</button>
		        <button class="btn btn-default js-clear" type="button">Clear</button>
	        </div>
	      </form>
	    </div>
	</div>
</div>  