'use strict';
import * as lib2 from './lib/lib2.js'

const main = async(params) => {
    lib2.createPlot();
    lib2.addButtons();
    lib2.addInteraction();
    lib2.displayTitle();
}
/*
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

   // Add slider
   lib2.addSlider();
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
}*/
/*
function displayTitle(){
    var titleSvg = d3.select(".bubble-button-div").append("svg");
    titleSvg.attr('width', width)
    .attr('height', 50)
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

function createTooltip(){
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

     return [content];
}
*/

/*
const createPlot = async (params) => {
    
    var svg = d3.select(".bubble-sub-div").append("svg");
    svg.attr('width', 900)
    .attr('height', height)
    .attr('class', "bubble-svg")
    
    var [content] = createTooltip()

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
                tooltipOn(i.data.term, content);
            })
            .on('mouseout', function (d, i) {
                tooltipOff(i.data.term, content);
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


const redrawBubbles = async (params) => {
    
    d3.select(".bubble-sub-div").remove();
    createPlot();
}


function tooltipOff(term, content){    
    d3.select(this).selectAll('circle').transition()
    .duration('60')
    .attr("fill", "#EFE6DD");

    content.transition()
        .duration('60')
        .style("opacity", 1)
        .text("Hover over a bubble to see a real tweet featuring that N-gram");
}
*/

main();