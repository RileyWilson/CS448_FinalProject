'use strict';
import * as lib2 from './lib/lib2.js'

var rawData, topGroupedData, allTermData;
var searchTerms, groupedSearchData;
var parseTime = d3.timeParse("%Y-%m-%d"); // can i export this from lib1
var height = 800;
var width = 1200;
var margin = 100
//var terms;
//var bigrams;
//var trigrams;

const main = async(params) => {
    displayTitle();
    createPlot();
    addButtons();
}

function addButtons(){

    d3.select(".bubbleDiv").append('div').attr("class", "bubble-buttons");

    let buttonsDiv = d3.select(".bubble-buttons");
    
    buttonsDiv.append('p').text("Choose your data, bitch.");

    let buttonsForm = buttonsDiv.append('form');
    
    buttonsForm.attr("id", "form").attr("class", "bubble-button-group").attr("data-toggle", "buttons");

    



    <div class="bubbleButtons">
    <br><br>
    <p class="instructions">Choose your data:</p>
    <form id="form" class="bubble-buton-group" data-toggle="buttons">
      <label class="bubble-button-label" id="bubble-button-label-1">
        <input type="radio" id="1-word-button" value="MRR" checked>1-WORD TERMS<br>
      </label>
      <label class="bubble-button-label" id="bubble-button-label-2">
        <input type="radio" id="2-word-button" value="LYL">2-WORD PHRASES<br>
      </label>
      <label class="bubble-button-label" id="bubble-button-label-3">
        <input type="radio" id="2-word-button" value="LYL">3-WORD PHRASES<br>
      </label>
    </form></div>
}

function displayTitle(){
        
    var titleSvg = d3.select(".bubbleDiv").append("svg");
    titleSvg.attr('width', width)
    .attr('height', 50)

    // Add title info to graphic
    titleSvg.append("text")
    .attr("fill", "#231F20")
    .attr("font-size", "28")
    .text("Top Tweeted COVID-Related N-Grams Since March 2020")    
    .attr('transform',
    'translate(' + ((width/2)) + ' ,' + 
                    (40) + ')')
    .attr('text-align', 'right')
    .attr('word-wrap', 'normal')
    .attr("text-decoration", "underline")
    .attr('background-color', "white")
    .style('text-anchor', 'middle');
}

function pack(data){
    let root = {children: data};
    console.log("root here: " + JSON.stringify(root));
    let hierarchy = d3.hierarchy(root)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    let packer = d3.pack()
        .size([width, height])
        .padding(2)

    return packer(hierarchy);
}

const createPlot = async (params) => {
    
    var svg = d3.select(".bubbleDiv").append("svg");
    svg.attr('width', width)
    .attr('height', height)
    
    lib2.getData().then((value) => {
        //console.log("terms: " + JSON.stringify(value.terms));

        const root = pack(value.terms);

        console.log("root leaves: " + root.leaves());
    
        const leaf = svg.selectAll("g")
            .data(root.leaves())
            .enter().append("g")
            .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

        leaf.append("circle")
            .attr("r", d => d.r)
            .attr("fill", "#EFE6DD");
        
        leaf.append("text")
            .text(d => d.data.term)
            .style('text-anchor', 'middle')
            .attr("fill", "#231F20")
            .attr("fill-opacity", 1);

        leaf.append("text")
            .text(d => d.data.value)
            .style('text-anchor', 'middle')
            .attr("fill", "#BB4430")
            .attr("y", "12px")
            .attr("font-size", "10px")
            .attr("fill-opacity", 0.8);

        return svg.node();
    });
}


main();