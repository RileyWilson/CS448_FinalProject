'use strict';
import * as lib2 from './lib/lib2.js'

var rawData, topGroupedData, allTermData;
var searchTerms, groupedSearchData;
var parseTime = d3.timeParse("%Y-%m-%d"); // can i export this from lib1
var height = 800;
var width = 1200;
var margin = 100;
var dataIndex = 1;

const main = async(params) => {
    displayTitle();
    createPlot(dataIndex);
    addButtons();
}

function addButtons(){

    
    d3.select(".bubble-button-div").append('div').attr("class", "bubble-buttons");

    let buttonsDiv = d3.select(".bubble-buttons");
    
    buttonsDiv.append('p').text("Choose your data, bitch.");

    let buttonsForm = buttonsDiv.append('form');
    
    buttonsForm.attr("id", "form").attr("class", "bubble-button-group").attr("data-toggle", "buttons");
    
    let buttonLabel1 = buttonsForm.append("label");
    let buttonLabel2 = buttonsForm.append("label");
    let buttonLabel3 = buttonsForm.append("label");
    buttonLabel1.attr("class", "bubble-button-label").attr("id", "bubble-button-label-1").text("1-Word Phrases");
    buttonLabel2.attr("class", "bubble-button-label").attr("id", "bubble-button-label-2").text("2-Word Phrases");
    buttonLabel3.attr("class", "bubble-button-label").attr("id", "bubble-button-label-3").text("3-Word Phrases");

    let button1 = buttonLabel1.append("input");
    let button2 = buttonLabel2.append("input");
    let button3 = buttonLabel3.append("input");

    button1.attr("type", "radio").attr("value", "b1").attr("name", "bubble-button");
    button2.attr("type", "radio").attr("value", "b2").attr("name", "bubble-button").attr("checked", "true");
    button3.attr("type", "radio").attr("value", "b3").attr("name", "bubble-button");

    buttonLabel1.append("br");
    buttonLabel2.append("br");
    buttonLabel3.append("br");

    // Add listener

    const buttons = d3.selectAll('input');
    buttons.on('change', function(d) {
        console.log('button changed to ' + this.value);
        d3.select(".bubble-svg").remove();
        if (this.value == "b1"){
            dataIndex = 0;
        } else if (this.value == "b2"){
            dataIndex = 1;
        } else {
            dataIndex = 3;
        }
        createPlot(dataIndex);
    });
}

function displayTitle(){
        
    var titleSvg = d3.select(".bubble-button-div").append("svg");
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
    
    var svg = d3.select(".bubble-div").append("svg");
    svg.attr('width', width)
    .attr('height', height)
    .attr('class', "bubble-svg")
    
    lib2.getData().then((value) => {
        //console.log("terms: " + JSON.stringify(value.terms));
        var data;
        if (dataIndex == 0){
            data = value.terms;
        } else if (dataIndex == 1){
            data = value.bigrams;
        } else {
            data = value.trigrams;
        }

        const root = pack(data);

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
            .attr("font-size", d => d.r > 40 ? "12px" : "6px")
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