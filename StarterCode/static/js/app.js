var dropdownSel = d3.select("#selDataset");
var demographicSel = d3.select("#sample-metadata")

d3.json("samples.json").then((importedData) => {
    // console.log(importedData);
    var data = importedData;
  
    // Sort the data array using the greekSearchResults value
    var sampleData = data.samples[0];
    
    // data.sort(function(a, b) {
    //   return parseFloat(b.greekSearchResults) - parseFloat(a.greekSearchResults);
    // });
    
    var dropItems = importedData.names.map((row) => parseInt(row));
    dropdownNames(dropItems);

    var metadataSel = dropdownSel.property("value");
    var allMetadata = importedData.metadata
    console.log(metadataSel);
    console.log(allMetadata);
    demographicInfo(allMetadata, metadataSel);

    // Slice the first 10 objects for plotting
    var slicedSampleValues = sampleData.sample_values.slice(0, 10);
    var slicedOtuIds = sampleData.otu_ids.slice(0,10);
    var slicedOutLabels = sampleData.otu_labels.slice(0,10);
    
    // Reverse the array due to Plotly's defaults
  
    // Trace1 for the Greek Data
    var trace1 = {
      x: slicedSampleValues,
      y: slicedOutLabels,
      text: slicedOtuIds,
      name: "Sample ID",
      type: "bar",
      orientation: "h"
    };
  
    // data
    var chartData = [trace1];
  
    // Apply the group bar mode to the layout
    var layout = {
      title: "Samples",
      
    };
  
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", chartData, layout);
  });

  // Function to add dropdown items
  function dropdownNames (dropItems) {
    dropItems.forEach((name) => {
        dropdownSel.append('option').text(name);
    })
  };

  function demographicInfo (allMetadata, metadataSel) {
    demographicSel.html("");
    allMetadata.forEach(row => {
        if(row.id === parseInt(metadataSel)) {
            for(var [key,value] of Object.entries(row)) {
                var upperKey = key.toUpperCase();
                demographicSel.append('p').text(`${upperKey}: ${value}`);
            }
        }
    })
  };