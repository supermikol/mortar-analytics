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


$.ajax({
  method: 'get',
  url: '/stacked_chart',
  dataType: 'json'
}).done(function(data){
  console.log(data);
  var revenueData = data[0];
  var expenseData = data[1];

  var profitDataHash = {
    "key": "Profits",
    "values": []
  }

  for (var i = 0; i < data[0].length; i++) {

  }
  console.log(profitDataHash);

})
// var new_json_data = []

// for (var i = 0; i < json_data.length; i++) {
//   var new_data = json_data[0];
//   for
// }




$(document).ready(function(){

  // navBarListener();
  historyModalListener();
  historyListener();

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
      .datum(json_data)
      .call(chart);

      nv.utils.windowResize(chart.update);

      chart.legend.margin({top: 20, bottom: 20})

      return chart;
    });

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
  $('#historyTable').tablesorter();
  $('.nav-pills').on('click', 'a', function(e){
    // e.preventDefault();
    var tag = $(this).attr('href');
    $.ajax({
      method: 'get',
      url: '/history/index',
      data: { "type": tag }
    }).done(function(response){
      $('#history-table-container').html(response);
      $('#historyTable').tablesorter();
      $(e.target).parent().siblings().removeClass("active");
      $(e.target).parent().addClass("active");
    })

  })

};

