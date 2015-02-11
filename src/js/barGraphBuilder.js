//buildBarGraphView();
var baseHeight = 20; //used to initially size bar 


function initBarCharts(dataIn){
	var graphString = "<div class='graph-wrapper'><div class='bar-chart-holder'></div></div>"; //<div class='bar-chart-title'></div>
	var htmlStrGraphs = "";

	_.each(dataIn, function(item,i){
		htmlStrGraphs+=graphString;
	})

	$( "#graphsHolder" ).html(htmlStrGraphs);	

	$(".bar-chart-holder").each(function(i, e) {
		$(e).attr("id", "bar-chart_" +i);
	});

	// $(".bar-chart-title").each(function(i, e) {
	// 	$(e).attr("id", "bar-chart-title_" +i);
	// });

	$(".graph-wrapper").each(function(i, e) {
		$(e).attr("id", "graph-wrapper_" +i);
	});

	buildBarGraphView();
}



function buildBarGraphView(){

	var maxCaps = getMaxVal( datasetTopline, "totalcaps");
	var maxGoals =  getMaxVal( datasetTopline, "goals");
	
	var width = $("#graph-wrapper_0").width() -70;
	var unitSize = width/maxCaps;
	

	_.each(datasetTopline, function(item,i){
		 buildHeatMapGrid(maxCaps, item, "#bar-chart_"+i, width, 5*unitSize, true);
	});

	 addGoalsToChart();
}

function addGoalsToChart(){
	var currMatch;
	var goalCount = 0;
	_.each(allGoalsArr, function(item,i){
		currMatch == item.capno ? goalCount ++ : goalCount = 0;
		var currClip = d3.select('#'+item.scorer+'_match_'+item.capno+'_goal_'+goalCount);
		currMatch = item.capno;
		currClip.attr("class", "grid-cell-goal");		
	})
	

	// if(tempGoalsArr.length == 0){
	// 	console.log(currScorer+" 0 goals")
	// }

}




