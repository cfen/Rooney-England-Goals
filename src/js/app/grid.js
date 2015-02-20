/**
*   calendarWeekHour    Setup a week-hour grid: 
*                           7 Rows (days), 24 Columns (hours)
*   @param id           div id tag starting with #
*   @param width        width of the grid in pixels
*   @param height       height of the grid in pixels
*   @param square       true/false if you want the height to 
*                           match the (calculated first) width
*/

var maxGridGoals = 5;
var maxGridGames;
var currGamesNumber;
var gridItemWidth;


function buildHeatMapGrid(maxCaps, item, id, width, height, square)
{
  
  
  !isMobile ? width = width : width = width;


  var cellPad = 1;
  var topPadding = 48; // 1 grid Unit + gutter;
  maxGridGames = maxCaps;
  currGamesNumber = item.totalcaps;

    //width = d3.select("#chart").width()
    var gridData = generateData(item, width, height, square);

    var grid = d3.select(id).append("svg")
                .attr("width", width)
                .attr("height", height + topPadding)
                .attr("class", "chart");

      var x = d3.scale.linear().range([0, width]);
      //var y = d3.scale.linear().range([0, height]);
          x.domain(d3.extent(gridData, function(d,i) {
            return i;
          }));
          // y.domain([0, d3.max(gridData, function(d) {
          //   return d.y;
          // })]);

      var axisScale = d3.scale.linear()
               .domain([0, maxGridGames]) // tick calibrate to games
               .range([0, width]);  // set axis to width

      var xAxis = d3.svg.axis()
                  .scale(axisScale)
                  .orient("bottom")
                  .ticks(10)
                  .innerTickSize(height);

          grid.append("g")
                 .attr("class", "axis") 
                 .attr("transform", "translate("+(gridItemWidth/2)*-1+",-2)")
                 .call(xAxis);   
            grid.selectAll(".tick")
            .each(function (d, i) {
                if ( d == 0 ) {
                    this.remove();
                }

    var row = grid.selectAll(".row")
                .data(gridData)
                .enter().append("svg:g")
                .attr("class", "row");

    var col = row.selectAll(".cell")
                 .data(function (d) { return d; })
                 .enter().append("svg:rect")
                 .attr("class", function(d){ var classRef; d.matchRef==0 ? classRef = "grid-cell-cap":classRef = "grid-cell"; return classRef})
                 //.style("opacity", 0)
                 .attr("id", function (d,i){ return d.id})
                 .attr("x", function(d) { return d.x ; })//- (d.width/2)
                 .attr("y", function(d) { return d.y; })
                 .attr("width", function(d){ var wRef; d.matchRef==0 ? wRef = d.width : wRef = d.width-(d.width / 2); return d.width})
                 .attr("height", function(d){ var wRef; d.matchRef==0 ? wRef = d.width-(d.width / 2) : wRef = d.width-(d.width / 2); return d.height})
            
            .on('mouseover', function() {
                    d3.select(this)
                        //.style('fill', '#0F0');
                 })

            .on('mouseout', function() {
                    d3.select(this)
                        //.style('fill', '#FFF');
                 })

            .on('click', function() {
                    currClip = d3.select(this)
                    console.log(currClip.attr("id"));
                 })

            // col.enter().append('rect')
            //   .attr('opacity', 1)

            col.transition()
                .delay(250) //function(d,i) { return i * 10; }
                .duration(250)
                .attr('opacity', 1)

      
            
          });
   
   
               
}



function generateData(item, gridWidth, gridHeight, square)
{

  //square=false
    var data = new Array();
    gridItemWidth = gridWidth / maxGridGames;
    var gridItemHeight = (square) ? gridItemWidth : gridHeight / maxGridGoals;
    var startX = 0;
    var startY = gridItemHeight * maxGridGoals;
    var stepX = gridItemWidth;
    var stepY = gridItemHeight;
    var xpos = startX;
    var ypos = startY - gridItemHeight;
    var newValue = 0;

    for (var index_a = 0; index_a < maxGridGoals; index_a++)
    {
        data.push(new Array());
        for (var index_b = 0; index_b < currGamesNumber; index_b++)
        {
            
            data[index_a].push({ 
                                time: index_b, 
                                width: gridItemWidth,
                                height: gridItemHeight,
                                x: xpos,
                                y: ypos,
                                matchRef: index_a,
                                id: item.scorer+"_match_"+index_b+"_goal_"+index_a
                            });
            xpos += stepX;
           
        }
        xpos = startX;
        ypos -= stepY;
    }
    return data;
}




