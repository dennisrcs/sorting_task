$(document).ready(function(){
	$("#visible_time").val(localStorage.getItem("visibleTime"));
	$("#fadeout_time").val(localStorage.getItem("fadeoutTime"));
	$("#num_columns").val(localStorage.getItem("numColumns"));
	$("#num_rows").val(localStorage.getItem("numRows"));
	$("#response_time").val(localStorage.getItem("responseTime"));
	$("#increment_step").val(localStorage.getItem("incrementStep"));
	$("#initial_compensation").val(localStorage.getItem("initialCompensation"));
	$("#maximum_compensation").val(localStorage.getItem("maximumCompensation"));
	$("#percent_smaller_green").val(localStorage.getItem("percentSmallerGreen"));
	$("#flip_correct_answer").val(localStorage.getItem("flipCorrectAnswer"));
	
	
	$("#btn_set").click(function(event){
		var visibleTime = parseInt($("#visible_time").val());
		var fadeoutTime = parseInt($("#fadeout_time").val());
		var numColumns = parseInt($("#num_columns").val());
		var numRows = parseInt($("#num_rows").val());
		var responseTime = parseInt($("#response_time").val());
		var incrementStep = parseFloat($("#increment_step").val());
		var initialCompensation = parseFloat($("#initial_compensation").val());
		var maximumCompensation = parseFloat($("#maximum_compensation").val());
		var percentSmallerGreen = parseFloat($("#percent_smaller_green").val());
		var flipCorrectAnswer = parseFloat($("#flip_correct_answer").val());
		var mixAscendingDescending = $("#mix_ascending_descending").prop('checked');
		
		if (responseTime < fadeoutTime + visibleTime)
			responseTime = fadeoutTime + visibleTime;
		
		if (maximumCompensation < 0)
			maximumCompensation = 5;
	
		localStorage.setItem("visibleTime", visibleTime);
		localStorage.setItem("fadeoutTime", fadeoutTime);
		localStorage.setItem("numColumns", numColumns);
		localStorage.setItem("numRows", numRows);
		localStorage.setItem("responseTime", responseTime);
		localStorage.setItem("incrementStep", incrementStep);
		localStorage.setItem("initialCompensation", initialCompensation);
		localStorage.setItem("maximumCompensation", maximumCompensation);
		localStorage.setItem("percentSmallerGreen", percentSmallerGreen);
		localStorage.setItem("flipCorrectAnswer", flipCorrectAnswer);
		
		event.stopPropagation();
	});
});