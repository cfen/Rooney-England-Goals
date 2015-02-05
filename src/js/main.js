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
//


//global vars
var dataset = filteredDataset = globalCardArray = allMatchesArr = allGoalsArr =[], datasetRooney, datasetLineker, isMobile, winW, datasetCharlton, datasetGreaves, datasetOwen, datasetTopline, data, globalSortCategory = "A", currentIndex = 0, initViewBuilt = false, scorersArr = [];
var goalSquaresArr = ["TL","TCL","TC","TCR","TR","CL","CCL","CC","CCR","CR","BL","BCL","BC","BCR","BR"];
var globalPitchDimensions = {"w":0, "h":0}
var pitchSVG = '<svg class="playerPitch" width="628px" height="395px" viewBox="0 0 628 395" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="pitch" sketch:type="MSLayerGroup" transform="translate(0.000000, 0.000000)" stroke="#4BC6DF" stroke-width="1"><path d="M0,0.00800310288 L2.27177403e-14,372 L624,372 L624,0" id="touchline" sketch:type="MSShapeGroup"></path><ellipse id="penalty-spot" sketch:type="MSShapeGroup" cx="311.833795" cy="240.32282" rx="2" ry="2" fill="#4bc6df" stroke="none"></ellipse><path d="M128,371.283374 L128,179 L495.692888,179 L495.692887,371.283374" id="penalty-area" sketch:type="MSShapeGroup"></path><path d="M362.656361,157.37731 C368.959121,163.380786 374.562498,170.481075 379.302057,178.459342 L245,178.459342 C272.891999,131.488807 325.57041,122.047242 362.656361,157.37731 Z" id="d-edge" sketch:type="MSShapeGroup"></path><path d="M228,371.455953 L228,307 L395.004924,307 L395.004924,370.680305" id="six-yard-box" sketch:type="MSShapeGroup"></path><path d="M279.234306,372 L273,393 L350,393 L344.865125,372" id="goal" sketch:type="MSShapeGroup"></path></g></g></svg>';
var dataCount_0 = dataCount_1 = dataCount_2 = dataCount_3 = dataCount_4 = 0;

