'use strict';
import * as lib3 from './lib/lib3.js'

var width = 1400;
var tweetData;

const main = async(params) => {
    displayTitle();
    createPlot();
}

function displayTitle(){
    var titleSvg = d3.select(".bubble-button-div").append("svg");
    titleSvg.attr('width', width)
    .attr('height', 50)
}

const createPlot = async (params) => {
    
    [tweetData] = await lib3.getData();

}

main();