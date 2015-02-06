//IE fixes and iframe init
var makeUnselectable = function( $target ) {
    $target
        .addClass( 'unselectable' ) // All these attributes are inheritable
        .attr( 'unselectable', 'on' ) // For IE9 - This property is not inherited, needs to be placed onto everything
        .attr( 'draggable', 'false' ) // For moz and webkit, although Firefox 16 ignores this when -moz-user-select: none; is set, it's like these properties are mutually exclusive, seems to be a bug.
        .on( 'dragstart', function() { return false; } );  // Needed since Firefox 16 seems to ingore the 'draggable' attribute we just applied above when '-moz-user-select: none' is applied to the CSS 

    $target // Apply non-inheritable properties to the child elements
        .find( '*' )
        .attr( 'draggable', 'false' )
        .attr( 'unselectable', 'on' ); 
};

var links = document.querySelectorAll('a');

for(var i = 0; i < links.length; i++) {
    		links[i].addEventListener('click', function(event) {
        		event.preventDefault();
        		iframeMessenger.navigate(this.href);
    		}, false);
}
iframeMessenger.enableAutoResize();
// end IE fixes and iframe init


//global vars
var dataset = filteredDataset = globalCardArray = allMatchesArr = datasetBestOfRest = allGoalsArr =[], datasetRooney, datasetLineker, isMobile, winW, datasetCharlton, datasetGreaves, datasetOwen, datasetTopline, data, globalSortCategory = "A", currentIndex = 0, initViewBuilt = false, scorersArr = [];
var goalSquaresArr = ["TL","TCL","TC","TCR","TR","CL","CCL","CC","CCR","CR","BL","BCL","BC","BCR","BR"];
var globalPitchDimensions = {"w":0, "h":0}
var pitchSVG = '<svg class="playerPitch" width="628px" height="395px" viewBox="0 0 628 395" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="pitch" sketch:type="MSLayerGroup" transform="translate(0.000000, 0.000000)" stroke="#4BC6DF" stroke-width="1"><path d="M0,0.00800310288 L2.27177403e-14,372 L624,372 L624,0" id="touchline" sketch:type="MSShapeGroup"></path><ellipse id="penalty-spot" sketch:type="MSShapeGroup" cx="311.833795" cy="240.32282" rx="2" ry="2" fill="#4bc6df" stroke="none"></ellipse><path d="M128,371.283374 L128,179 L495.692888,179 L495.692887,371.283374" id="penalty-area" sketch:type="MSShapeGroup"></path><path d="M362.656361,157.37731 C368.959121,163.380786 374.562498,170.481075 379.302057,178.459342 L245,178.459342 C272.891999,131.488807 325.57041,122.047242 362.656361,157.37731 Z" id="d-edge" sketch:type="MSShapeGroup"></path><path d="M228,371.455953 L228,307 L395.004924,307 L395.004924,370.680305" id="six-yard-box" sketch:type="MSShapeGroup"></path><path d="M279.234306,372 L273,393 L350,393 L344.865125,372" id="goal" sketch:type="MSShapeGroup"></path></g></g></svg>';
var dataCount_0 = dataCount_1 = dataCount_2 = dataCount_3 = dataCount_4 = 0;

var countsArray = [0, 0, 0, 0, 0]


$(function() {

	$(document).ready(function() {
		initData();

		winW = $(window).width();
		checkWin();
	})	

	if(!Array.indexOf) {// IE fix
	Array.prototype.indexOf = function(obj) {
		for(var i = 0; i < this.length; i++) {
			if(this[i] === obj) {
				return i;
			}
		}
		return -1;
	}

	}
});

function checkWin() {
	winW > 739 ? isMobile = false : isMobile = true;
}

function initData() {
	"use strict";
	var key = "1G0m0CuXqIVxjBv8c2T-KEGFM4Dg-NKNRqbcP4Jzdtw8";
	//var key = window.location.search.slice(1);
	var url = "http://interactive.guim.co.uk/spreadsheetdata/" + key + ".json";
    $.getJSON(url, handleResponse);
}


