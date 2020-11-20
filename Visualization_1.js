'use strict';
import * as lib1 from './lib/lib1.js'

var rawData, topGroupedData, allTermData;
var searchTerms, groupedSearchData;
var mySvg;
var parseTime = d3.timeParse("%Y-%m-%d"); // can i export this from lib1


const main = async(params) => {
    searchTerms = [];
    groupedSearchData = [];
    createPlot();
    createSearchable();
}

function searchForTerm(term){
    if (term in allTermData){
        
        // Generate Lines
        searchTerms.push(term);

        let termValues = allTermData[term];
        groupedSearchData.push({term: term, values: termValues});

        let [xScale, yScale] = lib1.getScales();
        let pathLength = 8400;
        const transitionPath = d3.transition()
            .duration(6500);

        var lineGenerator = d3.line()
            .x(v => xScale(parseTime(v.date))) // date should go on the x-axis
            .y(v => yScale(v.count));             // count should go on the y-axis

        // Draw all lines
        mySvg.append('g')
            .selectAll('path')
            .data(groupedSearchData)
            .join('path')
            .attr('class', 'search-line')               
            .attr('d', d => lineGenerator(d.values))
            .attr('fill', 'none')
            .attr('stroke', '#EFE6DD')
            .attr('id', term)
            .attr('stroke-width', 2);

        let finalCount = termValues[[termValues.length - 1]].count;
        let y = yScale(finalCount);

        d3.selectAll('.search-line')
            .attr('stroke-dashoffset', pathLength)
            .attr('stroke-dasharray', pathLength)
            .transition(transitionPath)
            .attr('stroke-dashoffset', 0);
    
        // Add label
        mySvg.append("text")
            .attr("fill", '#EFE6DD')
            .attr("stroke-width", 3)
            .attr("x", lib1.plotVars.plotWidth - lib1.plotVars.plotMargin + 3)
            .attr("y", y)
            .attr("font-size", 15)
            .attr("class", "search-term-label")
            .text(term);

    } else {
        // error message
    }
}

function createSearchable(){
    
    let textarea = d3.select(".searchDiv").append("textarea").attr("id", "TermSearchBox");
    let button = d3.select(".searchDiv").append("button").attr("id", "TimeSearchButton").text("Search!");

    button.on("click", function(d) {
        var searchTerm = textarea.property("value")
        searchForTerm(searchTerm);
    })
    
    textarea.on("click", )
}

const createPlot = async (params) => {
    
    [rawData, topGroupedData, allTermData] = await lib1.getData();

    // Visualization #1
    mySvg = d3.select(".searchDiv").append("svg");
    lib1.createPlot(rawData, topGroupedData, mySvg);
}


main();