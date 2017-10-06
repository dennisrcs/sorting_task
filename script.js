var failAudio = new Audio('fail.mp3');
var visibleTime = localStorage.getItem("visibleTime");
var fadeoutTime = localStorage.getItem("fadeoutTime");
var itemsNumber = localStorage.getItem("itemsNumber");
var responseTime = localStorage.getItem("responseTime");
var incrementStep = localStorage.getItem("incrementStep");
var maximumCompensation = localStorage.getItem("maximumCompensation");
var stopwatch = null;
var intervalId = null;

$(document).ready(function(){
	// stopwatch
	class Stopwatch {
		constructor(display, results) {
			this.running = false;
			this.display = display;
			this.reset();
			this.print(this.times);
		}
		
		reset() {
			this.times = [ 0, 0, 0 ];
		}
		
		start() {
			if (!this.time) this.time = performance.now();
			if (!this.running) {
				this.running = true;
				requestAnimationFrame(this.step.bind(this));
			}
		}
		
		stop() {
			this.running = false;
			this.time = null;
		}
		
		step(timestamp) {
			if (!this.running) return;
			this.calculate(timestamp);
			this.time = timestamp;
			this.print();
			requestAnimationFrame(this.step.bind(this));
		}
		
		calculate(timestamp) {
			var diff = timestamp - this.time;
			// Hundredths of a second are 100 ms
			this.times[2] += diff / 10;
			// Seconds are 100 hundredths of a second
			if (this.times[2] >= 100) {
				this.times[1] += 1;
				this.times[2] -= 100;
			}
			// Minutes are 60 seconds
			if (this.times[1] >= 60) {
				this.times[0] += 1;
				this.times[1] -= 60;
			}
		}
		
		print() {
			this.display.innerText = this.format(this.times);
		}
		
		format(times) {
			return `\
	${pad0(times[0], 2)}:\
	${pad0(times[1], 2)}:\
	${pad0(Math.floor(times[2]), 2)}`;
		}
	}
	
	stopwatch = new Stopwatch(
		document.querySelector('.stopwatch'),
		document.querySelector('.results'));
	
	initialize();
		
	function pad0(value, count) {
		var result = value.toString();
		for (; result.length < count; --count)
			result = '0' + result;
		return result;
	}

});

function initialize() {
	var numItems = itemsNumber;
	var table = document.getElementById("sortable");
	
	for (i = 0; i < numItems; i++)
	{
		var li = document.createElement("li");
		li.setAttribute("id", "item" + (i+1));
		li.setAttribute("class", "ui-state-default");
		table.appendChild(li);
	}
	
	assignRandomNumbers();

	/*$( function() {
		$( "#sortable" ).sortable({
		    //revert: true
			update: function() {
				if(isListSorted())
				{
					alert("Good Job! Keep it up!");
					stopwatch.stop();
					//stopwatch.reset()
					initialize(stopwatch);
				}
			}
		});
		
	});*/
	
	$("#sortable, #sortable li").disableSelection();
	
	setPromise();
	stopwatch.start();
	markItems();
}

function assignRandomNumbers(){
	var numItems = itemsNumber;
	for (i = 0; i < numItems; i++)
	{
		var samplesNumber = Math.random() * 1000000 + "";
		var finalNumber = samplesNumber.substring(0,6);
		finalNumber = finalNumber.replace(".", "");
		$("#item" + (i+1)).html(finalNumber);
	}
}

function setPromise()
{
	var numItems = itemsNumber;
	if(isListSorted())
	{
		alert("Good Job! Keep it up!");
		stopwatch.stop();
		//stopwatch.reset();
		
		var lower = $("#sortable .selected_lower")[0];
		var greater = $("#sortable .selected_greater")[0];
		showSelected(lower, greater);
		
		clearItems();
		assignRandomNumbers(numItems);
		markItems();
		stopwatch.start();
		setPromise();
	}
	else
	{
		var promiseSwapTimeout = new Promise(function(resolve, reject)
		{
			intervalId = move();
			
			$(window).unbind("mousedown");
			$(window).mousedown(function(event){
				switch(event.which){
					case 1:
						event.preventDefault();
						resolve('swaped');
						callbackBtnSwap(intervalId);
						break;
					case 3:
						event.preventDefault();
						resolve('did not swap');
						callbackBtnNotSwap(intervalId);
						break;
				}
			});

			setTimeout(function(){reject("timeout")}, responseTime);
		});
		
		promiseSwapTimeout.then(function(result){
			// do nothing
		}, function(err) {
			callbackTimeout();
		});
	}
}

function isListSorted()
{
	var items = $("#sortable li");
	var itemsList = [];
	
	for (i = 0; i < items.length; i++)
		itemsList[i] = parseInt(items[i].innerText);
	
	return isSorted(itemsList);
}

function isSorted(arr)
{
	var sorted = true;
	for (i = 0; i < arr.length - 1; i++) {
		if (arr[i] > arr[i+1]) {
			sorted = false;
			break;
		}
	}
	return sorted;
}

function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clearItems()
{
	var itemsMarkedLower = $("#sortable .selected_lower");
	var itemsMarkedGreater = $("#sortable .selected_greater");
	
	clearLowerOrGreater(itemsMarkedLower, "selected_lower");
	clearLowerOrGreater(itemsMarkedGreater, "selected_greater");
}

