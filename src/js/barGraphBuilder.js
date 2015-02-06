//buildBarGraphView();
var baseHeight = 3; //used to initially size bar 

function buildBarGraphView(){
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
      		.attr("height", baseHeight) // make the height reference y(d.h) function(d) { return y(d.h); }
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


function sizeBars(height, barUnitH){
//cap_"+currScorer+"_"+i
	_.each(allGoalsArr, function(item,i){
		var currClip = $("#cap_"+item.scorer+"_"+item.capno);
		var currH = parseInt(currClip.attr("height"));
		currClip.attr("height", 0)
		currClip.attr("height", (currH+barUnitH))
		currClip.attr("class","bar-in-chart-goal")
		currClip.attr("y",height-currH-barUnitH+baseHeight);
	})
	

	// if(tempGoalsArr.length == 0){
	// 	console.log(currScorer+" 0 goals")
	// }

}