function handleResponse(data) {
	
	datasetRooney = data.sheets.Rooney;
	datasetLineker = data.sheets.Lineker;
	datasetCharlton = data.sheets.Charlton;
	datasetOwen = data.sheets.Owen;
	datasetGreaves = data.sheets.Greaves;
	datasetTopline = data.sheets.ToplineStats;
	datasetCopyItems = data.sheets.trophy_stats_copy;
	datasetBestOfRest = data.sheets.best_of_the_rest;

		_.each(datasetRooney, function(item){
			item.scorer = "Rooney";
			item.firstname = "Wayne";
		})

		_.each(datasetLineker, function(item){
			item.scorer = "Lineker";
			item.firstname = "Gary";
		})

		_.each(datasetCharlton, function(item){
			item.scorer = "Charlton";
			item.firstname = "Bobby";
		})

		_.each(datasetOwen, function(item){
			item.scorer = "Owen";
			item.firstname = "Michael";
		})

		_.each(datasetGreaves, function(item){
			item.scorer = "Greaves";
			item.firstname = "Jimmy";
		})

	dataset.push(datasetRooney);
	dataset.push(datasetCharlton);
	dataset.push(datasetLineker);
	dataset.push(datasetGreaves);
	dataset.push(datasetOwen);

	allGoalsArr = _.flatten(dataset);
	allMatchesArr = _.flatten(dataset);

	buildLayout (dataset, dataset);

	bestOfRestData ()
}


function buildLayout (dataIn,filteredData){
	$( "#cardsHolder" ).html(" ");	
	var cardString = "<div class='player-card'><div class='playerCol-left'><div class='playerCol-caption-panel' id='playerCol-caption'></div></div><div class='pitchHolder'>"+pitchSVG+"</svg></div><div class='playerCol-right'></div></div>";	
	var htmlStr = "";
	
	dataIn = setDummyDataForViz(dataIn);

	_.each(dataIn, function(item,i){
		htmlStr+=cardString;
	})

	$( "#cardsHolder" ).html(htmlStr);	

	$(".player-card").each(function(i, e) {
		$(e).attr("id", "card_" +i);
	});
	$(".playerPitch").each(function(i, e) {
		$(e).attr("id", "pitch_" +i);
	});

	if(!initViewBuilt){
		initBarCharts(dataIn)
	}
	
	initViewBuilt = true;
	buildGoalsView(dataIn,filteredData);
	addListeners();
}

function initBarCharts(dataIn){
	var graphString = "<div class='graph-wrapper'><div class='bar-chart-title'></div><div class='bar-chart-holder'></div></div>";
	var htmlStrGraphs = "";

	_.each(dataIn, function(item,i){
		htmlStrGraphs+=graphString;
	})

	$( "#graphsHolder" ).html(htmlStrGraphs);	

	$(".bar-chart-holder").each(function(i, e) {
		$(e).attr("id", "bar-chart_" +i);
	});

	$(".bar-chart-title").each(function(i, e) {
		$(e).attr("id", "bar-chart-title_" +i);
	});

	$(".graph-wrapper").each(function(i, e) {
		$(e).attr("id", "graph-wrapper_" +i);
	});

	buildBarGraphView();
}


function updatePlayerText(item,i){

		var currCard =("#card_"+i);
		var targetClipNameColLeft = currCard+" .playerCol-left";
		var targetClipNameColRight = currCard+" .playerCol-right";
		var finalTally = item[item.length-1];
		var lhColHtml = getLeftColContent(finalTally,item);
		var rhColHtml = getRightColContent(item,i);

		$(targetClipNameColLeft).html(lhColHtml);
		$(targetClipNameColRight).html(rhColHtml);
		
}


function getLeftColContent(finalTally,item){
	var htmlStr = " ";
	var lhColCaptionHtml = setLHCapTxt(finalTally, item);

	htmlStr = item[0].firstname+" "+item[0].scorer;
	htmlStr +="<div class='playerCol-bg-img' style='background-image:url(images/"+item[0].scorer+".jpg)'></div><div class='playerCol-caption-panel'>"+lhColCaptionHtml+"</div>";

	return htmlStr;
}

function getRightColContent(item,numIn){

	var currItem = item[numIn];

	//console.log(currItem)

	var newDate = Date.parse(currItem.date);
		
	newDate = (newDate.toString('d MMMM yyyy'));
	
	var htmlStr = "<h3>England "+currItem.scoreafterft+" "+currItem.opposition+"</h3>";
	htmlStr = htmlStr+"<div class='playerCol-caption-panel'>"
	var dateStr = "<span id='captionText'><b>"+newDate+"</br>"   
	var compStr = currItem.comp+"</br>"
	var venueStr = currItem.venue+"</b></br>"
	var bodyPart = getBodyPartStr(currItem.bodyPart)
	var distance = currItem.goaldistance + " yards </br>"
	var scoreAfter = "Score after goal: "+currItem.scoreaftergoal+"</span>"
	var navigation = '<div class="nav-panel" id ="navPanel_'+numIn+'"><div class="nav-button" id="nav-previous" data-direction="-1"></div><div class="nav-button" id="nav-next" data-direction="1"></div></div>'
	htmlStr = htmlStr+dateStr + compStr + venueStr+ bodyPart + distance+scoreAfter+"</div>"+navigation;

	return htmlStr;
}

