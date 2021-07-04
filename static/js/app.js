var dropdownSel = d3.select("#selDataset");
var demographicSel = d3.select("#sample-metadata")

// Loading dropdown items
d3.json("samples.json").then((importedData) => {   
    
    var dropItems = importedData.names.map((row) => parseInt(row));
    dropItems.forEach((name) => {
        dropdownSel.append('option').text(name).property("value", name);
    });
    demographicSel.html("Please select a Test Subject ID");
});

// Function executed when changing dropdown item
function optionChanged(inputID) {

    d3.json("samples.json").then((importedData) => {
                
        // Demographic Info
        var allMetadata = importedData.metadata;
        demographicSel.html("");
        allMetadata.forEach(row => {
            if(row.id === parseInt(inputID)) {
                for(var [key,value] of Object.entries(row)) {
                    var upperKey = key.toUpperCase();
                    demographicSel.append('p').text(`${upperKey}: ${value}`);
                }
            }
        });

        // Variables used to plot
        var sampleData = importedData.samples.find((sample) => sample.id === inputID);
        var sampleValues = sampleData.sample_values
        var otuIds = sampleData.otu_ids
        var otuLabels = renameSplit(sampleData.otu_labels) 
        var slicedSampleValues = sampleValues.slice(0, 10).reverse();
        var slicedOtuIds = otuIds.slice(0,10).map((row) => `OTU ${String(row)}`).reverse();
        var slicedOtuLabels = otuLabels.slice(0,10);
        var sampleMetadata = importedData.metadata.find((metadata) => metadata.id === parseInt(inputID));
        var washFreq = sampleMetadata.wfreq;

        // Bar Chart 
        var trace1 = {
        x: slicedSampleValues,
        y: slicedOtuIds,
        text: slicedOtuLabels,
        name: "Sample ID",
        type: "bar",
        orientation: "h"
        };
        var barData = [trace1];

        var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        };

        Plotly.newPlot("bar", barData, barLayout);

        // Bubble Chart
        var trace2 = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: [
                    [0, 'rgb(0,180,255)'],
                    [0.5, 'rgb(0,255,50)'],
                    [1, 'rgb(255,50,0)']
                ]
            }
        };

        var bubbleData = [trace2];

        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        // Gauge Chart
        var trace3 = {
           type: 'indicator',
           mode: 'gauge+number',
           value: washFreq,
           title: "Scrubs per Week",
           gauge: {
                axis: {
                    range: [0,9], 
                    dtick: 1
                }, 
                bar: {color: 'darkblue'},
                threshold: {
                    line: {
                        color:'red',
                        width: 6
                    },
                    thickness: 0.8,
                    value: washFreq
                },
                steps: [
                    {range:[0,1], color:'rgb(150,255,200)'},
                    {range:[1,2], color:'rgb(125,255,180)'},
                    {range:[2,3], color:'rgb(100,255,160)'},
                    {range:[3,4], color:'rgb(75,255,140)'},
                    {range:[4,5], color:'rgb(50,255,120)'},
                    {range:[5,6], color:'rgb(25,255,100)'},
                    {range:[6,7], color:'rgb(0,255,80)'},
                    {range:[7,8], color:'rgb(0,255,60)'},
                    {range:[8,9], color:'rgb(0,255,40)'}
                ]
            }
        };

        var gaugeData = [trace3];

        var gaugeLayout = {
            title: "Belly Button Washing Frequency"
        };

        Plotly.newPlot("gauge", gaugeData, gaugeLayout);

    })
};

function renameSplit(list) {
var newlist = [];
list.forEach(item => newlist.push(item.replaceAll(";", ", ")))
return newlist;
};