function clearLowerOrGreater(item, filter)
{
	if (item != undefined)
		item.removeClass(filter);	
}

function markItems()
{
	var items = $("#sortable li");
					
	var firstRandomItem = getRandomInt(0, items.length - 1);
	var secondRandomItem = getRandomInt(0, items.length - 1);
	
	while (firstRandomItem == secondRandomItem)
		secondRandomItem = getRandomInt(0, items.length - 1);
	
	var valFirstItem = parseInt(items[firstRandomItem].innerHTML);
	var valSecondItem = parseInt(items[secondRandomItem].innerHTML);
	
	if (Math.random() < 0.7)	
	{
		if (valFirstItem < valSecondItem)
		{
			items[firstRandomItem].setAttribute("class", "selected_lower");
			items[secondRandomItem].setAttribute("class", "selected_greater");
		}
		else
		{
			items[firstRandomItem].setAttribute("class", "selected_greater");
			items[secondRandomItem].setAttribute("class", "selected_lower");
		}
	}
	else
	{
		if (valFirstItem > valSecondItem)
		{
			items[firstRandomItem].setAttribute("class", "selected_lower");
			items[secondRandomItem].setAttribute("class", "selected_greater");
		}
		else
		{
			items[firstRandomItem].setAttribute("class", "selected_greater");
			items[secondRandomItem].setAttribute("class", "selected_lower");
		}
	}
	
	$.data(this, 'timer1', setTimeout(function(){
		$(items[firstRandomItem]).fadeTo(fadeoutTime, 0);
		$(items[secondRandomItem]).fadeTo(fadeoutTime, 0);
	}, visibleTime));
	
}

function updateScore(isCorrectMove)
{
	var currentScoreDollar = $("#score")[0].innerHTML;
	
	var decimalRegex = /[+-]?\d+(\.\d+)?$/;
	var match = decimalRegex.exec(currentScoreDollar);
	var currentScoreString = match[0];
	var currentScore = parseFloat(currentScoreString);
	
	var in_decrement = parseFloat(incrementStep);
	
	if (isCorrectMove)
		currentScore = currentScore + in_decrement;
	else
		currentScore = currentScore - in_decrement;
	
	var currentScoreRounded = Math.round(currentScore * 100) / 100;
	
	if (currentScoreRounded < 0)
		currentScoreRounded = 0;
	if (currentScoreRounded > maximumCompensation)
		currentScoreRounded =  maximumCompensation;
	
	$("#score")[0].innerHTML = "$ " + parseFloat(currentScoreRounded).toFixed(2);
}

function callbackBtnSwap(intervalId)
{
	clearInterval(intervalId);
	var lower = $("#sortable .selected_lower")[0];
	var greater = $("#sortable .selected_greater")[0];
	
	var isCorrectMove = checkCorrectMove(lower, greater);
	if (!isCorrectMove)
		decrementScorePlayFail();
	else
		updateScore(true);
	
	var aux = lower.innerHTML;
	lower.innerHTML = greater.innerHTML;
	greater.innerHTML = aux;
	
	showSelected(lower, greater);
	clearItems();
	markItems();
	setPromise();
}

function callbackBtnNotSwap(intervalId)
{
	clearInterval(intervalId);
	var lower = $("#sortable .selected_lower")[0];
	var greater = $("#sortable .selected_greater")[0];
	
	// if should have moved (and didn't) then play fail audio
	var shouldHaveMoved = checkCorrectMove(lower, greater);
	if (shouldHaveMoved)
		decrementScorePlayFail();
	else
		updateScore(true);
	
	showSelected(lower, greater);
	clearItems();
	markItems();
	setPromise();
}

function callbackTimeout()
{
	var lower = $("#sortable .selected_lower")[0];
	var greater = $("#sortable .selected_greater")[0];
	
	// decrement score
	decrementScorePlayFail();
	
	showSelected(lower, greater);
	clearItems();
	markItems();
	setPromise();
}

function decrementScorePlayFail()
{
	updateScore(false);
	failAudio.play();
}

function showSelected(lower, greater)
{
	// clearing timers
	clearTimeout($.data(this, 'timer1'));
	
	// stop fadeout animation
	$(lower).stop(true,true);
	$(greater).stop(true,true);

	// set these elements visible
	$(lower).css({"opacity" : "1"}); 
	$(greater).css({"opacity" : "1"});
}

function checkCorrectMove(lower, greater)
{
	var allItems = $("#sortable li");
	var indexLower = allItems.index(lower);
	var indexGreater = allItems.index(greater);
	var lowerInt = parseInt(lower.innerHTML);
	var greaterInt = parseInt(greater.innerHTML);
	
	var isCorrectMove = false;
	
	if (indexLower < indexGreater)
	{
		if (lowerInt > greaterInt)
			isCorrectMove = true;
	}
	else
	{
		if (lowerInt < greaterInt)
			isCorrectMove = true;
	}
	
	return isCorrectMove;
}

function move() {
	var elem = document.getElementById("myBar");   
	var width = 1;
	var id = setInterval(frame, 40);
	
	function frame() {
		if (width >= 100) {
		  clearInterval(id);
		} else {
		  width++; 
		  elem.style.width = width + '%'; 
		}
	}
	
	return id;
}