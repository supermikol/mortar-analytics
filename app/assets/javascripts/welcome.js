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

var beginDate;
var endDate;


$(document).ready(function(){
  navBarListener();
  initializeDatepicker();
  datePickerListener();
  historyModalListener();
  historyListener();
  displayInitialChart();
  addEntryListener();
});

var navBarListener = function(){
  $('a.navbar-icons').on('click', function(e){
    e.preventDefault();
    var url = $(e.target).attr('href');
    $.ajax({
      method: 'GET',
      url: url
    }).done(function(response){
        $('.container').html(response);
      initializeDatepicker();
      datePickerListener();
      historyModalListener();
      historyListener();
      displayStackedChart();
      addEntryListener();
    })
    $(this).parent().addClass("active");
    $(this).parent().siblings().removeClass("active");
  })
}


var initializeDatepicker = function(){
  var date = new Date();
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
  $('#datepicker-end').datepicker('setDate', new Date());
  $('#datepicker-end').datepicker('update');
}



var historyModalListener = function(){
  $('#myModal').on('show.bs.modal', function(event){
    var link = $(event.relatedTarget);
    var img_name = link.data('invoice');

    var modal = $(this);
    modal.find('.modal-body').html("<img class=\"img-responsive\" src=\"/images/" + img_name + "\" >");
  })
};


var historyListener = function(){
  $('#historyTable').tablesorter({sortList: [[1,1]] });
  $('.table-tabs').on('click', 'a', function(e){
    // e.preventDefault();
    var tag = $(this).attr('href');
    $.ajax({
      method: 'get',
      url: '/history/index',
      data: { "type": tag, "begin_date": beginDate, "end_date": endDate }
    }).done(function(response){
      $('#history-table-container').html(response);
      $('#historyTable').tablesorter({sortList: [[1,1]] });
      $(e.target).parent().siblings().removeClass("active");
      $(e.target).parent().addClass("active");
    })

  })

};


var datePickerListener = function(){
 $('#submit-datepicker').on('click',function(e){
  if ($("#datepicker-end").val() >= $("#datepicker-begin").val()) {
    beginDate = $("#datepicker-begin").val();
    endDate = $("#datepicker-end").val();
    $.ajax({
      method: 'get',
      url: '/history/index',
      data: { "begin_date": beginDate, "end_date": endDate, "type": "datepicker" }
    }).done(function(response){
      $('#history-table-container').html(response);
      $('#historyTable').tablesorter({sortList: [[1,1]] });
      $('.table-tabs').children().removeClass("active");
      $('#all-tab').addClass("active");
    })

  } else {
    alert("结束日期必须要设得比开始日期晚");
  }
 })
}

var addEntryListener = function(){

  $('#add-entry').on('click', function(event){
    $.ajax({
      method: 'GET',
      url: '/transaction/add'
    }).done(function(response){
      $('#addEntryModal').find('.modal-body').html(response);
        $('#formEntryDate').datepicker({
          format: "yyyy-mm-dd",
          autoclose: true,
          language: 'zh-CN',
          todayHighlight: true
        });
        submitFormListener();
    });

  });

}

var submitFormListener = function(){
  $('form').on('submit', function(e){
    e.preventDefault();
    var formData = $('form').serialize();
    $.ajax({
      method: 'POST',
      url: "/transaction/add",
      data: formData
    }).done(function(response){
      console.log(response);

    });
  });
}