//var pitchSVG = '<svg  class="playerPitch" width="280px" height="226px" viewBox="0 0 280 226" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><title>pitch</title><desc>Chris Fenn</desc><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="pitch-svg" sketch:type="MSLayerGroup" transform="translate(1.000000, 1.000000)" stroke="#4BC6DF"><path d="M0.65482392,216.531467 L277.731236,216.531467 L277.731236,0.353733333 L0.65482392,0.353733333 L277.731236,0.353733333 L0.65482392,0.353733333 L0.65482392,216.531467 Z" id="Shape" stroke-width="1.6271" sketch:type="MSShapeGroup"></path><path d="M102.250253,0.354666667 C102.250253,21.1624733 118.997827,38.0305333 139.657007,38.0305333 C160.316186,38.0305333 177.06376,21.1624733 177.06376,0.354666667" id="Oval" stroke-width="1.6271" sketch:type="MSShapeGroup"></path><ellipse id="Oval" stroke-width="1.2204" fill="#4BC6DF" sketch:type="MSShapeGroup" cx="138.471708" cy="0.88667806" rx="0.69269103" ry="0.7"></ellipse><ellipse id="Oval" stroke-width="0.8136" fill="#4BC6DF" sketch:type="MSShapeGroup" cx="139.192106" cy="171.235867" rx="0.813681063" ry="0.822266667"></ellipse><path d="M124.687156,216.531467 L121.835116,223.786267 L156.388392,223.786267 L154.106206,216.531467 L124.687156,216.531467 L124.687156,216.531467 Z" id="goal-frame" stroke-width="1.6271" sketch:type="MSShapeGroup"></path><path d="M102.276292,216.531467 L102.276292,193.8832 L176.517993,193.8832 L176.517993,216.531467 L102.276292,216.531467 L102.276292,216.531467 Z" id="six-yard-area" stroke-width="1.6271" sketch:type="MSShapeGroup"></path><path d="M57.4545648,216.531467 L57.4545648,148.5876 L221.337874,148.5876 L221.337874,216.531467 L57.4545648,216.531467 L57.4545648,216.531467 Z" id="penalty-area" stroke-width="1.6271" sketch:type="MSShapeGroup"></path><path d="M109.397156,148.5876 C121.773236,131.960267 145.147402,128.618 161.60297,141.124667 C164.399595,143.249867 166.885894,145.763333 168.988904,148.5876 L109.397156,148.5876 L109.397156,148.5876 Z" id="Shape" stroke-width="1.6271" sketch:type="MSShapeGroup"></path><path d="M4.72969435,216.531467 C4.72969435,214.254133 2.90468439,212.412667 0.655747508,212.412667 L0.655747508,216.531467 L4.72969435,216.531467 L4.72969435,216.531467 Z" id="Shape" stroke-width="1.6271" sketch:type="MSShapeGroup"></path><path d="M277.731236,212.414533 C275.483223,212.414533 273.655442,214.254133 273.655442,216.531467 L277.731236,216.531467 L277.731236,212.414533 L277.731236,212.414533 Z" id="Shape" stroke-width="1.6271" sketch:type="MSShapeGroup"></path></g></g></svg>'
//var pitchSVG ='<svg class="playerPitch" width="300px" height="242px" viewBox="0 0 300 242" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="pitch-svg" transform="translate(1.000000, 1.000000)" stroke="#4BC6DF"><path d="M0.701933555,231.031342 L297.7119,231.031342 L297.7119,0.377420833 L0.701933555,0.377420833 L297.7119,0.377420833 L0.701933555,0.377420833 L0.701933555,231.031342 Z" id="Shape" stroke-width="1.6271"></path><path d="M109.606387,0.378416667 C109.606387,22.5796032 127.558822,40.5772208 149.704273,40.5772208 C171.849725,40.5772208 189.80216,22.5796032 189.80216,0.378416667" id="Oval" stroke-width="1.6271"></path><ellipse id="Oval" stroke-width="1.2204" fill="#4BC6DF" cx="148.433701" cy="0.946053823" rx="0.742524917" ry="0.746875"></ellipse><ellipse id="Oval" stroke-width="0.8136" fill="#4BC6DF" cx="149.205927" cy="182.702554" rx="0.872219269" ry="0.877329167"></ellipse><path class="goal-frame" d="M133.657455,231.031342 L130.600233,238.771954 L167.639355,238.771954 L165.192983,231.031342 L133.657455,231.031342 L133.657455,231.031342 Z" id="Shape" stroke-width="1.6271"></path><path class="six-yard-box" d="M109.634299,231.031342 L109.634299,206.86645 L189.21713,206.86645 L189.21713,231.031342 L109.634299,231.031342 L109.634299,231.031342 Z" id="Shape" stroke-width="1.6271"></path><path class="penalty-area" d="M61.5879867,231.031342 L61.5879867,158.537663 L237.261462,158.537663 L237.261462,231.031342 L61.5879867,231.031342 L61.5879867,231.031342 Z" id="Shape" stroke-width="1.6271"></path><path d="M117.267455,158.537663 C130.5339,140.796892 155.589661,137.230813 173.229083,150.574979 C176.226904,152.842492 178.892073,155.524271 181.146379,158.537663 L117.267455,158.537663 L117.267455,158.537663 Z" id="Shape" stroke-width="1.6271"></path><path d="M5.06996013,231.031342 C5.06996013,228.601508 3.11365449,226.636729 0.702923588,226.636729 L0.702923588,231.031342 L5.06996013,231.031342 L5.06996013,231.031342 Z" id="Shape" stroke-width="1.6271"></path><path d="M297.7119,226.638721 C295.302159,226.638721 293.342884,228.601508 293.342884,231.031342 L297.7119,231.031342 L297.7119,226.638721 L297.7119,226.638721 Z" id="Shape" stroke-width="1.6271"></path></g></g></svg>'
//var pitchSVG ='<svg version="1.1" class="playerPitch" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="240px" height="242px" viewBox="0 300 300 210" enable-background="new 0 0 600 600" xml:space="preserve"><path fill="none" stroke="#4bc6df" stroke-width="1.6271" d="M7.709,298.379v231.619h300V298.379H7.709L7.709,298.379 h300H7.709z"/><circle clip-path="url(#SVGID_2_)" fill="none" fill-opacity="0" stroke="#4bc6df" stroke-width="1.6271" cx="157.709" cy="297.747" r="40.367"/><circle fill="#4bc6df" stroke="#4bc6df" stroke-width="1.2204" cx="158.501" cy="299.39" r="1.323"/><circle fill="#4bc6df" stroke="#4bc6df" stroke-width="0.8136" cx="157.708" cy="481.467" r="0.881"/><path fill="none" stroke="#4bc6df" stroke-width="1.6271" d="M142.003,529.998l-3.088,7.773h37.412 l-2.471-7.773H142.003z" class="svgGoalArea"/><path fill="none" stroke="#4bc6df" stroke-width="1.6271" d="M117.738,529.998v-24.266h80.384v24.266H117.738z"  class="svgSixYardBox"/><path fill="none" stroke="#4bc6df" stroke-width="1.6271" d="M69.208,529.998v-72.797H246.65v72.797H69.208z"  class="svgPenaltyArea"/><path fill="none" stroke="#4bc6df" stroke-width="1.6271" d="M125.448,457.201c13.4-17.815,38.708-21.396,56.525-7.996 c3.028,2.277,5.72,4.97,7.997,7.996H125.448z"/><path fill="none" stroke="#4bc6df" stroke-width="1.6271" d="M12.121,529.998c0-2.44-1.976-4.413-4.411-4.413 v4.413H12.121z"/><path fill="none" stroke="#4bc6df" stroke-width="1.6271" d="M307.709,525.587 c-2.434,0-4.413,1.971-4.413,4.411h4.413V525.587z"/>'



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
	

	buildPlayerCardsView (dataset, dataset);

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


