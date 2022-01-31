function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// samples.json console reference
d3.json("samples.json").then(data => console.log(data));


// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    var metadata = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleFilter = samples.filter(sampleObj => sampleObj.id == sample);
    var metadataFilter = metadata.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var sampleFirst = sampleFilter[0];
    var metadataFirst = metadataFilter[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.

    var otuId = sampleFirst.otu_ids;
    var otuLabel = sampleFirst.otu_labels;
    var sampleValues = sampleFirst.sample_values;
    var gaugeFreq = metadataFirst.wfreq;
   
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var xticks = sampleValues.sort((a,b) => b-a).slice(0,10).reverse();
    var yticks = otuId.map(sampleOtu => "OTU "+ sampleOtu).slice(0,10).reverse();

    //----------------------------------------------------------------------------
    
    // Bar
    var trace = {
      x: xticks,
      y: yticks,
      text: otuLabel.slice(0,10),
      orientation: "h",
      type: "bar"
    };
    // 8. Create the trace for the bar chart. 
    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Number of Cultures"},
      yaxis: {title: "Sample ID"},
      paper_bgcolor: "rgba(1, 7, 24, 0.76);",
      font: {color: "white"}
    };
    var config = {responsive: true}
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar',barData,barLayout,config)

    // Bubble
    var trace1 = {
      x: otuId,
      y: sampleValues,
      text: otuLabel,
      mode: "markers",
      marker:{
        size: sampleValues,
        color: otuId,
        colorscale: 'Earth'
      }
    };
    var bubbleData = [
      trace1
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Cultures"},
      paper_bgcolor: "rgba(1, 7, 24, 0.76);",
      font: {color: "white"},
      height: 500
    };
    var config = {responsive: true}

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout,config); 
    
    // Gauge

    var gaugeData = [
     {
       type: "indicator",
       mode: "gauge+number",
       value: gaugeFreq,
       gauge: {
         axis: {range:[0,10]},
         bar: {color: "black"},
         steps:[
           {range: [0,2], color: "red"},
           {range: [2,4], color: "orange"},
           {range: [4,6], color: "yellow"},
           {range: [6,8], color: "lightgreen"},
           {range: [8,10], color: "green"}
         ]
       }
     }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
    width: 500,
    height:400,
    margin: {t:25, b:25},
    paper_bgcolor: "rgba(1, 7, 24, 0.76);",
    font: {color: "white"}
    };
    var config = {responsive: true}

    // 6. Use Plotly to plot the gauge data and layout.
    
    Plotly.newPlot("gauge",gaugeData, gaugeLayout,config);
  });
}
