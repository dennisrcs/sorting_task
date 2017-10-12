var failAudio = new Audio('fail.mp3');
var visibleTime = localStorage.getItem("visibleTime");
var fadeoutTime = localStorage.getItem("fadeoutTime");
var numColumns = parseInt(localStorage.getItem("numColumns"));
var numRows = parseInt(localStorage.getItem("numRows"));
var responseTime = localStorage.getItem("responseTime");
var incrementStep = localStorage.getItem("incrementStep");
var maximumCompensation = localStorage.getItem("maximumCompensation");
var percentSmallerGreen = parseFloat(localStorage.getItem("percentSmallerGreen"));
var flipCorrectAnswer = parseFloat(localStorage.getItem("flipCorrectAnswer"));
var zelunMode = (localStorage.getItem("useButtons") == 'true');

var stopwatch = null;
var intervalId = null;
var bar = null;

$(document).ready(function(){
	bar = new ProgressBar.Circle(progressBar, {
		strokeWidth: 6,
		trailWidth: 1,
		color: '#00FF00',
		trailColor: '#ddd',
	});
	
	// disables right click
	document.addEventListener('contextmenu', event => event.preventDefault());
	
	if (!zelunMode)
	{
		$("#btn_container :button").each(function(){
			$(this).css("visibility", "hidden");
		});
	}
	
	stopwatch = new Stopwatch(
		document.querySelector('.stopwatch'),
		document.querySelector('.results'));
	
	initialize();

});

function initialize() {
	initializeTable();
	assignRandomNumbers();
	
	setPromise();
	stopwatch.start();
	markItems();
}

function initializeTable()
{
	var numItems = numColumns * numRows;
	var table = document.getElementById("sortable");
	
	var parentsWidth = $("#sortable").width();
	var childWidth = parentsWidth/numColumns;
	for (i = 0; i < numItems; i++)
	{
		var li = document.createElement("li");
		li.setAttribute("id", "item" + (i+1));
		li.setAttribute("class", "ui-state-default");
		li.style.cssText = "width:" + childWidth + "px;";
		table.appendChild(li);
	}
}

function assignRandomNumbers(){
	var numItems = numColumns * numRows;
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
	if(isCloseToEnd())
		flipCorrectAnswer = flipCorrectAnswer * 2;
	else
		flipCorrectAnswer = parseFloat(localStorage.getItem("flipCorrectAnswer"));
		
	if(isListSorted())
	{
		alert("Good Job! Keep it up!");
		stopwatch.stop();
		//stopwatch.reset();
		
		var lower = $("#sortable .selected_lower")[0];
		var greater = $("#sortable .selected_greater")[0];
		showSelected(lower, greater);
		
		clearItems();
		assignRandomNumbers();
		markItems();
		stopwatch.start();
		setPromise();
	}
	else
	{
		var promiseSwapTimeout = new Promise(function(resolve, reject)
		{
			intervalId = move();
			
			if (!zelunMode)
			{
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
			}
			else
			{
				$("#btn_swap").unbind("click");
				$("#btn_swap").click(function(){
					event.preventDefault();
					resolve('swaped');
					callbackBtnSwap(intervalId);
				});
				
				$("#btn_not_swap").unbind("click");
				$("#btn_not_swap").click(function(){
					event.preventDefault();
					resolve('did not swap');
					callbackBtnNotSwap(intervalId);
				});
			}
			
			setTimeout(function(){reject("timeout")}, responseTime);
		});
		
		promiseSwapTimeout.then(function(result){
			// do nothing
		}, function(err) {
			callbackTimeout();
		});
	}
}

function isCloseToEnd()
{
	var itemsList = itemsToArray();
	var countItemsSorted = 0;
	var listSize = itemsList.length;
	
	// clones list
	var clonedItemsList = itemsList.slice();
	
	// sort list
	clonedItemsList.sort();
	
	for (let i = 0; i < listSize; i++)
		if (itemsList[i] == clonedItemsList[i])
			countItemsSorted += 1;
	
	var sortedRatio = (countItemsSorted/listSize);
	return (sortedRatio > 0.90);
}

