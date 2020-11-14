'use strict';
import * as lib from './lib/lib.js'

const myFunction = async (params) => {
    
    let [rawData, groupedData] = await lib.getData();

    // Visualization #3
    let svg = d3.select("body").append("svg");
    lib.createPlot(rawData, groupedData, svg);
}

myFunction();