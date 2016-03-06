
var displayPieCharts = function(){
  displayPieChart("pie-chart-7", 7);
  displayPieChart("pie-chart-14", 14);
  displayPieChart("pie-chart-30", 30);
}

var displayPieChart = function(pieChart, timeframe){
  $.ajax({
    method: 'get',
    url: '/sum',
    data: { 'timeframe': timeframe },
    dataType: 'json'
  }).done(function(data){
    var dataHash = calculateDataSums(data);

    var pieChartData = [
    {
      "label": "Expenses",
      "value": dataHash["expenseDataHash"].values.pop()[1]
    },
    {
      "label": "Profits",
      "value": dataHash["profitDataHash"].values.pop()[1]
    }
    ]

    nv.addGraph(function() {
      var chart = nv.models.pieChart()
          .x(function(d) { return d.label })
          .y(function(d) { return d.value })
          .showLabels(true)     //Display pie labels
          .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
          .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
          .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
          .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
          ;

      d3.select("#" + pieChart + " svg")
        .datum(pieChartData)
        .transition().duration(350)
        .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });
  });
}
