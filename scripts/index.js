$(document).ready(function(){
	localStorage.clear();
	$('#txtparticipant').change(function () {
		var participantID = $(this).val();
		localStorage.setItem("participantID", participantID);
	});
	resetParameters();
});

function resetParameters(){
	localStorage.setItem("visibleTime", 1500);
	localStorage.setItem("responseTime", 4000);
	localStorage.setItem("fadeoutTime", 1000);
	localStorage.setItem("itemsNumber", 20);
	localStorage.setItem("incrementStep", 0.10);
	localStorage.setItem("initialCompensation", 3);
	localStorage.setItem("maximumCompensation", 5);
	localStorage.setItem("percentSmallerGreen", 0.7);
	localStorage.setItem("flipCorrectAnswer", 0.05);
	localStorage.setItem("numColumns", 10);
	localStorage.setItem("numRows", 10);
	localStorage.setItem("useButtons", false);
}