function buildPlayerCardsView (dataIn,filteredData){

	$( "#cardsHolder" ).html(" ");	

	var cardString = "<div class='player-card'><div class='playerCol-left'><div class='playerCol-caption-panel' id='playerCol-caption'></div></div><div class='pitchHolder'>"+pitchSVG+"</svg></div><div class='playerCol-right'></div></div>";
	var graphString = "<div class='graph-wrapper'><div class='bar-chart-title'></div><div class='bar-chart-holder'></div></div>";
	var htmlStr = "";
	var htmlStrGraphs = ""

	dataIn = setDummyDataForViz(dataIn);
	
	_.each(dataIn, function(item,i){
		htmlStr+=cardString;
		htmlStrGraphs+=graphString;
	})

	$( "#cardsHolder" ).html(htmlStr);	
	$( "#graphsHolder" ).html(htmlStrGraphs);	

	$(".player-card").each(function(i, e) {
		$(e).attr("id", "card_" +i);
	});

	$(".playerPitch").each(function(i, e) {
		$(e).attr("id", "pitch_" +i);
	});

	$(".bar-chart-holder").each(function(i, e) {
		$(e).attr("id", "bar-chart_" +i);
	});

	$(".bar-chart-title").each(function(i, e) {
		$(e).attr("id", "bar-chart-title_" +i);
	});

	$(".graph-wrapper").each(function(i, e) {
		$(e).attr("id", "graph-wrapper_" +i);
	});
	
		
	initViewBuilt = true;
	buildGoalsView(dataIn,filteredData);
	buildBarChartView();

	addListeners();

}


