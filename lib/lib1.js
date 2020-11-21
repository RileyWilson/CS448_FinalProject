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
    var parseTime = d3.timeParse("%Y-%m-%d");

    var rawData =  await d3.csv('lib/data/combined/TermsCombined_withDate.csv', function(d) {
        return { 
            term: d.term,
            count: +d.count,
            date: parseTime(d.date)  // parse date string into Date objectvar parseTime = ;

        };
    })
    
    var allTermData =  await d3.json('lib/data/json/TermsObject.json');

    var topTerms = ["coronavirus", "virus", "trump", "mask", "home"]

    var topGroupedData = [];
    for (var i = 0; i < topTerms.length; i++){
        var term = topTerms[i];
        topGroupedData.push({term: term, values: allTermData[term]});
    }
    
    return [rawData, topGroupedData, allTermData];
}

function getScales(){  // can i just export these vars?
    return [xScale, yScale]
}

function createPlot(rawData, topGroupedData, svg){

    xScale = d3.scaleTime()
    .domain(d3.extent(rawData, r => r.date)) // Min-Max of Date
    .range([0 + plotVars.plotMargin, plotVars.plotWidth - plotVars.plotMargin]);

    yScale = d3.scaleLinear()
    .domain([0, d3.max(rawData, r => r.count)]) // MIN-MAX OF count
    .range([plotVars.plotHeight - plotVars.plotMargin, 0 + plotVars.plotMargin]);

    var lineGenerator = d3.line()
        .x(v => xScale(parseTime(v.date))) // date should go on the x-axis
        .y(v => yScale(v.count)); // count should go on the y-axis
    
    svg.attr('width', plotVars.plotWidth)
      .attr('height', plotVars.plotHeight)
      .style('background-color', "#BB4430"); 

    // Generate Lines
    svg.append('g')
      .selectAll('path')
      .data(topGroupedData)
      .join('path')
      .attr('class', 'data-line')   // Class name to be able to access the lines later
      .attr('d', d => lineGenerator(d.values))  // Use lineGenerator on d.values
      .attr('fill', 'none')     
      .attr('stroke-width', 2)               // Do not fill the area defined by the path
      .attr('stroke', '#F3DFA2');   // Set a color for the line (The maps for color is in 'color')

    // Add Axes and Labels
    addAxes(svg, xScale, yScale, plotVars);

    // Add labels for each line
    addLabels(svg, xScale, yScale, plotVars, topGroupedData);

    // Add rectangle with dragging 
    svg.call(d3.drag()
        .on("start", function (event) {startDrawing(event, svg);})
        .on("end", function (event) { releaseDrag(event); })
        .on("drag", function (event) { resizeRect(event); }));

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
        //.attr("stroke", "#EFE6DD")
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
        .text("Frequency of COVID-Related Terms Tweeted in 2020")    
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

    // Add labels of names to each line
    
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