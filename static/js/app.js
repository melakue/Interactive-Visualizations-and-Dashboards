function buildMetadata(sample) {
    d3.json(`/metadata/${sample}`).then((data) => {
      // Use d3 to select the panel with id of `#sample-metadata`
      var tbody = d3.select("#sample-metadata");
  
      tbody.html("");
        Object.entries(data).forEach(([key, value]) => {
        tbody.append("h5").text(`${key}: ${value}`);
      });
  
      });
  }
  
  function buildCharts(sample) {
    d3.json(`/samples/${sample}`).then((data) => {
    const ids = data.otu_ids;
    const labels = data.otu_labels;
    const values = data.sample_values;
      console.log(data)
  
      // Build a Bubble Chart
      var bubbleLayout = {
        margin: { t: 0 },
        // hovermode: "closest",
        xaxis: { title: "OTU ID" }
      };
      var bubbleData = [
        {
          x: ids,
          y: values,
          text: labels,
          mode: "markers",
          marker: {
            size: values,
            color: ids,
            colorscale: "Earth"
          }
        }
      ];
  
      Plotly.plot("bubble", bubbleData, bubbleLayout);
  
      
      var pieData = [
        {
          values: values.slice(0, 10),
          labels: ids.slice(0, 10),
          hovertext: labels.slice(0, 10),
          hoverinfo: "hovertext",
          type: "pie"
        }
      ];
  
      var pieLayout = {
        margin: { t: 0, l: 0 }
      };
  
      Plotly.plot("pie", pieData, pieLayout);
    });
  }
  
  
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();
  
  