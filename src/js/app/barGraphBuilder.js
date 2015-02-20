//buildBarGraphView();
var baseHeight = 20; //used to initially size bar 


function initBarCharts(dataIn){

	

	var lhColStr = '<div class="sub-left-col-copy"></div>'
	
	
	var htmlStrGraphs = "";

	_.each(dataIn, function(item,i){
		var topLineItem = getTopLineItem(item[0].scorer);

		var topLineStats = topLineItem.goals+" goals in "+topLineItem.totalcaps+" games."
		var timeStats = getCareerLength(topLineItem)

		var graphString = "<div class='subContentBlock'><h4 class='subSectionHeading'>"+item[0].firstname+" "+item[0].scorer+"</h4><div class='graphStats'>"+timeStats+"<br/>"+topLineStats+"</div><div class='graph-wrapper'></div></div>"; 
		htmlStrGraphs+=graphString;
	})

	$( "#graphsHolder" ).html(htmlStrGraphs);	

	

	// $(".bar-chart-title").each(function(i, e) {
	// 	$(e).attr("id", "bar-chart-title_" +i);
	// });

	$(".graph-wrapper").each(function(i, e) {
		$(e).attr("id", "graph-wrapper_" +i);
	});

	buildBarGraphView();
}

function getCareerLength(topLineItem){
	var d1 = Date.parse(topLineItem.datefirstcap);
	var d2 = Date.parse(topLineItem.datelastcap);



	d2==null ? d2 = "current" : d2 = d2;
	var d1Str = d1.toString('yyyy');
	var d2Str = d2.toString('yyyy');
		
	return d1Str+"–"+d2Str;
		
}

function buildBarGraphView(){

	var maxCaps = getMaxVal( datasetTopline, "totalcaps");
	var maxGoals =  getMaxVal( datasetTopline, "goals");
	
	var width = $("#graph-wrapper_0").width();

	var unitSize = width/maxCaps;
	
	var height = 60;

	_.each(datasetTopline, function(item,i){
		 buildHeatMapGrid(maxCaps, item, "#graph-wrapper_"+i, width, height, true);
	});

	 addGoalsToChart();
}

function addGoalsToChart(){
	var currMatch;
	var goalCount = 0;
	_.each(allGoalsArr, function(item,i){
		currMatch == item.capno ? goalCount ++ : goalCount = 0;
		var currClip = d3.select('#'+item.scorer+'_match_'+item.capno+'_goal_'+(goalCount+1));
		currMatch = item.capno;
		currClip.attr("class", "grid-cell-goal");

		// var baseClip = d3.select('#'+item.scorer+'_match_'+item.capno+'_goal_0');
		// baseClip.attr("class", "grid-cell-cap");
	})
	

	// if(tempGoalsArr.length == 0){
	// 	console.log(currScorer+" 0 goals")
	// }

}


function getTopLineItem(scorerIn){
	var itemOut
	_.each(datasetTopline, function(item,i){
		 if(scorerIn == item.scorer){
		 		itemOut = item;
		 }
	});
	return itemOut;
}




