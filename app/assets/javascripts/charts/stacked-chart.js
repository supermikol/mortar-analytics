
var selectTimeframeListener = function(){
  $('.dashhead-toolbar-item').on('click', 'button', selectStackedChartDates);
}

var displayInitialCharts = function(){
  displayPieCharts();
  $.ajax({
    method: 'get',
    url: '/sum',
    data: { 'timeframe': 7 },
    dataType: 'json'
  }).done(function(data){
    displayStackedChart(data);
  });
}

var selectStackedChartDates = function(e){
  $('.dashhead-toolbar-item button').removeClass('active');
  var timeframe = $(this).attr('id').match(/\d+/)[0];

  $.ajax({
    method: 'get',
    url: '/sum',
    data: { 'timeframe': timeframe },
    dataType: 'json'
  }).done(function(data){
    displayStackedChart(data);
    $(e.target).addClass('active');
  });

}


var displayStackedChart = function(data){
  var stackedChartData;
  if(!!!data[0][0] || !!!data[1][0]) {
    stackedChartData = []
  } else {
    var dataHash = calculateDataSums(data);
    stackedChartData = [dataHash["expenseDataHash"], dataHash["profitDataHash"]];
  }

  // d3.selectAll("svg > *").remove();

  // Display stacked area chart
  nv.addGraph(function() {
    var chart = nv.models.stackedAreaChart()
      .margin({right: 100})
        .x(function(d) { return d[0] })   //We can modify the data accessor functions...
        .y(function(d) { return d[1] })   //...in case your data is formatted differently.
        .useInteractiveGuideline(true)    //Tooltips which show all data points. Very nice!
        .rightAlignYAxis(true)      //Let's move the y-axis to the right side.
        .showControls(true)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
        .clipEdge(true);

    //Format x-axis labels with custom function.
    chart.xAxis
    .tickFormat(function(d) {
      return d3.time.format.utc('%x')(new Date(d))
    });

    chart.yAxis
    .tickFormat(d3.format(',.2f'));

    d3.select('#chart svg')
    .datum(stackedChartData)
    .call(chart);

    nv.utils.windowResize(chart.update);

    chart.legend.margin({top: 20, bottom: 20})

    return chart;
  });
}