function buildBarChartView(){
	$(".bar-chart-holder").empty();

	var currChart, currTitle;
	var initGraphData = [];
	var maxCaps = getMaxVal( datasetTopline, "totalcaps");
	var maxGoals = 5;
	var margin;

	isMobile ?  margin = {top: 36, right: 20, bottom: 6, left: 3} : margin = {top: 18, right: 3, bottom: 18, left: parseInt($("#bar-chart-title_0").width())};

	var width = $("#bar-chart_0").width() - margin.left - margin.right;
    var height = $("#bar-chart_0").height() - margin.bottom - margin.top;
	var barUnitH = height/maxGoals; 
	var barWidth = numDivision(width-margin.right, maxCaps);
	
	//set y axis 
	var y = d3.scale.linear().range([height, 0]);
	y.domain([0, maxGoals ]);

	 _.each(datasetTopline, function(item,i){
	 	// set x axis according to each number of caps
	 	var x = d3.scale.linear().range([0, (item.totalcaps*barWidth)]);
	 	x.domain([0,item.totalcaps]);
	 	var currScorer = item.scorer;
	 	var currWidth = item.totalcaps * barWidth;
	 	initGraphData = [];
	 	currChart = "#bar-chart_"+i;
	 	currTitle = "#bar-chart-title_"+i;

	 	//$(currTitle).css("background", "#333");
		currChart = d3.select(currChart)

		// build an array for the graph bars
		for(var i = 0; i<item.totalcaps; i++){
			var coords = {"x":i * barWidth, "y": 0, "w": barWidth-1, "h": 1, "id":"cap_"+currScorer+"_"+i, "class" : "bar-in-chart"};
			initGraphData.push(coords);
		}

		// select chart
		var newChart = currChart.append("svg")
			.attr("id", function() { return "chart"+item.scorer })
			.attr("width", width)
			

		var newChartContainer = newChart.append("g")
			.attr("id", function() { return "chart_inner"+item.scorer })
			.attr("width", width-margin.right)
			

		// set up a group to add bars to
		var allBars = newChartContainer.append("g")
			.attr("id", function() { return "allBars_"+item.scorer });

		// set axes	
		var xAxis = d3.svg.axis()
		    .scale(x)
		    .ticks(item.totalcaps/10)
		    .tickSize(height+margin.bottom+12, 0, 0)
		   	.orient("bottom")

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .ticks(4)
		    .tickSize((currWidth), -6, 0)
		    .orient("right")

		newChartContainer.append("g")
		    .attr("class", "y axis")
		    .call(yAxis)
		    .append("text")
		    .style("text-anchor", "end")

		newChartContainer.append("g")
		    .attr("class", "x axis")
		    .call(xAxis)
		    .append("text")
		    .style("text-anchor", "end")

		newChartContainer.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (currWidth+barWidth+barWidth+barWidth) +","+height/4.5+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .attr("class", "axis-label")
            .text("goals");

        newChartContainer.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ ((width-margin.left-margin.right)/2) +","+(height+(height*0.5))+")")  // centre below axis
            .attr("class", "axis-label")
            .text("appearances");

		 
		var barsSelected = allBars.selectAll("rect")
	        .data(initGraphData)
	        .enter()
	        .append("rect");
		// loop through data to add bars   
	    var newBar = barsSelected
	 	 	.attr("x",  function (d) { return d.x; })         	
         	.attr("width",  function (d) { return d.w; })
         	.attr("y", function(d) { return y(d.y); })
      		.attr("height", function(d) { return height - y(d.h); }) // make the height reference y(d.h)
         	.attr("class", function (d) { return d.class; })
         	.attr("id", function (d) { return d.id; });

       

	  });

	 sizeBars(height, barUnitH);
	 addTitlesToCharts()
}

