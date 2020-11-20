'use strict';

import * as v1 from './Visualization_1.js'
import * as v2 from './Visualization_2.js'
import * as v3 from './Visualization_3.js'
import * as lib1 from './lib/lib1.js'

const createExplainer = async (params) => {
    
    //let [rawData, groupedData] = await lib.getData();

    // Add text, title, and descriptions

    // Visualization #1
    //let svg1 = d3.select("body").append("svg");
    // v1.createVisualization();

    let [rawData, topGroupedData] = await lib1.getData();

    // Visualization #1
    let svg = d3.select("body").append("svg");
    console.log(svg);
    lib1.createPlot(rawData, topGroupedData, svg);

    return svg;

    // Visualization #2
    //let svg2 = d3.select("body").append("svg");
    // v2.createVisualization();

    // Visualization #3
    //let svg3 = d3.select("body").append("svg");
    // v3.createVisualization();
}

createExplainer();