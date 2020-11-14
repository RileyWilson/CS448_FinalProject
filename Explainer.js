'use strict';
import * as v1 from './Visualization_1'
import * as v2 from './Visualization_2'
import * as v3 from './Visualization_3'

const myFunction = async (params) => {
    
    let [rawData, groupedData] = await lib.getData();

    // Add text, title, and descriptions

    // Visualization #1
    let svg1 = d3.select("body").append("svg");
    v1.createVisualization(rawData, groupedData, svg1);

    // Visualization #2
    let svg2 = d3.select("body").append("svg");
    v2.createVisualization(rawData, groupedData, svg2);

    // Visualization #3
    let svg3 = d3.select("body").append("svg");
    v3.createVisualization(rawData, groupedData, svg3);
}

myFunction();