'use strict';

var xScale;
var yScale;
var mySVG;
var allTermObjs = {};
var parseTime = d3.timeParse("%Y-%m-%d");
let plotVars = ({
    plotWidth: 1400,
    plotHeight: 800, 
    plotMargin: 100 
});

const getData = async() => {
    var parseTime = d3.timeParse("%Y-%m-%d");

    var rawData =  await d3.csv('lib/data/combined/TermsCombined_withDate.csv', function(d) {
        return { 
            term: d.term,
            count: +d.count,
            date: parseTime(d.date) 

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

function getScales(){ 
    return [xScale, yScale]
}

function createPlot(rawData, topGroupedData, svg){

    xScale = d3.scaleTime()
    .domain(d3.extent(rawData, r => r.date))
    .range([0 + plotVars.plotMargin, plotVars.plotWidth - plotVars.plotMargin]);

    yScale = d3.scaleLinear()
    .domain([0, d3.max(rawData, r => r.count)])
    .range([plotVars.plotHeight - plotVars.plotMargin, 0 + plotVars.plotMargin]);

    var lineGenerator = d3.line()
        .x(v => xScale(parseTime(v.date))) 
        .y(v => yScale(v.count)); 
    
    svg.attr('width', plotVars.plotWidth)
      .attr('height', plotVars.plotHeight)
      .style('background-color', "#BB4430"); 

    // Generate Lines
    svg.append('g')
      .selectAll('path')
      .data(topGroupedData)
      .join('path')
      .attr('class', 'data-line') 
      .attr('d', d => lineGenerator(d.values)) 
      .attr('fill', 'none')     
      .attr('stroke-width', 2) 
      .attr('stroke', '#F3DFA2');

    // Add Axes and Labels
    addAxes(svg, xScale, yScale, plotVars);

    // Add labels for each line
    addLabels(svg, xScale, yScale, plotVars, topGroupedData);

    annotatePlot(svg);

    mySVG = svg;
    return svg.node();
}

function annotatePlot(svg){
    
    // Draw all lines
    var octline = svg.append("line")
        .attr("x1", 1067)
        .attr("y1", 700)
        .attr("x2", 1067)
        .attr("y2", 200)
        .attr("fill", "white")
        .attr("stroke", "white")
        .attr("stroke-width", "1px")
        .attr("class", "line-1");

    var octtext = svg.append("text")
        .attr("x", 1055)
        .attr("y", 190)
        .attr("color", "white")
        .attr("font-size", "8px")
        .text("Oct 2: POTUS & FLOTUS test positive for COVID");

    var sepline = svg.append("line")
        .attr("x1", 944)
        .attr("y1", 700)
        .attr("x2", 944)
        .attr("y2", 200)
        .attr("fill", "white")
        .attr("stroke", "white")
        .attr("stroke-width", "1px")
        .attr("class", "line-2");

    var septext = svg.append("text")
        .attr("x", 845)
        .attr("y", 190)
        .attr("color", "white")
        .attr("font-size", "8px")
        .text("Sep 9: 500,000+ U.S. children test positive");

    var aprline = svg.append("line")
        .attr("x1", 254)
        .attr("y1", 700)
        .attr("x2", 254)
        .attr("y2", 200)
        .attr("fill", "white")
        .attr("stroke", "white")
        .attr("stroke-width", "1px")
        .attr("class", "line-2");

    var aprtext = svg.append("text")
        .attr("x", 185)
        .attr("y", 190)
        .attr("color", "white")
        .attr("font-size", "8px")
        .text("Apr 20: POTUS announces 60-day immigration suspension");
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