function addTitlesToCharts(){
	$(".graph-wrapper").each(function(i, e) {
		$(e).attr("id", "graph-wrapper_" +i).prepend('<div class="sub-header"><h3>'+dataset[i][0].firstname+' '+dataset[i][0].scorer+'</h3><p>Qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio</p></div>');
	});


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


function buildGoalsView(dataIn,filteredData){
	allGoalsArr = _.flatten(dataIn);
	allMatchesArr = _.flatten(dataset);
	var selectedPitch;
	var svgContainer;
	var targetClipNameColRight;
	var currCard;

	if(filteredData.length != 0){
		_.each(filteredData, function(item,i){
			currCard =("#card_"+i);

			selectedPitch = d3.select("#pitch_"+i);

			//selectedPitch[0][0].currentScale = 0.5;
			svgContainer = d3.select(selectedPitch);
			updatePlayerText(item,i);
			var scorer = item[0].scorer;
				if(item[0].scorer==undefined){
					console.log(scorer)
				}
				if(item[0].scorer != undefined){
					
					addGoalsToPitch(selectedPitch, scorer);
				}
						
		});	
	}

}


function getNewBGPos(scorer, numIn){

	var numOut;

	if(scorer=="Rooney"){ numOut = 0; }
	if(scorer=="Charlton"){ numOut = (numIn *1); }
	if(scorer=="Lineker"){ numOut = (numIn *2); }
	if(scorer=="Greaves"){ numOut = (numIn *3); }
	if(scorer=="Owen"){ numOut = (numIn *4); }

	return numOut;
}

function sizeBars(height, barUnitH){
//cap_"+currScorer+"_"+i
	_.each(allGoalsArr, function(item,i){
		var currClip = $("#cap_"+item.scorer+"_"+item.capno);
		var currH = parseInt(currClip.attr("height"));
		currClip.attr("height", 0)
		currClip.attr("height", (currH+barUnitH))
		currClip.attr("class","bar-in-chart-goal")
		currClip.attr("y",height-currH);
	})
	

	// if(tempGoalsArr.length == 0){
	// 	console.log(currScorer+" 0 goals")
	// }

}

function addGoalsToPitch(selectedPitch, currScorer){
//handle 0 greaves here
	var tempGoalsArr =[];	
	tempGoalsArr = _.filter(allGoalsArr, function(item){ return item.scorer == currScorer; });

	if(tempGoalsArr.length == 0){
		console.log(currScorer+" 0 goals")
	}
	
	plotGoals(selectedPitch, tempGoalsArr)
}


// if (globalSortCategory!="A"){
// 		tempArr = _.filter(allGoalsArr, function(item){ return item.matchcategory == globalSortCategory && item.scorer == currScorer; });
// 	}else{
// 		tempArr = _.filter(allGoalsArr, function(item){ return item.scorer == currScorer; });
// 	}

function plotGoals(selectedPitch, tempArr){
	setGlobalPitchDimensions();
	var lineDataUnselected = [];
	var lineDataSelected = [];
	_.each(tempArr, function(item,i){
			var penBox = d3.select("#penalty-area");
			
			var matchCat = item.matchcategory;
			var goalDistance = item.goaldistance*10;
			var startXPos = getXPos1(item.goalsquare);
			var startYPos = getYPos1(item.goalsquare);
			var currScorer = item.scorer;
			var endXPos = getEndXPos(startXPos,item.goalangle*1, goalDistance);
			var endYPos = startYPos - goalDistance;
			var coords = {"x1":startXPos, "y1":startYPos, "x2":endXPos, "y2":endYPos, "id":"goal_"+currScorer+"_"+i};
			matchCat == globalSortCategory ? lineDataSelected.push(coords) : lineDataUnselected.push(coords);	
		});
	
	var unselectedGroup = selectedPitch.append("g")
	.attr("id", "unselectedLines");

	var linesUnselected = unselectedGroup.selectAll("line")
        .data(lineDataUnselected)
        .enter()
        .append("line");

    var lineAttributesUnselected = linesUnselected
		.attr("x1",  function (d) { return d.x1; })
        .attr("y1",  function (d) { return d.y1; })
        .attr("x2",  function (d) { return d.x2; })
        .attr("y2",  function (d) { return d.y2; })
        .attr("class", "goal-line-marker")
        .attr("id", function (d) { return d.id; });

    var selectedGroup = selectedPitch.append("g")
		.attr("id", "selectedLines");

	var linesSelected = selectedGroup.selectAll("line")
        .data(lineDataSelected)
        .enter()
        .append("line");

    var lineAttributesSelected = linesSelected
		.attr("x1",  function (d) { return d.x1; })
        .attr("y1",  function (d) { return d.y1; })
        .attr("x2",  function (d) { return d.x2; })
        .attr("y2",  function (d) { return d.y2; })
        .attr("class", "goal-line-marker-selected")
        //.attr("stroke-opacity","0")
        .attr("id", function (d) { return d.id; });
}


function getEndXPos(startXPos,itemAngle, goalDistance){
	var endXPos;
	itemAngle == 90 ? itemAngle+=1 : itemAngle = itemAngle;

				if(itemAngle <= 90){
					itemCoords = solveTriangle(a=null, b=goalDistance, c=null, A=null, B=itemAngle, C=90);
					endXPos = startXPos - itemCoords[0];
				}

				if(itemAngle > 90){
					var xAdjusted;
					itemAngle = 180-itemAngle;
					itemCoords = solveTriangle(a=null, b=goalDistance, c=null, A=null, B=itemAngle, C=90);
					xAdjusted =  startXPos + (itemCoords[0] * 2)
					endXPos = xAdjusted;
				}

	return endXPos;
}




function updatePlayerText(item,i){
		var currCard =("#card_"+i);
		var targetClipNameColLeft = currCard+" .playerCol-left";
		var targetClipNameColRight = currCard+" .playerCol-right";
		var finalTally = item[item.length-1];
		var lhColHtml = getLeftColContent(finalTally,item);
		var rhColHtml = getRightColContent(i,item);

		$(targetClipNameColLeft).html(lhColHtml);
		$(targetClipNameColRight).html(rhColHtml)
		
}


function getLeftColContent(finalTally,item){

	var htmlStr = "HTML";

	var lhColCaptionHtml = setLHCapTxt(finalTally, item);

	htmlStr = item[0].firstname+" "+item[0].scorer;
	htmlStr +="<div class='playerCol-bg-img' style='background-image:url(images/"+item[0].scorer+".jpg)'></div><div class='playerCol-caption-panel'>"+lhColCaptionHtml+"</div>";

	return htmlStr;
}

function getRightColContent(numIn,item){
	var currItem = item[numIn];
	var newDate = Date.parse(currItem.date)
		
	newDate = (newDate.toString('d MMMM yyyy'));
	
	var htmlStr = "<h3>England "+currItem.scoreafterft+" "+currItem.opposition+"</h3>";
	htmlStr = htmlStr+"<div class='playerCol-caption-panel'>"
	var dateStr = "<b>"+newDate+"</br>"   
	var compStr = currItem.comp+"</br>"
	var venueStr = currItem.venue+"</b></br>"
	var bodyPart = getBodyPartStr(currItem.bodyPart)
	var distance = currItem.goaldistance + " yards </br>"
	var scoreAfter = "Score after goal: "+currItem.scoreaftergoal
	var navigation = '<div class="nav-panel" id ="navPanel_'+numIn+'"><div class="nav-button" id="nav-previous" data-direction="-1"></div><div class="nav-button" id="nav-next" data-direction="1"></div></div>'
	htmlStr = htmlStr+dateStr + compStr + venueStr+ bodyPart + distance+scoreAfter+"</div>"+navigation;

	return htmlStr;
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



function setGlobalPitchDimensions(){
	var pitchDimensionsClip = d3.select("#pitch_0");

	var penBox = d3.select("#pitch_0 #penalty-area");

	globalPitchDimensions.w = (parseInt(pitchDimensionsClip.attr("width")));
	globalPitchDimensions.h = (parseInt(pitchDimensionsClip.attr("height")));	

}


function getXPos1(refIn){
	var tempNum = globalPitchDimensions.w/2;

	var numOut;
	if (refIn == "TL" || refIn == "CL"|| refIn == "BL"){
		numOut = tempNum - 20;
	}
	if (refIn == "TCL" || refIn == "CCL"|| refIn == "BCL"){
		numOut = tempNum - 10;
	}
	if (refIn == "TC" || refIn == "CC"|| refIn == "BC"){
		numOut = tempNum;
	}
	if (refIn == "TCR" || refIn == "CCR"|| refIn == "BCR"){
		numOut = tempNum + 10;
	}
	if (refIn == "TR" || refIn == "CR"|| refIn == "BR"){
		numOut = tempNum + 20;
	}
	if (numOut == undefined || numOut =="" || numOut ==null){
		numOut=0
	}
	return numOut
}

function getYPos1(refIn){
	var tempNum = globalPitchDimensions.h;

	if (refIn == "TL" || refIn == "TCL" || refIn == "TC" || refIn == "TCR" || refIn == "TR"){
		numOut=tempNum -2;
	}
	if (refIn == "CL" || refIn == "CCL" || refIn == "CC" || refIn == "CCR" || refIn == "CR"){
		numOut=tempNum -11;
	}
	if (refIn == "BL" || refIn == "BCL" || refIn == "BC" || refIn == "BCR" || refIn == "BR"){
		numOut=tempNum  - 20;
	}
	if (numOut == undefined || numOut =="" || numOut ==null){
		numOut+=0
	}

	return numOut

}


function goalDataSort(){
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


	// _.each(filteredDataset, function(item,i){
	// 	console.log(item[0])
	// 		if(item[0].scorer != null){
	// 			var currCard =("#card_"+i);
	// 			var targetClipNameColRight = currCard+" .playerCol-right";
	// 			updatePlayerText(item)
	// 			$(targetClipNameColRight).css("background-image", "url(images/"+item[0].scorer.replace(/ /g,"_")+".jpg)")
	// 		}

	// 		if(item[0].scorer == null){
	// 			setNilGoals($("#card_"+i));
	// 		}
			
						
	// });

	

	!initViewBuilt ? buildPlayerCardsView (dataset, dataset) : buildPlayerCardsView (dataset, filteredDataset);
	// currentIndex = 0;
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
			 var tempArr = filteredDataset[numRef]
           	 upDatePosition(numRef,tempDirection,tempArr)
			 console.log(dataCount_0+" "+dataCount_1+" "+dataCount_2+" "+dataCount_3+" "+dataCount_4);
           
		})
}


