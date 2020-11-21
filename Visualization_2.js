'use strict';
import * as lib2 from './lib/lib2.js'

var rawData, topGroupedData, allTermData;
var searchTerms, groupedSearchData;
var parseTime = d3.timeParse("%Y-%m-%d"); // can i export this from lib1
var height = 700;
var width = 1400;
var margin = 100;
var gramN = 2;

const main = async(params) => {
    displayTitle();
    createPlot(gramN);
    addButtons();
    addInteraction();
    addVisualizationSection();
}

function addVisualizationSection(){

    
}

function addInteraction() {
    d3.selectAll('bubble')

    .on('mouseover', function (d, i) {
        d3.select(this).transition()
             .duration('50')
             .attr("fill", '#F3DFA2');
    })
   .on('mouseout', function (d, i) {
        d3.select(this).transition()
             .duration('50')
             .attr("fill", "#EFE6DD");
   });
}

function addButtons(){

    
    d3.select(".bubble-button-div").append('div').attr("class", "bubble-buttons");

    let buttonsDiv = d3.select(".bubble-buttons");
    
    buttonsDiv.append('p').text("Choose your n-grams.");

    let buttonsForm = buttonsDiv.append('form');
    
    buttonsForm.attr("id", "form").attr("class", "bubble-button-group").attr("data-toggle", "buttons");
    
    let buttonLabel1 = buttonsForm.append("label");
    let buttonLabel2 = buttonsForm.append("label");
    let buttonLabel3 = buttonsForm.append("label");
    buttonLabel1.attr("class", "bubble-button-label").attr("id", "bubble-button-label-1").text("1 Word");
    buttonLabel2.attr("class", "bubble-button-label").attr("id", "bubble-button-label-2").text("2 Words");
    buttonLabel3.attr("class", "bubble-button-label").attr("id", "bubble-button-label-3").text("3 Words");

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
        d3.select(".bubble-svg").remove();
        if (this.value == "b1"){
            gramN = 1;
        } else if (this.value == "b2"){
            gramN = 2;
        } else {
            gramN = 3;
        }
        createPlot(gramN);
    });
}

function displayTitle(){
        
    var titleSvg = d3.select(".bubble-button-div").append("svg");
    titleSvg.attr('width', width)
    .attr('height', 50)

    // Add title info to graphic
    /*
    titleSvg.append("text")
    .attr("fill", "#231F20")
    .attr("font-size", "28")
    .text("Top Tweeted COVID-Related N-Grams Since March 2020")    
    .attr('transform',
    'translate(' + ((width/2)) + ' ,' + 
                    (1) + ')')
    .attr('text-align', 'right')
    .attr('word-wrap', 'normal')
    .attr("text-decoration", "underline")
    .style('text-anchor', 'middle');
    */
}

function pack(data){
    let root = {children: data};
    let hierarchy = d3.hierarchy(root)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    let packer = d3.pack()
        .size([900, height])
        .padding(2)

    return packer(hierarchy);
}

function createTooltip(/*svg*/){
    
    /*
    var instructions = svg.append("text")
     .attr("class", "tooltip-instructions")
     .attr("width", "400px")
     .attr("height", "300px")
     .attr("text-align", "center")
     .attr("x", 0)
     .attr("y", 0)
     .attr("word-wrap", "normal")
     .text("Hover over a bubble to see a real tweet featuring that N-gram")
     .attr("font-size", "14px")
     .style("opacity", 1);

    
    var tooltip = svg.append("rect")
     .attr("class", "bubble-tooltip")
     .attr("width", "400px")
     .attr("height", "300px")
     .attr("x", 900)
     .attr("y", 200)
     .attr("fill", "#F3DFA2")
     .style("opacity", 0);
    */
    // Add text display for tweet
    var content = d3.select(".bubble-tooltip-content")
        .attr("class", "bubble-tooltip-content")
        .attr("width", "400px")
        .attr("height", "300px")
        .attr("word-wrap", "normal")
        .attr("text-align", "center")
        .attr("x", 100)
        .attr("y", 800)
        .attr("opacity", 1)
        .text("Hover over a bubble to see a real tweet featuring that N-gram");

     return [/*tooltip, instructions, */content];
}

const createPlot = async (params) => {
    
    var svg = d3.select(".bubble-sub-div").append("svg");
    svg.attr('width', 900)
    .attr('height', height)
    .attr('class', "bubble-svg")
    
    var [/*tooltip, instructions, */content] = createTooltip(/*d3.select(".tweet-div")*/)


    lib2.getData().then((value) => {
        var data;
        if (gramN == 1){
            data = value.terms;
        } else if (gramN == 2){
            data = value.bigrams;
        } else {
            data = value.trigrams;
        }

        const root = pack(data);
    
        const leaf = svg.selectAll("g")
            .data(root.leaves())
            .enter().append("g")
            .attr("class", "bubble")
            .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)
            .attr("value", d => d.data.term)
            .on('mouseover', (d, i) => {
                console.log("d is: " + JSON.stringify(i.data.term));
                tooltipOn(i.data.term,/* tooltip, instructions, */content);
            })
            .on('mouseout', function (d, i) {
                tooltipOff(i.data.term,/* tooltip, instructions, */content);
           });

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

function getTweet(term){
    //let term = d.term;
    //console.log("d: " + JSON.stringify(d));
    lib2.getTweetData(term, gramN).then( (tweet) =>{
        //console.log("tweet here: " + tweet);
        return tweet;
    });

    //console.log("had term: " + term);
    //console.log("so here: " + tweet);
}

function tooltipOn(term, /*tooltip, instructions, */content){
    d3.select(this).selectAll('circle').transition()
    .duration('50')
    .attr("fill", '#F3DFA2');
    /*
    tooltip.transition()
        .duration('60')
        .style("opacity", 1);

    instructions.transition()
        .duration('60')
        .style("opacity", 0);  */  
        
    content.transition()
        .duration('60')
        .style("opacity", 1);

    getTweet(term);
    
}

function tooltipOff(term, /*tooltip, instructions, */content){    
    d3.select(this).selectAll('circle').transition()
    .duration('60')
    .attr("fill", "#EFE6DD");
    /*
    tooltip.transition()
        .duration('60')
        .style("opacity", 0);
    
    instructions.transition()
        .duration('60')
        .style("opacity", 1);
    */
    content.transition()
        .duration('60')
        .style("opacity", 1)
        .text("Hover over a bubble to see a real tweet featuring that N-gram");
}

main();