d3.json("samples.json").then((importedData) => {
    // console.log(importedData);
    var data = importedData;
  
    // Sort the data array using the greekSearchResults value
    sampleData = data.samples[0];
    
    // data.sort(function(a, b) {
    //   return parseFloat(b.greekSearchResults) - parseFloat(a.greekSearchResults);
    // });
  
    // Slice the first 10 objects for plotting
    slicedSampleValues = sampleData.sample_values.slice(0, 10);
    slicedOtuIds = sampleData.otu_ids.slice(0,10);
    slicedOutLabels = sampleData.otu_labels.slice(0,10);
  
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
  