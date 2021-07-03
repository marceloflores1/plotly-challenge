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
        var slicedOutLabels = sampleData.otu_labels.slice(0,10);

        // Trace1 
        var trace1 = {
        x: slicedSampleValues,
        y: slicedOtuIds,
        text: slicedOutLabels,
        name: "Sample ID",
        type: "bar",
        orientation: "h"
        };
        var chartData = [trace1];

        var layout = {
        title: "Top 10 Bacteria Cultures Found",
        };

        Plotly.newPlot("bar", chartData, layout);
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

// THIS WILL BE MY FUNCTION TO CHANGE THE NAME OF THE WEIRD ; LIST OF VALUES
//   function renameSplit(list) {
//     newlist []  
//     list.forEach(item => {
//         newlist.append()
//     })
//   };