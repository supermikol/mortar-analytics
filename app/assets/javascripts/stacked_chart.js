
var displayStackedChart = function(){
  $.ajax({
    method: 'get',
    url: '/sum',
    data: { 'timeframe': 7 },
    dataType: 'json'
  }).done(function(data){
    var revenueData = data[0];
    var expenseData = data[1];
    console.log(revenueData);
    console.log(expenseData);

    console.log(revenueData[0].date);
    console.log(new Date(revenueData[0].date).getTime());
    console.log(new Date(new Date(revenueData[0].date).getTime()));
    console.log(d3.time.format('%x')(new Date(1456646400000)));


    var profitDataHash = {
      "key": "Profits",
      "values": []
    }

    var expenseDataHash = {
      "key": "Expenses",
      "values": []
    }

    var revenueDataHash = {
      "key": "Revenues",
      "values": []
    }

    var TIME_TO_NEXT_DAY = 86400000;

    // Expenses Sum
    for (var i = 0; i < expenseData.length; i++) {
      if (i === 0 ) {
        expenseDataHash.values.push([new Date(expenseData[0].date).getTime(), expenseData[0].sum]);
      } else {
        var previousDate = expenseDataHash.values[expenseDataHash.values.length - 1][0]
        var nextDataDate = new Date(expenseData[i].date).getTime();

        while ((previousDate += TIME_TO_NEXT_DAY) !== nextDataDate) {
          expenseDataHash.values.push([previousDate, expenseDataHash.values[i-1][1]]);
        }

        expenseDataHash.values.push([nextDataDate, expenseDataHash.values[expenseDataHash.values.length - 1][1] + expenseData[i].sum])
      }
    }

    // Revenues Sum
    for (var i = 0; i < revenueData.length; i++) {
      if (i === 0 ) {
        revenueDataHash.values.push([new Date(revenueData[0].date).getTime(), revenueData[0].sum]);
      } else {
        var previousDate = revenueDataHash.values[revenueDataHash.values.length - 1][0]
        var nextDataDate = new Date(revenueData[i].date).getTime();

        while ((previousDate += TIME_TO_NEXT_DAY) !== nextDataDate) {
          revenueDataHash.values.push([previousDate, revenueDataHash.values[revenueDataHash.values.length - 1][1]]);
        }

        revenueDataHash.values.push([nextDataDate, revenueDataHash.values[revenueDataHash.values.length - 1][1] + revenueData[i].sum])
      }
    }

    // Filling in missing date ends for revenue and expenses
    var firstRevenueDate = revenueDataHash.values[0][0];
    var firstExpenseDate = expenseDataHash.values[0][0];
    var lastRevenueDate = revenueDataHash.values[revenueDataHash.values.length - 1][0];
    var lastExpenseDate = expenseDataHash.values[expenseDataHash.values.length - 1][0];

    // Set missing end dates
    if (lastRevenueDate > lastExpenseDate) {
      while (lastRevenueDate > lastExpenseDate) {
        expenseDataHash.values.push([lastExpenseDate += TIME_TO_NEXT_DAY, expenseDataHash.values[expenseDataHash.values.length - 1][1]]);
      }
    } else if (lastExpenseDate > lastRevenueDate) {
      while (lastExpenseDate > lastRevenueDate) {
        revenueDataHash.values.push([lastRevenueDate += TIME_TO_NEXT_DAY, revenueDataHash.values[revenueDataHash.values.length - 1][1]]);
      }
    }

    // Set missing date starts with values of 0
    if (firstRevenueDate < firstExpenseDate) {
      while (firstRevenueDate < firstExpenseDate) {
        expenseDataHash.values.unshift([firstExpenseDate -= TIME_TO_NEXT_DAY, 0]);
      }
    } else if (firstExpenseDate < firstRevenueDate) {
      while (firstExpenseDate < firstRevenueDate) {
        revenueDataHash.values.unshift([firstRevenueDate -= TIME_TO_NEXT_DAY, 0]);
      }
    }

    // Calculate sum of profits per day
    for (var i = 0; i < revenueDataHash.values.length; i++) {
      profitDataHash.values.push([revenueDataHash.values[i][0], revenueDataHash.values[i][1] - expenseDataHash.values[i][1]])
    }

    var chart_data = [expenseDataHash, profitDataHash];

    d3.selectAll("svg > *").remove();

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
          return d3.time.format('%x')(new Date(d))
        });

      chart.yAxis
      .tickFormat(d3.format(',.2f'));

      d3.select('#chart svg')
      .datum(chart_data)
      .call(chart);

      nv.utils.windowResize(chart.update);

      chart.legend.margin({top: 20, bottom: 20})

      return chart;
    });
  })
}
