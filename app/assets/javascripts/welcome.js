;(function($){
  $.fn.datepicker.dates['zh-CN'] = {
      days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
      daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
      months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      today: "今天",
      suffix: [],
      meridiem: ["上午", "下午"]
  };
}(jQuery));

var json_data = [
{
  "key" : "Expenses" ,
  "values": [ [new Date("01/01/15").getTime(), 230.12], [new Date("01/02/15").getTime(), 192.97], [new Date("01/03/15").getTime(), 17.74], [new Date("01/04/15").getTime(), 81.95], [new Date("01/05/15").getTime(), 41.67], [new Date("01/06/15").getTime(), 142.51], [new Date("01/07/15").getTime(), 16.27], [new Date("01/08/15").getTime(), 45.34], [new Date("01/09/15").getTime(), 32.80] ]
},
{
  "key" : "Profits" ,
  "values" : [ [new Date("01/01/15").getTime(), 591.52], [new Date("01/02/15"), 249.78], [new Date("01/03/15").getTime(), 13.87], [new Date("01/04/15").getTime(), 199.56], [new Date("01/05/15").getTime(), 145.64], [new Date("01/06/15").getTime(), 207.12], [new Date("01/07/15").getTime(), 82.59], [new Date("01/08/15").getTime(), 132.31], [new Date("01/09/15").getTime(), 92.31] ]
}
]

var displayStackedChart = function(){
  $.ajax({
    method: 'get',
    url: '/stacked_chart',
    dataType: 'json'
  }).done(function(data){
    var revenueData = data[0];
    var expenseData = data[1];

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
    console.log(chart_data);

    d3.selectAll("svg > *").remove();

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


var beginDate;
var endDate;

$(document).ready(function(){

  datePickerListener();
  // navBarListener();
  historyModalListener();
  historyListener();
  displayStackedChart();


  date = new Date();
  $('#datepicker-begin').datepicker({
    format: "yyyy-mm-dd",
    autoclose: true,
    language: 'zh-CN',
    todayHighlight: true
  });
  $('#datepicker-end').datepicker({
    format: "yyyy-mm-dd",
    autoclose: true,
    language: 'zh-CN',
    todayHighlight: true
  });

  var today = new Date();
  var dateBegin = new Date(today.getTime()-1000*60*60*24*7);
  var dateEnd = today;
  $('#datepicker-end').datepicker('setDate', dateEnd);
  $('#datepicker-end').datepicker('update');

  // $('#datepicker-begin').datepicker('setDate', dateBegin);
  // $('#datepicker-begin').datepicker('update');

});

var navBarListener = function(){
  $('.iconav-nav').on('click', 'a', function(e){
    e.preventDefault();
    var url = $(e.target).attr('href');
    $.ajax({
      method: 'GET',
      url: url
    }).done(function(response){
      $('.container').html(response);
    })
  })
}

var historyModalListener = function(){
  // $('tbody').on('click', 'a', function(e){
    // e.preventDefault();

    $('#myModal').on('show.bs.modal', function(event){
      var link = $(event.relatedTarget);
      var img_name = link.data('invoice');

      var modal = $(this);
      modal.find('.modal-body').html("<img class=\"img-responsive\" src=\"/images/" + img_name + "\" >");
    })

  // })
};



var historyListener = function(){
  $('#historyTable').tablesorter({sortList: [[2,1]] });
  $('.nav-pills').on('click', 'a', function(e){
    // e.preventDefault();
    var tag = $(this).attr('href');
    $.ajax({
      method: 'get',
      url: '/history/index',
      data: { "type": tag, "begin_date": beginDate, "end_date": endDate }
    }).done(function(response){
      $('#history-table-container').html(response);
      $('#historyTable').tablesorter({sortList: [[2,1]] });
      $(e.target).parent().siblings().removeClass("active");
      $(e.target).parent().addClass("active");
    })

  })

};


var datePickerListener = function(){
 $('#submit-datepicker').on('click',function(e){
  if ($("#datepicker-end").val() >= $("#datepicker-begin").val()) {
    console.log(beginDate);
    console.log(endDate);
    beginDate = $("#datepicker-begin").val();
    endDate = $("#datepicker-end").val();
    $.ajax({
      method: 'get',
      url: '/history/index',
      data: { "begin_date": beginDate, "end_date": endDate }
    }).done(function(response){
      $('#history-table-container').html(response);
      $('#historyTable').tablesorter({sortList: [[2,1]] });
      $('.table-tabs').children().removeClass("active");
      $('#all-tab').addClass("active");
    })

  } else {
    alert("结束日期必须要设得比开始日期晚");
  }
 })
}
