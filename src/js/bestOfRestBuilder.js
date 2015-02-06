var dataBarChart = [];


function buildBestOfData(){
	var labels = [];
	var seriesArr = [];
	var tempObj;

	for (var key in datasetBestOfRest[0]) { 
	 				console.log(i+"  "+ datasetBestOfRest[0][key])

		}

	_.each(datasetBestOfRest, function (item,i){
		var tempLabel;
		var tempArr =[]
		
		labels.push(item.firstname+" "+item.scorer);
	 	//tempArr.push(item.totalcaps)

	 	
// 

						 
// 					
			
		
		});


	

	console.log(labels);

dataBarChart = {
        // labels: [
        //   'Rooney', 'Ronaldo', 'Pele',
        //   'John', 'Keane', 'Daei'
        // ],
        series: [
          {
            label: 'Caps',
            values: [4, 8, 15, 16, 23, 42, 6]
          },
          {
            label: 'Goals',
            values: [12, 43, 22, 11, 73, 25, 5]
          },
          {
            label: 'length of career',
            values: [31, 28, 14, 8, 15, 21, 6]
          },]
      };

      dataBarChart.labels=labels;
}




var bestOfChartW = 300;

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
     
      	var chartWidth       = bestOfChartW,
          barInChartHeight   = 20,
          groupHeight      = barInChartHeight * dataBarChart.series.length,
          gapBetweenGroups = 10,
          spaceForLabels   = 150,
          spaceForLegend   = 150;

      // Zip the series data together (first values, second values, etc.)
      var zippedData = [];
      for (var i=0; i<dataBarChart.labels.length; i++) {
        for (var j=0; j<dataBarChart.series.length; j++) {
          zippedData.push(dataBarChart.series[j].values[i]);
        }

        //console.log(zippedData)
      }

      // Color scale
      var color = d3.scale.category20();
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
          .attr("fill", function(d,i) { return color(i % dataBarChart.series.length); })
          .attr("class", "bar")
          .attr("width", x)
          .attr("height", barInChartHeight - 1);

      // Add text label in bar
      bar.append("text")
          .attr("x", function(d) { return x(d) - 3; })
          .attr("y", barInChartHeight / 2)
          .attr("fill", "red")
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
          legendSpacing  = 4;

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
          .style('fill', function (d, i) { return color(i); })
          .style('stroke', function (d, i) { return color(i); });

      legend.append('text')
          .attr('class', 'legend')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', legendRectSize - legendSpacing)
          .text(function (d) { return d.label; });

}

