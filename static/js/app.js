var dropdownSel = d3.select("#selDataset");
var demographicSel = d3.select("#sample-metadata")

d3.json("samples.json").then((importedData) => {   
    
    var dropItems = importedData.names.map((row) => parseInt(row));
    dropdownNames(dropItems); 
    demographicSel.html("Please select a Test Subject ID");
});

function optionChanged(inputID) {

    d3.json("samples.json").then((importedData) => {
        var allMetadata = importedData.metadata
        console.log(inputID);
        console.log(allMetadata);
        demographicInfo(allMetadata, inputID);

        var sampleData = importedData.samples.find((sample) => sample.id === inputID);
        var slicedSampleValues = sampleData.sample_values.slice(0, 10).reverse();
        var slicedOtuIds = sampleData.otu_ids.slice(0,10).map((row) => `OTU ${String(row)}`).reverse();
        var slicedOutLabels = renameSplit(sampleData.otu_labels.slice(0,10));

        // Bar Chart 
        var trace1 = {
        x: slicedSampleValues,
        y: slicedOtuIds,
        text: slicedOutLabels,
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
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            text: renameSplit(sampleData.otu_labels),
            mode: 'markers',
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids,
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
            xaxis: {title: "Operational Taxonomic Unit (OTU) ID"},
            yaxis: {title: "Sample Values"},
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        // // Gauge Chart
        // var trace3 = {
        //    
        // }
    })
};

  // Function to add dropdown items
  function dropdownNames (dropItems) {
    dropItems.forEach((name) => {
        dropdownSel.append('option').text(name).property("value", name);
    })
  };

  function demographicInfo (allMetadata, inputID) {
    demographicSel.html("");
    allMetadata.forEach(row => {
        if(row.id === parseInt(inputID)) {
            for(var [key,value] of Object.entries(row)) {
                var upperKey = key.toUpperCase();
                demographicSel.append('p').text(`${upperKey}: ${value}`);
            }
        } 
    })
  };

  function renameSplit(list) {
    var newlist = [];
    list.forEach(item => newlist.push(item.replaceAll(";", ", ")))
    return newlist;
  };