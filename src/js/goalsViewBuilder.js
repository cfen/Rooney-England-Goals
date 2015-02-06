
function buildGoalsView(dataIn,filteredData){
	
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


