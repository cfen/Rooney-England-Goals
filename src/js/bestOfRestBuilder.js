var dataBarChart = [];
var labels = []
var bestOf_goalsArr = [];
var bestOf_capsArr = [];
var bestOf_careerArr = [];
var bestOf_nationalities = [];
var seriesArr = [];

var bestOfChartW = 900;

var globalColorsArr = ["#4bc6df", "#005689", "#e6711b" ]; 

var topFigure = 0;


// for (var key in datasetBestOfRest) { 
//     console.log(i+"  "+ datasetBestOfRest[key])
//   }


function bestOfRestInit (){

  var htmlStr="";
  var targetClip = $('#bestGraph');
   
    _.each(datasetBestOfRest, function (item,i){
        htmlStr += "<div class='new-bar-chart' id='newBarChart_"+i+"'></div>"   
    });

    targetClip.html(htmlStr);
    addBestOfGraphs();

}

function addBestOfGraphs(){
   _.each(datasetBestOfRest, function (item,i){
        buildBestOfChart( d3.select("#newBarChart_"+i), item );
    });
}


function buildBestOfChart(targetClip, dataIn){

		var categories= ['Goals', 'Caps'];

    var playerVals = [];

    var graphH = 144;

    var graphW = 900;

    topFigure = getMaxVal(datasetBestOfRest,"totalcaps"); 
    
    playerVals.push(dataIn.totalcaps)
    playerVals.push(dataIn.goals)

    console.log(playerVals)

    var colors = ['#4bc6df','#005689','#0094ff','#0d4bcf','#0066AE','#074285','#00187B','#285964','#405F83','#416545','#4D7069','#6E9985','#7EBC89','#0283AF','#79BCBF','#99C19E'];

    var grid = d3.range(25).map(function(i){
      return {'x1':0,'y1':0,'x2':0,'y2':180};
    });

    var tickVals = grid.map(function(d,i){
      if(i>0){ return i*10; }
      else if(i===0){ return "100";}
    });

    var xscale = d3.scale.linear()
            .domain([0, topFigure])
            .range([0, 722]);        

    var yscale = d3.scale.linear()
            .domain([0,categories.length])
            .range([0,80]);

    var colorScale = d3.scale.quantize()
            .domain([0,categories.length])
            .range(colors);

    var canvas = targetClip
            .append('svg')
            .attr({'width':graphW,'height':graphH});

    var grids = canvas.append('g')
            .attr('id','grid')
            .attr('transform','translate(180,0)')
            .selectAll('line')
            .data(grid)
            .enter()
            .append('line')
            .attr({'x1':function(d,i){ return i*30; },
               'y1':function(d){ return d.y1; },
               'x2':function(d,i){ return i*30; },
               'y2':function(d){ return d.y2; },
            })
            .style({'stroke':'#adadad','stroke-width':'1px'});

    // var xAxis = d3.svg.axis();
    //   xAxis
    //     .orient('bottom')
    //     .scale(xscale)
    //     .tickValues(tickVals);

    // var yAxis = d3.svg.axis();
    //   yAxis
    //     .orient('left')
    //     .scale(yscale)
    //     .tickSize(2)
    //     .tickFormat(function(d,i){ return categories[i]; })
    //     .tickValues(d3.range(17));

    // var y_xis = canvas.append('g')
    //           .attr("transform", "translate(180,0)")
    //           .attr('id','yaxis')
    //           .call(yAxis);

    // var x_xis = canvas.append('g')
    //           .attr("transform", "translate(180,480)")
    //           .attr('id','xaxis')
    //           .call(xAxis);

    var chart = canvas.append('g')
              .attr("transform", "translate(180,0)")
              .attr('class','barsInBestOf')
              .selectAll('rect')
              .data(playerVals)
              .enter()
              .append('rect')
              .attr('height',graphH/4) // 144/4 returns 36
              .attr({'x':0,'y':function(d,i){ return yscale(i); }})
              .attr('id', function(d,i){ return 'bars-in-best-of_'+i; })
              .style('fill',function(d,i){ return colorScale(i); })
              .attr("width", function(d) {return xscale(d); });
              //.attr('width',function(d){ return 0; });


    var transit = d3.select("svg").selectAll("rect")
              .data(playerVals)
              .transition()
              .duration(1000) 
              .attr("width", function(d) {return xscale(d);});

    var transitext = d3.selectAll(".barsInBestOf")
              .selectAll('text')
              .data(playerVals)
              .enter()
              .append('text')
              .attr("class", "horiz-bar-figure")
              .attr({'x':function(d) {return xscale(d)-10; },'y':function(d,i){ return yscale(i)+24; }})
              .text(function(d){ return d; });
}