function setLHCapTxt(finalTally, item){
	var strOut;
	var capsNum = 0;
	var goalsNum = 0;
	var goalAverage = 0;
	var playerData = item;
	
	_.each(datasetTopline, function(playerData){
		var currDataObj;

		if (playerData.scorer== finalTally.scorer)
		{
			currDataObj = playerData;
			if (globalSortCategory == "A"){
				capsNum = currDataObj.totalcaps;
				goalsNum = currDataObj.goals;
			}

			if (globalSortCategory == "T"){
				capsNum = currDataObj.tournamentcaps;
				goalsNum = currDataObj.tournamentgoals;
			}
			if (globalSortCategory == "Q"){
				capsNum = currDataObj.qualifiercaps;
				goalsNum = currDataObj.qualifiergoals;
			}
			if (globalSortCategory == "F"){
				capsNum = (currDataObj.totalcaps-(currDataObj.qualifiercaps+currDataObj.tournamentcaps));
				goalsNum = currDataObj.goals;
			}
		}

		goalAverage = Math.round(goalsNum/capsNum*100);
		goalAverage = goalAverage/100;
	});
	

	if(finalTally==undefined){
		strOut = "Greaves<br/>0 Goals in XX matches";
	}else{
		strOut = goalsNum+" goals in "+getGameTypeStr()+" "+capsNum+" matches<br/>"+goalAverage+" average-per-game";
	}
	
	
	return strOut;
}


function getBodyPartStr(bodyPart){
	var strOut = "Shot from "

	if (bodyPart == "RF"){ strOut = "Right footed shot from" }
	if (bodyPart == "LF"){ strOut = "Left footed shot from" }
	if (bodyPart == "H"){ strOut = "Header from" }
	
	return strOut;

}


function setNilGoals(cardIn){
		var currCard = cardIn;
		var targetClipNameColLeft = currCard+" .playerCol-left";
		
		var targetClipNameColRight = currCard+" .playerCol-right";
		//var finalTally = dataIn[dataIn.length-1];
		$(targetClipNameColLeft).html("0");
		$(targetClipNameColCenter).html("Tournament goals");
}


function setDummyDataForViz(dataIn){
	if(dataIn.length > 0){
			_.each(dataIn, function(item,i){
				
				scorersArr.push(item[0].scorer)
				_.each(item, function(itemObj,k){
					if(itemObj.goalsquare==""){
						itemObj.goalsquare = goalSquaresArr[Math.floor(Math.random()*goalSquaresArr.length)];
					}

					if(itemObj.goaldistance==""){
						itemObj.goaldistance = Math.ceil(Math.random()*30);
					}	

					if(itemObj.goalangle==""){
						itemObj.goalangle = Math.ceil(Math.random()*170);
					}

					
				})
			});
		}
	return dataIn;
}


function goalDataSort(){

	countsArray = [0, 0, 0, 0, 0]

	dataCount_0 = dataCount_1 = dataCount_2 = dataCount_3 = dataCount_4 = 0;
	filteredDataset = tempSubArr  = [];

		if (globalSortCategory == "A"){
			filteredDataset = dataset;
		}

		if (globalSortCategory != "A"){

			_.each(dataset, function(subArr){
				
					_.each(subArr, function(item,i){
						tempSubArr = _.filter(subArr, function(item){ return item.matchcategory == globalSortCategory; });
					});

				filteredDataset.push(tempSubArr);
			});

		}

	filteredDataset = _.sortBy(filteredDataset, function(subArr) { return subArr.length; });
	filteredDataset.reverse();

	!initViewBuilt ? buildLayout (dataset, dataset) : buildLayout (dataset, filteredDataset);

}


