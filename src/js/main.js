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
var dataset = filteredDataset = globalCardArray = [], datasetRooney, datasetLineker, data, globalSortCategory = "A", currentIndex = 0, initViewBuilt = false, scorersArr = [];
var goalSquaresArr = ["TL","TCL","T","TCR","TR","CL","CCL","C","CCR","CR","BL","BCL","B","BCR","BR"];
var pitchSVG ='<svg version="1.1" class="playerPitch" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="320px" height="210px" viewBox="0 360 320 210" enable-background="new 0 0 600 600" xml:space="preserve"><path fill="none" stroke="#FFFFFF" stroke-width="1.6271" d="M7.709,298.379v231.619h300V298.379H7.709L7.709,298.379 h300H7.709z"/><circle clip-path="url(#SVGID_2_)" fill="#010101" fill-opacity="0" stroke="#FFFFFF" stroke-width="1.6271" cx="157.709" cy="297.747" r="40.367"/><circle fill="#FFFFFF" stroke="#FFFFFF" stroke-width="1.2204" cx="158.501" cy="299.39" r="1.323"/><circle fill="#FFFFFF" stroke="#FFFFFF" stroke-width="0.8136" cx="157.708" cy="481.467" r="0.881"/><path fill="none" stroke="#FFFFFF" stroke-width="1.6271" d="M142.003,529.998l-3.088,7.773h37.412 l-2.471-7.773H142.003z" class="svgGoalArea"/><path fill="none" stroke="#FFFFFF" stroke-width="1.6271" d="M117.738,529.998v-24.266h80.384v24.266H117.738z"  class="svgSixYardBox"/><path fill="none" stroke="#FFFFFF" stroke-width="1.6271" d="M69.208,529.998v-72.797H246.65v72.797H69.208z"  class="svgPenaltyArea"/><path fill="none" stroke="#FFFFFF" stroke-width="1.6271" d="M125.448,457.201c13.4-17.815,38.708-21.396,56.525-7.996 c3.028,2.277,5.72,4.97,7.997,7.996H125.448z"/><path fill="none" stroke="#FFFFFF" stroke-width="1.6271" d="M12.121,529.998c0-2.44-1.976-4.413-4.411-4.413 v4.413H12.121z"/><path fill="none" stroke="#FFFFFF" stroke-width="1.6271" d="M307.709,525.587 c-2.434,0-4.413,1.971-4.413,4.411h4.413V525.587z"/>'

//var bgSVG ='<svg version="1.1" class="playerPitch" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="300px" height="300px" viewBox="0 0 300 300" enable-background="new 0 0 623.622 396.851" xml:space="preserve"><rect x="116.59" y="-226.77" fill="#008000" width="390.441" height="623.621"/><path fill="#008000" stroke="#FFFFFF" stroke-width="2" d="M127.435,85.041v284.697h368.751v-569.395H127.435V85.041l368.751,0L127.435,85.041z"/><circle fill-opacity="0" stroke="#FFFFFF" stroke-width="2" cx="311.811" cy="85.041" r="49.619"/><circle fill="#FFFFFF" stroke="#FFFFFF" cx="311.811" cy="85.041" r="1.084"/><circle fill="#FFFFFF" stroke="#FFFFFF" cx="311.811" cy="310.086" r="1.084"/><path fill-opacity="0" stroke="#FFFFFF" stroke-width="2" d="M292.505,369.738v5.422h39.153v-5.422H292.505z"/><path fill-opacity="0" stroke="#FFFFFF" stroke-width="2" d="M262.68,369.738v-29.826h98.804v29.826H262.68z"/><path class="penaltyBoxRect" fill-opacity="0" stroke="#FFFFFF" stroke-width="2" d="M203.029,369.738v-89.477h218.106v89.477H203.029z"/><path fill="#008000" stroke="#FFFFFF" stroke-width="2" d="M272.156,280.261c16.472-21.9,47.58-26.301,69.48-9.829c3.722,2.799,7.03,6.107,9.829,9.829H272.156z"/><path fill-opacity="0" stroke="#FFFFFF" stroke-width="2" d="M132.858,369.738c0-2.995-2.428-5.423-5.423-5.423v5.423H132.858z"/><path fill-opacity="0" stroke="#FFFFFF" stroke-width="2" d="M496.186,364.315c-2.994,0-5.423,2.428-5.423,5.423h5.423V364.315z"/></svg>';
//var bgSVG = '<svg version="1.1" viewBox="0 0 1260 652"><path d="M241.651,564.449 L241.651,105.137 L1014.18,105.137 L1014.18,563.342 M429.802,563.342 L429.802,380.725 L826.027,380.725 L826.027,563.342" id="Stroke-1" stroke="#FFF" stroke-width="3" fill="none"></path> <path d="M784.036,564.449 L818.578,652.254 L441.421,652.254 L489.468,564.449" id="Stroke-2" stroke="#FFF" stroke-width="7" fill="none"></path> <path d="M634.556,226.329 C634.556,229.997 631.582,232.97 627.915,232.97 C624.248,232.97 621.274,229.997 621.274,226.329 C621.274,222.661 624.248,219.689 627.915,219.689 C631.582,219.689 634.556,222.661 634.556,226.329" id="Fill-3" fill="#FFF"></path><path d="M627.682,0.084 C696.854,-1.113 776.368,39.885 816.299,104.607 M628.148,0.084 C558.975,-1.113 479.462,39.885 439.531,104.607 M0,564.449 L1260,564.449" id="Stroke-4" stroke="#FFF" stroke-width="3" fill="none"></path><path d="M699.5,626.5 L717.5,308.5" id="Line" stroke="#E6711B" stroke-width="7" stroke-linecap="square"></path></svg>';
//var pitchSVG ='<svg viewBox="0 0 1128 583" width="1128px" height="583px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"> <title>pitch</title> <desc>Created with Sketch.</desc> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <g id="Imported-Layers" sketch:type="MSLayerGroup" transform="translate(-6.000000, -6.000000)"> <path d="M217.896,510 L217.896,95 L915.896,95 L915.896,509 M387.896,509 L387.896,344 L745.896,344 L745.896,509" id="Stroke-1" stroke="#005689" stroke-width="3" sketch:type="MSShapeGroup"></path> <path d="M707.956,510 L739.166,589.334 L398.394,589.334 L441.806,510" id="Stroke-2" stroke="#005689" stroke-width="7" sketch:type="MSShapeGroup"></path> <path d="M572.896,204.5 C572.896,207.814 570.21,210.5 566.896,210.5 C563.583,210.5 560.896,207.814 560.896,204.5 C560.896,201.186 563.583,198.5 566.896,198.5 C570.21,198.5 572.896,201.186 572.896,204.5" id="Fill-3" fill="#005689" sketch:type="MSShapeGroup"></path> <path d="M566.685,0.082 C629.185,-1 701.027,36.043 737.106,94.521 M567.107,0.082 C504.607,-1 432.766,36.043 396.686,94.521 M-0.441,510 L1138.002,510" id="Stroke-4" stroke="#005689" stroke-width="3" sketch:type="MSShapeGroup"></path> </g> </g></svg>'

