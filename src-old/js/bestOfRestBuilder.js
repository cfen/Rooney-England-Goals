var dataBarChart = [];

var bestOfChartW = 900;

var globalColorsArr = ["#4bc6df", "#005689", "#e6711b" ]; 

var topFigure = 0;


// for (var key in datasetBestOfRest) { 
//     console.log(i+"  "+ datasetBestOfRest[key])
//   }





function bestOfRestInit (){

  datasetBestOfRest = _.sortBy(datasetBestOfRest, function(item) { return item.goals; });

  var htmlStr="";
  var targetClip = $('#bestGraph');
  var goalAverage = 0;

  var margin;

  isMobile ?  margin = {top: 36, right: 20, bottom: 6, left: 3} : margin = {top: 18, right: 3, bottom: 18, left: parseInt($("#bar-chart-title_0").width())};
 
   
    _.each(datasetBestOfRest, function (item,i){

        //var lhColCaptionHtml = setLHCapTxt(finalTally, item);

        goalAverage = Math.round(item.goals/item.totalcaps*100);
        goalAverage = goalAverage/100;


        '<div class="playerCol-left">Jimmy Greaves<div class="playerCol-bg-img" style="background-image:url(images/Greaves.jpg)"></div><div class="playerCol-caption-panel">45 goals in all 57 matches<br>0.79 average-per-game</div></div>'

        var playerName = item.firstname+" "+item.scorer;
        htmlStr +="<div class='player-card-lower' id='lower-card_"+i+"'><div class='playerCol-left'>"+playerName+"<div class='playerCol-bg-img' style='background-image:url(images/"+item.scorer+".jpg)'></div><div class='playerCol-caption-panel'>"+item.goals+" goals in "+item.totalcaps+" matches<br>"+goalAverage+" average-per-game</div></div>"
        htmlStr += "<div class='new-bar-chart' id='newBarChart_"+i+"'> </div></div>"    
        return htmlStr;

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

    var graphH = 152;

    var graphW = 900;

    topFigure = getMaxVal(datasetBestOfRest,"totalcaps"); 
    
    playerVals.push(dataIn.totalcaps)
    playerVals.push(dataIn.goals)

    console.log(playerVals)

    var colors = globalColorsArr;

    var grid = d3.range(25).map(function(i){
      return {'x1':0,'y1':0,'x2':0,'y2':20};
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
            .range([0,150]);

    var colorScale = d3.scale.quantize()
            .domain([0,categories.length])
            .range(colors);

    var canvas = targetClip
            .append('svg')
            .attr({'width':graphW,'height':graphH});

    var grids = canvas.append('g')
            .attr('id','grid')
            .selectAll('line')
            .data(grid)
            .enter()
            .append('line')
            .attr({'x1':function(d,i){ return i*30; },
               'y1':function(d){ return d.y1; },
               'x2':function(d,i){ return i*30; },
               'y2':function(d){ return graphH; },
            })            
            .style({'stroke':'#FFFFFF','stroke-width':'1px'});

    // var xAxis = d3.svg.axis();
    //     xAxis
    //     .orient('bottom')
    //     .scale(xscale)
    //     .tickValues(tickVals);

    // var yAxis = d3.svg.axis();
    //     yAxis
    //     .orient('left')
    //     .scale(yscale)
    //     .tickSize(2)
    //     .tickFormat(function(d,i){ return categories[i]; })
    //     .tickValues(d3.range(20));

    // var y_xis = canvas.append('g')
    //           .attr("transform", "translate(0,0)")
    //           .attr('id','yaxis')
    //           .call(yAxis);

    // var x_xis = canvas.append('g')
    //           .attr("transform", "translate(0,100)")
    //           .attr('id','xaxis')
    //           .call(xAxis);

    var chart = canvas.append('g')
              .attr("transform", "translate(0,36)")
              .attr('class','barsInBestOf')
              .selectAll('rect')
              .data(playerVals)
              .enter()
              .append('rect')
              .attr('height',(graphH/2)) // 144/4 returns 36
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