function isListSorted()
{
	var itemsList = itemsToArray();
	return isSorted(itemsList);
}

function itemsToArray()
{
	var items = $("#sortable li");
	var itemsList = [];
	
	for (i = 0; i < items.length; i++)
		itemsList[i] = parseInt(items[i].innerText);	
		
	return itemsList;
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
	
	itemsMarkedLower.removeClass("selected_lower");
	itemsMarkedGreater.removeClass("selected_greater");
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
	
	if (Math.random() < percentSmallerGreen)	
	{
		if (valFirstItem < valSecondItem)
			markFirstLowerSecondGreater(items[firstRandomItem], items[secondRandomItem]);
		else
			markSecondLowerFirstGreater(items[firstRandomItem], items[secondRandomItem]);
	}
	else
	{
		if (valFirstItem > valSecondItem)
			markFirstLowerSecondGreater(items[firstRandomItem], items[secondRandomItem]);
		else
			markSecondLowerFirstGreater(items[firstRandomItem], items[secondRandomItem]);
	}
	
	$.data(this, 'fadeoutTimer', setTimeout(function(){
		$(items[firstRandomItem]).fadeTo(fadeoutTime, 0);
		$(items[secondRandomItem]).fadeTo(fadeoutTime, 0);
	}, visibleTime));
	
}

function markFirstLowerSecondGreater(firstItem, secondItem)
{
	firstItem.setAttribute("class", "selected_lower");
	secondItem.setAttribute("class", "selected_greater");
}

function markSecondLowerFirstGreater(firstItem, secondItem)
{
	firstItem.setAttribute("class", "selected_greater");
	secondItem.setAttribute("class", "selected_lower");
}

function updateScore(isCorrectMove)
{
	var currentScoreDollar = $("#score")[0].innerHTML;
	
	var decimalRegex = /[+-]?\d+(\.\d+)?$/;
	var match = decimalRegex.exec(currentScoreDollar);
	var currentScoreString = match[0];
	var currentScore = parseFloat(currentScoreString);
	
	var step = parseFloat(incrementStep);
	
	if (isCorrectMove)
		currentScore = currentScore + step;
	else
		currentScore = currentScore - step;
	
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
	{
		if (Math.random() < flipCorrectAnswer) // there's a small chance that correct answer will be flipped
		{
			decrementScorePlayFail();
			swapItems(lower, greater); // swaps the items again
		}
		else
			updateScore(true);
	}
	
	swapItems(lower, greater);
	
	showSelected(lower, greater);
	clearItems();
	markItems();
	setPromise();
}

function swapItems(lower, greater)
{
	var aux = lower.innerHTML;
	lower.innerHTML = greater.innerHTML;
	greater.innerHTML = aux;
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
	{
		if (Math.random() < flipCorrectAnswer) // there's a small chance that correct answer will be flipped
		{
			decrementScorePlayFail();
			swapItems(lower, greater);
		}
		else
			updateScore(true);
	}
	
	showSelected(lower, greater);
	clearItems();
	markItems();
	setPromise();
}

function callbackTimeout()
{
	clearInterval(intervalId);
	
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
	clearTimeout($.data(this, 'fadeoutTimer'));
	
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

function move()
{
	var width = 1.0;
	var id = setInterval(frame, (responseTime/1000)*5);
	
	var from = new Color("#00FF00");
	var to = new Color("#FF4433");
	
	function frame() {
		if (width >= 100) {
		  clearInterval(id);
		} else {
		  width += 0.5; 
		  
		  var backgroundColor = LinearColorInterpolator.findColorBetween(from, to, width).asRgbCss();
		  bar.path.setAttribute('stroke', backgroundColor);
		  console.log(width/100);
		  bar.set(width/100);
		}
	}
	
	return id;
}