function addListeners(){
		var counter = 0;
		$( "select" ).change(function (e) {
	        upDateFromSelect(e);
	    })

	    $(".nav-button").click(function(e){ 
	    	 var tempDirection = ($(this).attr('data-direction'));
			 var a = $(this).parent();
			 var numRef = getIDKey(a)

			 //var direction = + target.dataset-direction;
			 
           	 upDatePosition(numRef,tempDirection)
			 
           
		})
}


function upDateFromSelect(e){
    setglobalSortCategory(e.currentTarget.value);
}

function upDatePosition(numRef,tempDirection){
	
	var checkMax = filteredDataset[numRef].length-1; 
	var checkNum = parseInt(countsArray[numRef]) + parseInt(tempDirection); 
		
	countsArray[numRef]	= checkMinMax( checkNum, checkMax);
	//console.log(filteredDataset[numRef][parseInt(countsArray[numRef])]);


	moveAlongData ( numRef, filteredDataset[numRef], parseInt(countsArray[numRef]))


	function moveAlongData(numRef,tempArr,dataCountIn){

		if(d3.selectAll(".goal-line-marker-highlighted") != null) {  /* .someclass doesn't exist */
			    d3.select(".goal-line-marker-highlighted").attr("class", "goal-line-marker")     
		}
			
	
		var currClip = d3.select("#goal_"+tempArr[dataCountIn].scorer+"_"+tempArr[dataCountIn].goalno);
		currClip.attr("class","goal-line-marker-highlighted");

		
		 
		var currCard =("#card_"+numRef);
		var currItem = tempArr[dataCountIn];
		var targetClipHeader = currCard+" .playerCol-right h3";
		var targetClipCap = currCard+" .playerCol-right  #captionText";

		var newDate = Date.parse(currItem.date);
	    newDate = (newDate.toString('d MMMM yyyy'));

		var newCapText = "<b>"+newDate+"</br>"   
		newCapText = newCapText + currItem.comp+"</br>"
		newCapText = newCapText + currItem.venue+"</b></br>"
		newCapText = newCapText + getBodyPartStr(currItem.bodyPart)
		newCapText = newCapText + currItem.goaldistance + " yards </br>"
		newCapText = newCapText + "Score after goal: "+currItem.scoreaftergoal;


		$(targetClipHeader).html("England "+currItem.scoreafterft+" "+currItem.opposition);

		$(targetClipCap).html(newCapText);
		
		//$(targetClipNameColRight).empty()
		
		//var rhColHtml = getRightColContent(tempArr[dataCountIn],numRef);

		
		//$(targetClipNameColRight).html(rhColHtml);



	}	

}

function numDivision(widthRef, unitRef){
	var numOut = Math.floor(widthRef/unitRef);
	numOut < 3 ? numOut = 3 : numOut = numOut;
	return numOut;
}

function getMaxVal(arrIn,varIn){
	var numOut = 0;
	_.each(arrIn, function(item,i){
		item[varIn] > numOut ? numOut = (item[varIn]) : numOut=numOut;

	});
	return numOut;

}

function checkMinMax(numIn, checkMax){	

	if (numIn > checkMax){
		numIn = 0;
	}

	if (numIn < 0){
		numIn = checkMax;
	}

	return numIn;
}

function getCardData(currClip){
	var idStr = ($(currClip).attr("id")).split("_");
	return(filteredDataset[idStr[2]]);
}


function getIDKey(currClip){

	var idStr = currClip.attr("id").split("_");
	return(idStr[1]);
}

function setglobalSortCategory(valIn){

	if (valIn == "all"){
		globalSortCategory="A";
	}

	if (valIn == "tournaments"){
		globalSortCategory="T";
	}

	if (valIn == "qualifiers"){
		globalSortCategory="Q";	
	}

	if (valIn == "friendlies"){
		globalSortCategory="F";
	}

	goalDataSort();
}




function getGameTypeStr(){

	var strOut;

			if (globalSortCategory == "A"){
				strOut="all";
			}

			if (globalSortCategory == "T"){
				strOut="tournament";
			}

			if (globalSortCategory == "Q"){
				strOut="qualifying";	
			}

			if (globalSortCategory == "F"){
				strOut="friendly";
			}

	return strOut;

}

function scrollPage(d) {
	var scrollTo = d.pageYOffset + d.iframeTop + currentPosition;
	iframeMessenger.scrollTo(0, scrollTo);
}

function forceIframeResize() {
	var h = $("#wrapper").innerHeight();
	iframeMessenger.resize(h);
}

