'use strict';

var xScale;
var yScale;
var mySVG;
var allTermObjs = {};
var parseTime = d3.timeParse("%Y-%m-%d");
let plotVars = ({
    plotWidth: 1400,   // Width of plot region
    plotHeight: 800,  // Height of plot region
    plotMargin: 100   // Margin space for axes and their labels
});

const getData = async() => {
    
    var tweetData =  await d3.json('lib/data/twitter/trump_tweets.json').then( (data) => {
        mySVG = d3.select(".trump-div").append("svg");
        //console.log("ok: " + JSON.stringify(data[0]));

        var covidTerms = ["coronavirus", "virus", "mask", "stay home", "covid", "covid-19", "covid 19", "covid19", "corona", "wuhan", "spread"]

        for (var i = 0; i < data.length; i++){
            var dateData = data[i];
            var tweets = dateData.tweets;
            tweets = tweets.filter((d) => {
                //console.log("here's d: " + JSON.stringify(d));
                var text = d.text;
                for (var j = 0; j < covidTerms.length; j++){
                    if (text.includes(covidTerms[j])) return true;
                }
                return false;
            })
        }

        createPlot(data, mySVG);
    });

    return [tweetData];
}

function getScales(){ 
    return [xScale, yScale]
}

function createPlot(tweetData, svg){

    var x = d3.scaleBand().range([0 + plotVars.plotMargin, plotVars.plotWidth - plotVars.plotMargin]);
    var y = d3.scaleLinear().range([plotVars.plotHeight - plotVars.plotMargin, 0 + plotVars.plotMargin]);

    var xAxis = d3.axisBottom()
    .scale(x)
    .tickFormat(d3.timeFormat("%b"));

    var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(10);

    svg.attr('width', plotVars.plotWidth)
        .attr('height', plotVars.plotHeight)
        .append("g")
        .attr("transform",
            "translate(" + plotVars.plotMargin + "," + plotVars.plotMargin + ")");

    svg.style("background-color", "#EFE6DD");
    svg.style("fill", "#EFE6DD");
    x.domain(tweetData.map(function(d) { return parseTime(d.date); }));
    y.domain([0, d3.max(tweetData, function(d) { return d.tweets.length; })]);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("fill", "#231F20")
        .attr("transform", "translate(0," + plotVars.plotHeight + ")")
        .call(xAxis.ticks(null).tickSize(0))
        .selectAll("text")
        .attr("fill", "#231F20")
        .style("text-anchor", "middle")

    svg.append("g")
        .attr("class", "y-axis")
        .attr("fill", "#231F20")
        .call(yAxis.ticks(null).tickSize(0))
        .append("text")
        .attr("y", 6)
        .style("text-anchor", "middle")
        .attr("fill", "#231F20")
        .text("Value");

    svg.selectAll("bar")
        .data(tweetData)
        .enter().append("rect")
        .style("fill", '#7EBDC2')
        .attr("x", function(d) { return x(parseTime(d.date)); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.tweets.length); })
        .attr("height", function(d) { return plotVars.plotHeight - y(d.tweets.length); });

    // Add Axes and Labels
    // addAxes(svg, x, y, plotVars);

    // Add labels for each line
    // addLabels(svg, xScale, yScale, plotVars, topGroupedData);

    // Add rectangle with dragging 
    mySVG = svg;
    return svg.node();
}


function addAxes(svg, xScale, yScale, plotVars){
 
    var xMargin = xScale.copy().range([plotVars.plotMargin, plotVars.plotWidth - plotVars.plotMargin]);
    var yMargin = yScale.copy().range([plotVars.plotHeight - plotVars.plotMargin, plotVars.plotMargin]);
    
    svg.append('g')
        .attr('transform', `translate(0, ${plotVars.plotHeight - plotVars.plotMargin})`)
        .attr('stroke-width', 2)
        .attr("innerTickSize", -plotVars.plotHeight)
        .attr("outerTickSize", 0)
        .attr("fill", "#EFE6DD")
        .attr("class", "axis")
        .call(d3.axisBottom(xMargin));
    
    svg.append('g')
        .attr('transform', `translate(${plotVars.plotMargin}, 0)`)
        .attr('stroke-width', 2)
        .attr("class", "axis")
        .attr("fill", "#F3DFA2")
        .call(d3.axisLeft(yMargin));
    
    svg.append('text')             
      .attr('transform',
            'translate(' + (plotVars.plotWidth/2) + ' ,' + 
                           (plotVars.plotHeight - (plotVars.plotMargin /2 )) + ')')
      .style('text-anchor', 'middle')
      .attr("fill", "#F3DFA2")
      .text('Date (2020)');

  svg.append('text')
      .attr('y', 0 + (plotVars.plotMargin/2))
      .attr('x', 0 + (plotVars.plotMargin) + 10)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .attr("fill", "#F3DFA2")
      .text('Count');      
}

function addLabels(svg, xScale, yScale, plotVars, groupedData){
    
    // Add title info to graphic
    svg.append("text")
        .attr("fill", "#F3DFA2")
        .attr("font-size", "33")
        .text("Count of Trump Tweets Every Day in 2020")    
        .attr('transform',
        'translate(' + ((plotVars.plotWidth/2)*1.3) + ' ,' + 
                       (plotVars.plotMargin*1.2) + ')')
        .attr('text-align', 'right')
        .attr('word-wrap', 'normal')
        .attr('width', '400')
        .attr("font-weight", "bold")
        .attr("text-decoration", "underline")
        .style('text-anchor', 'middle');


    // Add instructions to graphic
    svg.append("text")
    .attr("fill", "#F3DFA2")
    .attr("font-size", "13")
    .attr("font-style", "italic")
    .text("Instructions: Search for a term, and watch the plot of its usage develop. Note: Terms not consistently in top 1000 terms of each day will be missing data.")    
    .attr('transform',
    'translate(' + (plotVars.plotWidth/2) + ' ,' + 
                   (plotVars.plotHeight * 0.96) + ')')
    .style('text-anchor', 'middle');

    
    let index = 0;
    groupedData.forEach(e =>{
        let term = e.term;
        allTermObjs[term] = index;
        let finalCount = e.values[e.values.length - 1].count;
        let y = yScale(finalCount);

        svg.append("text")
        .attr("fill", "#F3DFA2")
        .attr("stroke-width", 3)
        .attr("x", plotVars.plotWidth - plotVars.plotMargin + 3)
        .attr("y", y)
        .attr("font-size", 15)
        .attr("id", "label-" + index)
        .attr("class", "term-label")
        .text(term);
        index++;
    })
}


export {getData, createPlot, getScales, plotVars};