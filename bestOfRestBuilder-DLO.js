var dataBarChart = [];
var labels = []
var bestOf_goalsArr = [];
var bestOf_capsArr = [];
var bestOf_careerArr = [];
var bestOf_nationalities = [];
var seriesArr = [];
var bestOfChartW = 900;
var globalColorsArr = ["#4bc6df", "#005689", "#e6711b" ]; 

function buildBestOfData(){

	var tempObj;

	for (var key in datasetBestOfRest) { 
    //console.log(i+"  "+ datasetBestOfRest[key])
	}


  // $.each(datasetBestOfRest, function(key, value) { 

  //   console.log(datasetBestOfRest[key])
  //   // key is the key
  //   // value is the value +"  "+value
  // });

	_.each(datasetBestOfRest, function (item,i){
		var tempLabel;
		

    // for (var key in item) { 
    //     console.log(i+"  "+ item[key])
    // }

    // $.each(item, function(key, value) { 
    //       console.log(item[key])
    //       // key is the key
    //       // value is the value +"  "+value
    // });
		
    bestOf_goalsArr.push(item.goals)
    
    bestOf_capsArr.push(item.totalcaps)
    
    bestOf_careerArr.push(item.lengthofcareer)
   
    bestOf_nationalities.push(item.nationality)
		labels.push(item.firstname+" "+item.scorer);
	 	//tempArr.push(item.totalcaps)
    // 					 
    // 					
});

    dataBarChart = {
            // labels: [
            //   'Rooney', 'Ronaldo', 'Pele',
            //   'John', 'Keane', 'Daei'
            // ],
            series: [
              {
                label: 'Caps',
                 colorVal: globalColorsArr[0],
                 values: []
              },
              {
                label: 'Goals',
                 colorVal: globalColorsArr[1],
                 values: []
              },
              {
                label: 'length of career',
                 colorVal: globalColorsArr[2],
                 values: []
              },
              ]
          };

      dataBarChart.labels=labels;
      dataBarChart.series[0]["values"] = bestOf_capsArr;
      dataBarChart.series[1]["values"] = bestOf_goalsArr;
      dataBarChart.series[2]["values"] = bestOf_careerArr;
      bestOf_goalsArr.colorRef = globalColorsArr [0]
      bestOf_capsArr.colorRef = globalColorsArr [1]
      bestOf_careerArr.colorRef = globalColorsArr [2]
      dataBarChart.nationalities = bestOf_nationalities;

      console.log(dataBarChart);
}

function bestOfRestData (){
	var htmlStr = "<svg class='new-bar-chart'></svg>"
	 targetClip = $('#bestGraph');
	 targetClip.html(htmlStr);
	// _.each(datasetBestOfRest, function (item,i){
	// 	htmlStr+="<div class= 'graphBarHorizontal' id='bestGraphBar_"+item.scorer+"'></div>";
	// });
	//htmlStr+='<div class="chart"></div>'
	
	buildBestOfData();
	buildBestOfChart();
	//drawBestWidths();
}

function drawBestWidths(){
	// var maxUnit = getMaxVal(datasetBestOfRest,"goals");
	// var w = $("#bestGraph").width();
	// w = w  / maxUnit;

	// console.log(w)

	// _.each(datasetBestOfRest, function (item,i){
	// 	var targetClip = $("bestGraphBar_"+item.scorer);
	// 	var newW = Math.floor(w * item.goals);

	// 	targetClip.css("width",newW);

	// })	
}


function buildBestOfChart(){

		console.log(isMobile)	
     
      	var chartWidth = bestOfChartW,
          barInChartHeight   = 36,
          groupHeight      = barInChartHeight * dataBarChart.series.length,
          gapBetweenGroups = 12,
          spaceForLabels   = 180,
          spaceForLegend   = 180;

      // Zip the series data together (first values, second values, etc.)
      var zippedData = [];
      for (var i=0; i<dataBarChart.labels.length; i++) {
        for (var j=0; j<dataBarChart.series.length; j++) {
          zippedData.push(dataBarChart.series[j].values[i]);
        }

        //console.log(zippedData)
      }

      // Color scale
      var color = globalColorsArr;
      var chartHeight = barInChartHeight * zippedData.length + gapBetweenGroups * dataBarChart.labels.length;

      var x = d3.scale.linear()
          .domain([0, d3.max(zippedData)])
          .range([0, chartWidth]);

      var y = d3.scale.linear()
          .range([chartHeight + gapBetweenGroups, 0]);

      var yAxis = d3.svg.axis()
          .scale(y)
          .tickFormat('')
          .tickSize(0)
          .orient("left");

      // Specify the chart area and dimensions
      var chart = d3.select(".new-bar-chart")
          .attr("width", spaceForLabels + chartWidth + spaceForLegend)
          .attr("height", chartHeight);

      // Create bars
      var bar = chart.selectAll("g")
          .data(zippedData)
          .enter().append("g")
          .attr("transform", function(d, i) {
            return "translate(" + spaceForLabels + "," + (i * barInChartHeight + gapBetweenGroups * (0.5 + Math.floor(i/dataBarChart.series.length))) + ")";
          });

      // Create rectangles of the correct width
      bar.append("rect")
          .attr("fill", function(d,i) { console.log(d); return globalColorsArr[0] })
          .attr("class", "bar")
          .attr("width", x)
          .attr("height", barInChartHeight - 1);

      // Add text label in bar
      bar.append("text")
          .attr("x", function(d) { return x(d) - 3; })
          .attr("y", barInChartHeight / 2)
          .attr("fill", "#005689")
          .attr("dy", ".35em")
          .text(function(d) { return d; });

      // Draw labels
      bar.append("text")
          .attr("class", "label")
          .attr("x", function(d) { return - 10; })
          .attr("y", groupHeight / 2)
          .attr("dy", ".35em")
          .text(function(d,i) {
            if (i % dataBarChart.series.length === 0)
              return dataBarChart.labels[Math.floor(i/dataBarChart.series.length)];
            else
              return ""});

      chart.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups/2 + ")")
            .call(yAxis);

      // Draw legend
      var legendRectSize = 18,
          legendSpacing  = 2;

      var legend = chart.selectAll('.legend')
          .data(dataBarChart.series)
          .enter()
          .append('g')
          .attr('transform', function (d, i) {
              var height = legendRectSize + legendSpacing;
              var offset = -gapBetweenGroups/2;
              var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
              var vert = i * height - offset;
              return 'translate(' + horz + ',' + vert + ')';
          });

      legend.append('rect')
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .style('fill', function (d, i) { return color[i]; })
          .style('stroke', function (d, i) { return color[i]; });

      legend.append('text')
          .attr('class', 'legend')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', legendRectSize - legendSpacing)
          .text(function (d) { return d.label; });

}

