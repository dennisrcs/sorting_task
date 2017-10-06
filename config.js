$(document).ready(function(){
	$("#visible_time").val(localStorage.getItem("visibleTime"));
	$("#fadeout_time").val(localStorage.getItem("fadeoutTime"));
	$("#num_items").val(localStorage.getItem("itemsNumber"));
	$("#response_time").val(localStorage.getItem("responseTime"));
	$("#increment_step").val(localStorage.getItem("incrementStep"));
	$("#initial_compensation").val(localStorage.getItem("initialCompensation"));
	$("#maximum_compensation").val(localStorage.getItem("maximumCompensation"));
	
	$("#btn_set").click(function(event){
		var visibleTime = parseInt($("#visible_time").val());
		var fadeoutTime = parseInt($("#fadeout_time").val());
		var itemsNumber = parseInt($("#num_items").val());
		var responseTime = parseInt($("#response_time").val());
		var incrementStep = parseFloat($("#increment_step").val());
		var initialCompensation = parseFloat($("#initial_compensation").val());
		var maximumCompensation = parseFloat($("#maximum_compensation").val());
		
		if (responseTime < fadeoutTime + visibleTime)
			responseTime = fadeoutTime + visibleTime;
		
		if (initialCompensation < 0);
			initialCompensation = 3;
		
		if (maximumCompensation < 0)
			maximumCompensation = 5;
	
		localStorage.setItem("visibleTime", visibleTime);
		localStorage.setItem("fadeoutTime", fadeoutTime);
		localStorage.setItem("itemsNumber", itemsNumber);
		localStorage.setItem("responseTime", responseTime);
		localStorage.setItem("incrementStep", incrementStep);
		localStorage.setItem("initialCompensation", initialCompensation);
		localStorage.setItem("maximumCompensation", maximumCompensation);
		
		event.stopPropagation();
	});
});