function upDateFromSelect(e){
    setglobalSortCategory(e.currentTarget.value);
}

function upDatePosition(numRef,tempDirection,tempArr){
	
	var checkMax = tempArr.length-1; 


		if(numRef == 0){
			dataCount_0 = parseInt(dataCount_0) + parseInt(tempDirection); 
			dataCount_0 = checkMinMax(dataCount_0, checkMax)
			console.log(tempArr[dataCount_0])
		}
		if(numRef == 1){
			dataCount_1 = parseInt(dataCount_1) + parseInt(tempDirection); 
			dataCount_1 = checkMinMax(dataCount_1, checkMax)
			console.log(tempArr[dataCount_1])
		}
		if(numRef == 2){
			dataCount_2 = parseInt(dataCount_2) +  parseInt(tempDirection); 
			dataCount_2 = checkMinMax(dataCount_2, checkMax)
			console.log(tempArr[dataCount_2])
		}
		if(numRef == 3){
			dataCount_3 = parseInt(dataCount_3) + parseInt(tempDirection); 
			dataCount_3 = checkMinMax(dataCount_3, checkMax)
			console.log(tempArr[dataCount_3])
		}
		if(numRef == 4){
			dataCount_4 = parseInt(dataCount_4) + parseInt(tempDirection); 
			dataCount_4 = checkMinMax(dataCount_4, checkMax)
			console.log(tempArr[dataCount_4])
		}

	
	
	
}


function checkMinMax(dataCount, checkMax){
	

	if (dataCount > checkMax){
		dataCount = 0;
	}

	if (dataCount < 0){
		dataCount = checkMax;
	}

	return dataCount;
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


function setLHCapTxt(finalTally, item){
	var strOut;
	var capsNum = 0;
	var goalsNum = 0;
	var goalAverage = 0;
	
	_.each(datasetTopline, function(playerData){
		var currDataObj;

		if (playerData.scorer==finalTally.scorer)
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

		// if (matchItem.scorer == finalTally.scorer && matchItem.matchcategory == globalSortCategory ){
		// 	matchCount++;
		// }
	});
	

	if(finalTally==undefined){
		strOut = "Greaves<br/>0 Goals in XX matches";
	}else{
		strOut = goalsNum+" goals in "+getGameTypeStr()+" "+capsNum+" matches<br/>"+goalAverage+" average-per-game";
	}
	
	
	return strOut;
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