$(function() {

	$(document).ready(function() {
		initData();
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



function initData() {

	console.log("IN")

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

		_.each(datasetRooney, function(item){
			item.scorer = "Rooney";
		})

		_.each(datasetLineker, function(item){
			item.scorer = "Lineker";
		})

		_.each(datasetCharlton, function(item){
			item.scorer = "Charlton";
		})

		_.each(datasetOwen, function(item){
			item.scorer = "Owen";
		})

		_.each(datasetGreaves, function(item){
			item.scorer = "Greaves";
		})


	dataset.push(datasetLineker);
	dataset.push(datasetRooney);
	dataset.push(datasetCharlton);
	dataset.push(datasetOwen);
	dataset.push(datasetGreaves);

	buildView (dataset);

}


function setDataForViz(dataIn){

if(dataIn.length > 0){
		_.each(dataIn, function(item,i){
			
			scorersArr.push(item[0].scorer)
			_.each(item, function(itemObj,k){
				if(itemObj.goalsquare==""){
					itemObj.goalsquare = goalSquaresArr[Math.floor(Math.random()*goalSquaresArr.length)];
				}

				if(itemObj.goaldistance==""){
					itemObj.goaldistance = Math.floor(Math.random()*40);
				}	

				if(itemObj.goalangle==""){
					itemObj.goalangle = Math.floor(Math.random()*180);
				}

				
			})
		});
	}

return dataIn;

}


function buildView (dataIn){

	$( "#cardsHolder" ).html(" ");	

	var cardString = "<div class='player-card'><div class='playerCol-left'> </div><div class='playerCol-center'></div><div class='playerCol-right'></div><div class='pitchHolder'>"+pitchSVG+"</svg></div><div class='player-card-infobox'></div></div>";
	var htmlStr="";

	dataIn = setDataForViz(dataIn);
	
	_.each(dataIn, function(item,i){
		htmlStr+=cardString;
			
	})

	$( "#cardsHolder" ).html(htmlStr);	

	$(".player-card").each(function(i, e) {
		$(e).attr("id", "card_" +i);
	});

	$(".player-card").each(function(i, e) {
		$(e).attr("id", "card_" +i);
	});

	$(".playerPitch").each(function(i, e) {
		$(e).attr("id", "pitch_" +scorersArr[i]);
	});


	addPrevNextListeners();
	addCardListeners();	
	initViewBuilt = true;
	addDataToView(dataIn);

}

function addDataToView(dataIn){


	_.each(dataIn, function(item,i){
			var targetClipNameColLeft = "#card_"+i+" .playerCol-left";
			var targetClipNameColCenter = "#card_"+i+" .playerCol-center";
			var targetClipNameColRight = "#card_"+i+" .playerCol-right";
			var finalTally = item[item.length-1];
			var htmlStr = setCenterColTxt(finalTally);
			$(targetClipNameColLeft).html(item.length)
			$(targetClipNameColCenter).html(htmlStr)
			$(targetClipNameColRight).css("background-image", "url(images/"+finalTally.scorer.replace(/ /g,"_")+".jpg)")			
		});


	// addGoals
	_.each(dataIn, function(item,i){
		var selectedPitch ="pitch_"+item[0].scorer;
		
			_.each(item, function(itemObj,k){
				// add goals
				var startXPos = getXYPos1(itemObj.goalsquare);
				var startYPos = 10;
				var itemAngle = itemObj.goalangle *1;
				itemAngle > 90 ? itemAngle-=90 : itemAngle = itemAngle;

				var itemAngle2 = 180-90-itemAngle;

				var side1 = itemAngle2/(Math.sin(itemAngle2)) //= 90/sin(90)

				console.log(side1)

				var newPath=  '<path d = "M '+startXPos+' '+starYPos+' L 300 150 L 200 150 L 200 50" stroke = "#FFCC00" stroke-width = "3" fill = "none"/>'

				//http://www.mathsisfun.com/algebra/trig-solving-asa-triangles.html

				
			})
			
		});


}

function getXYPos1(refIn){
	var numOut;
	if (refIn == "TL" || refIn == "CL"|| refIn == "BL"){
		numOut=165
	}
	if (refIn == "TCL" || refIn == "CCL"|| refIn == "BCL"){
		numOut=160
	}
	if (refIn == "T" || refIn == "C"|| refIn == "B"){
		numOut=155
	}
	if (refIn == "TCR" || refIn == "CCR"|| refIn == "BCR"){
		numOut=150
	}
	if (refIn == "TR" || refIn == "CR"|| refIn == "BR"){
		numOut=145
	}
	return numOut
}


function newDataSort(){

	filteredDataset = tempSubArr  = [];

	if (globalSortCategory == "A"){
		filteredDataset = dataset;
	}

	if (globalSortCategory != "A"){
			_.each(dataset, function(subArr){
						_.each(subArr, function(item){
								tempSubArr = _.filter(subArr, function(item){ return item.matchcategory  == globalSortCategory; });
						});
					filteredDataset.push(tempSubArr);
				});
	}

	filteredDataset = _.sortBy(filteredDataset, function(subArr) { return subArr.length; });
	filteredDataset.reverse();

	buildView (filteredDataset);

	currentIndex = 0;

}


function addPrevNextListeners(){
	$( "select" ).change(function (e) {
        upDateFromSelect(e);
    })

    $("#next-button").click(function(e){  

	console.log("clicked")
	
	var target = e.currentTarget;


	//parseInt(target.dataset.direction)
	var direction = +target.dataset.direction;
	console.log(direction);
	upDatePosition(direction);

	});
}


function addCardListeners(){
	$(".player-card").click(function(e){
    	expandCard(e.currentTarget);
    });
}

function upDateFromSelect(e){
    setglobalSortCategory(e.currentTarget.value);
	
}

function upDatePosition(numIn){
	currentIndex += numIn;
	if (currentIndex < 0) {
			currentIndex = globalCardArray.length-1;

	} 
	else if (currentIndex >= globalCardArray.length ) {
			currentIndex = 0;
	}

	console.log(currentIndex);
	
}

function expandCard(currClip){


	$(".player-card-selected .player-card-infobox").html(" ")
	$(".player-card-selected").removeClass("player-card-selected").addClass("player-selected");
	$(currClip).addClass("player-card-selected");
	

	var dataArr = getCardData(currClip);
	upDateInfoBox(dataArr)
	globalCardArray = dataArr;
	//$(".player-card-selected").html("TARGET ITEM HERE")
}


function upDateInfoBox(dataArr){
	var newItem = dataArr[0];
	htmlStr = "Goal 1 of "+dataArr.length+"<br/>"+newItem.opposition+" "+newItem.comp+"</br>";

	//LARGE SVG here maybe?
	//htmlStr+= bgSVG;


	/*capno: 15
	comp: "UEFA Euro 2004"
	date: "17/06/2004"
	date_2: "6 January 1970"
	goalno: 6matchcategory: "T"
	opposition: "Switzerland"
	rowNumber: 6scoreafterft: "3–0"
	scoreaftergoal: "1–0"
	scorer: "Wayne Rooney"
	venue: "Estádio Cidade de Coimbra,Coimbra, Portugal"*/

	$(".player-card-selected .player-card-infobox").html(htmlStr);

}


function getCardData(currClip){

	var idStr = ($(currClip).attr("id")).split("_");

	return(filteredDataset[idStr[1]]);
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

		newDataSort();

}

function setCenterColTxt(finalTally){
	var strOut;
	strOut = finalTally.scorer+"<br/>Goals in "+getGameTypeStr() +" matches";
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

