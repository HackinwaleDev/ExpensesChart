/* THIS IS A PENDING PROJECT FOR JSCHOES NOT SURE HE STILL WANTS IT BUT I WILL DO IT 
    SHOULD IN CASE HE CAME BACK ASKING OF IT */

/** ADOPT THE CONCEPT OF REUSABLE STRICTLY */
dataProcessor();
function dataProcessor(){
    var JSON_DATA = "data/example.json"
    d3.json(JSON_DATA).then(function(response){
        logger(response)
        return response
    })
    .then(function(data){
        // instantiate the chart
        var myChart = drawExpensesChart().data(data);

        // init
        d3.select('#expense-chart').call(myChart);
    })
} // end dataprocessor 

function drawExpensesChart(){

    // Declaration of variables
    let containerWidth = 700, containerHeight = 400;
    let margin = {top: 20, bottom: 20, left: 50, right: 20};
    let svgWidth = containerWidth - 50;
    let svgHeight = containerHeight -50
    let width = svgWidth - margin.left - margin.top;
    let height = svgHeight - margin.right - margin.bottom;

    // Constant time parse
    const parseTime = d3.timeParse('%x')
    // Updatables
    var data;

    function drawChart(selection){
        selection.each(function(){
            // processs the data for use
            var monthlyExpenses = data['month_overview'].map(function(d){
                return {
                    date: parseTime(d.Date),
                    budget: d.Expense
                }
            });
            var dailyBudget = data['daily_budget']

            var mySelection = d3.select(this)
            logger(selection)
            // Select and format the svg
            var svg = mySelection.attr('width', svgWidth)
                            .attr('height', svgHeight)
            
            // Place a master container in svg and format
            var chart = svg.append('g')
                            .attr('transform', 'translate('+ margin.left +',' +margin.top+')')
                            .attr('class', 'container')
                            .style('fill', 'green')
                chart.append('text')
                            .attr('x', margin.left)
                            .text('Expenses made this month')
            // Define custom tooltip
            var tooltip = d3.select('#svg-container')
                          .append('div')
                            .attr('class', 'tooltip')
            //setting the range and scale
            var x = d3.scaleTime()
                            .domain(d3.extent(monthlyExpenses, function(d){ return d.date}))
                            .rangeRound([0, width])
            var y = d3.scaleLinear()
                            .domain(d3.extent(monthlyExpenses, function(d){ return d.budget}))
                            .rangeRound([height, 0])
            //set the x-y axis
            var xAxis = chart.append('g')
                            .attr('class', 'x-axis')
                            .attr('transform', 'translate(0,'+ height +')')
                            .call(d3.axisBottom(x)
                                .ticks(5))
            var yAxis = chart.append('g')
                                .attr('class', 'x-axis')
                              .call(d3.axisLeft(y)
                                .ticks(5)
                                .tickFormat(function(d){ return '$'+d}))
            // Drawing gridlines
            var yGrid = chart.append('g')
                                .attr('class', 'grid')
                              .call(d3.axisLeft(y)
                                .ticks(5)
                                .tickSize(-width)
                                .tickFormat(''))

            // Define the color gradient for the line chart
            var areaColor = chart.append('defs')
                          .append('linearGradient')
                            .attr('id', 'line-gradient')
                            .attr("gradientUnits", "userSpaceOnUse")
                            .attr('x1', 0).attr('x2', 0)
                            .attr('y1', y(dailyBudget-30))
                            .selectAll('stop')
                          .data([
                                {offset: '0%', color: 'aqua'},
                                {offset: '100%', color: 'red'}
                            ])
                areaColor.enter().append('stop')
                            .attr('offset', function(d){ return d.offset})
                            .attr('stop-color', function(d){ return d.color})

            // Define the line tool first
            var line = d3.line()
                            .curve(d3.curveMonotoneX)
                            .x(function(d){ return x(d.date)})
                            .y(function(d){ return y(d.budget)})
            // Now define the path
            var linePath = chart.append('path')
                            .attr('class', 'line-path')
                          .datum(monthlyExpenses)  
                            // .on('mouseover', function(d){
                            //     dotEnter.attr('r', 4)
                            // }) 
                            // .on('mouseout', function(d){
                            //     dotEnter.attr('r', 0)
                            // })                        
                            .attr('d', line)
            // Let's define the area too
            var area = d3.area()
                            .curve(d3.curveMonotoneX)
                            .x(function(d){ return x(d.date)})
                            .y0(height)
                            .y1(function(d){ return y(d.budget)})
            // Set path for the area
            var areaPath = chart.append('path')
                            .attr('class', 'area-path')
                          .datum(monthlyExpenses)
                            // .style('fill', 'url(#area-gradient)')
                            .style('fill', 'skyblue')
                            .attr('d', area)
            
            // Draw circle to show datapoint
            var dataCircle = chart.selectAll('.dot')
                          .data(monthlyExpenses)
            var dotEnter = dataCircle.enter()
                          .append('circle')
                            .attr('class', 'dot')
                            .attr('cx', function(d){ return x(d.date)})
                            .attr('cy', function(d){ return y(d.budget)})
                            .attr('r', 4)
                            // .attr('visibility', 'hidden')
                            .on('mouseover', function(d,i){
                                /* Do some magik here */
                                d3.select(this)
                                    .attr('r', 4)
                                    // .attr('visibility', 'visible')
                                    .style('stroke', 'green')
                                    .style('fill', 'white')
                                    showToolTip(d)
                            })
                            .on('mousemove', moveToolTip)
                            .on('mouseout', function(d){
                                d3.select(this)
                                    .attr('r', 4)
                                    .style('stroke', 'aqua')
                                    hideToolTip()
                            })
                            .attr('fill', 'white')
                            .style('stroke', 'aqua')
                            .style('stroke-width', 2)
                            
            // Create custom tooltip 
            function showToolTip(d) {
                logger('== Tooltip should show now ==')
                const formatDay = d3.timeFormat('%a')
                const formatDate = d3.timeFormat('%B %d')
                const html = `
                    <div><span class="header">Date: </span> ${formatDate(d.date)}</div>
                    <div><span class="header">Budget: </span>$${d.budget}</div>
                    <div><span class="header">Day: </span> ${formatDay(d.date)}</div>
                `;
                tooltip.html(html);
                // tooltip.text('We are here')
                tooltip.box = tooltip.node().getBoundingClientRect();
                tooltip.transition().style("opacity", 1);
            
            } // end showToolTip
            //set coordinates for when tooltip move
            function moveToolTip() {
                const top = d3.event.clientY - tooltip.box.height - 5;
                let left = d3.event.clientX - tooltip.box.width / 2;
                if (left < 0) {
                  left = 0;
                } else if (left + tooltip.box.width > window.innerWidth) {
                  left = window.innerWidth - tooltip.box.width;
                }
                tooltip.style("left", left + "px").style("top", top + "px");
              }
            function hideToolTip() {
                tooltip.transition().style("opacity", 0);
              }
        }); //end selection

    }// end drawChart

    // Setter-Getter for the expenses
    drawChart.data = function(value){
            if(!arguments.length){
                return expenses;
            }
            data = value;
            return drawChart;
        }

    // return the chart
    return drawChart;
}//end drawExpensesChart

// create a logger function
let debugMode = false;
function logger(param){
    if(debugMode)
        console.log(param)
}
