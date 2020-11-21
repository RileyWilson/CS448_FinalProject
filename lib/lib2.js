'use strict';


// For twitter APIs
//const needle = require('needle');
const token = 'AAAAAAAAAAAAAAAAAAAAAIViJwEAAAAAseGGWTQWjaMgz%2BXCv%2FnVy1rUXk%3D4nXnAkEk9IQK5nnmUqovw3GQFCE5Hl7vraz3qbWf331LOfqkpJ'; 
const endpointUrl = 'https://api.twitter.com/2/tweets/search/recent'

var xScale;
var yScale;
var allTermObjs = {};
var parseTime = d3.timeParse("%Y-%m-%d");
let plotVars = ({
    plotWidth: 1200,   // Width of plot region
    plotHeight: 800,  // Height of plot region
    plotMargin: 100   // Margin space for axes and their labels
});
var dataCount = 80;

const getData = async() => {
    
    var termsData = await d3.csv("lib/data/raw/frequent_terms.csv", function(d) {
        return { 
            term: d.term,
            value: +d.counts,
        };
    });

    var bigramsData = await d3.csv("lib/data/mod/frequent_bigrams_symbol.csv", function(d) {
        return { 
            term: d.gram,
            value: +d.counts,
        };
    });

    var trigramsData = await d3.csv("lib/data/mod/frequent_trigrams_symbol.csv", function(d) {
        return { 
            term: d.gram,
            value: +d.counts,
        };
    });

    let obj = {terms: termsData.slice(0, dataCount), bigrams: bigramsData.slice(0, dataCount), trigrams: trigramsData.slice(0, dataCount)};
    return obj;
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
      .style('background-color', "#7EBDC2"); 

    // Generate Lines
    svg.append('g')
      .selectAll('path')
      .data(topGroupedData)
      .join('path')
      .attr('class', 'data-line')   // Class name to be able to access the lines later
      .attr('d', d => lineGenerator(d.values))  // Use lineGenerator on d.values
      .attr('fill', 'none')     
      .attr('stroke-width', 2)               // Do not fill the area defined by the path
      .attr('stroke', '#231F20');   // Set a color for the line (The maps for color is in 'color')

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
        .call(d3.axisBottom(xMargin));
    
    svg.append('g')
        .attr('transform', `translate(${plotVars.plotMargin}, 0)`)
        .attr('stroke-width', 2)
        .call(d3.axisLeft(yMargin));
    
    svg.append('text')             
      .attr('transform',
            'translate(' + (plotVars.plotWidth/2) + ' ,' + 
                           (plotVars.plotHeight - (plotVars.plotMargin /2 )) + ')')
      .style('text-anchor', 'middle')
      .text('Date (2020)');

  svg.append('text')
      .attr('y', 0 + (plotVars.plotMargin/2))
      .attr('x', 0 + (plotVars.plotMargin) + 10)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Count');      
}

function addLabels(svg, xScale, yScale, plotVars, groupedData){
    
    // Add title info to graphic
    svg.append("text")
        .attr("fill", "#231F20")
        .attr("font-size", "28")
        .text("Frequency of COVID-Related Terms Tweeted in 2020")    
        .attr('transform',
        'translate(' + ((plotVars.plotWidth/2)*1.25) + ' ,' + 
                       (plotVars.plotMargin*1.2) + ')')
        .attr('text-align', 'right')
        .attr('word-wrap', 'normal')
        .attr('width', '400')
        .attr("text-decoration", "underline")
        .attr('background-color', "white")
        .style('text-anchor', 'middle');



    // Add instructions to graphic
    svg.append("text")
    .attr("fill", "231F20")
    .attr("font-size", "13")
    .attr("font-style", "italic")
    .text("Instructions: Draw boxes to filter. Drag the edges of a box to resize, or drag the whole box to move it. \nDouble click a box to delete it.")    
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
        .attr("fill", "#231F20")
        .attr('background-color', '#EFE6DD')
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

const getTweetData = async(term, n) => {


    var tweet = d3.json(getFilename(n)).then( (d) => {
        console.log("MYU D: " + d);
        
        for (var i = 0; i < d.length; i++){
            let datum = d[i];
            //console.log("datum: " + JSON.stringify(datum));
            if (datum.term == term){
                //console.log("found it: " + datum.tweets);
                d3.select(".bubble-tooltip-content").text(datum.tweets);
                
                //let rect = d3.select("bubble-tooltip");
                /*
                new d3plus.TextBox()
                    .data([{text: datum.tweets}])
                    .fontSize(16)
                    .width(400)
                    .height(300)
                    .y(200)
                    .x(900)
                    .select(".bubble-tooltip")
                    .render();
                
               d3plus.textwrap()
                    .container(d3.select(".bubble-tooltip"))
                    .resize(true)
                    .draw();*/
                return datum.tweets; //rename
            }
        }
    });

    return tweet;
    
}

function getFilename(n){
    var tweetFilename;
    if (n == 1){ // term
        return 'lib/data/twitter/twitter_terms.json';
    } else if (n == 2){ // bigram
        return 'lib/data/twitter/twitter_bigrams.json';
    } else if (n == 3){ // trigram
        return 'lib/data/twitter/twitter_trigrams.json';
    }
}
export {getData, createPlot, getScales, plotVars, getTweetData};