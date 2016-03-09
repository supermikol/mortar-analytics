(function($){
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

var beginDate;
var endDate;

$(document).ready(function(){
  displayInitialCharts();
  initializeDatepicker();
  bindListeners();

});

var bindListeners = function(){
  // navBarListener();
  datePickerListener();
  historyModalListener();
  historyListener();
  addEntryListener();
  selectTimeframeListener();
}

// var navBarListener = function(){
//   $('a.navbar-icons').on('click', function(e){
//     e.preventDefault();
//     // Grab parent href if user clicks on icon
//     var url = $(e.target).attr('href');
//     if (!!!url) {
//       url = $(e.target).parent().attr('href');
//     }

//     $.ajax({
//       method: 'GET',
//       url: url
//     }).done(function(response){
//       $('.container').html(response);
//       displayInitialCharts();
//       initializeDatepicker();
//       bindListeners();
//     })
//     $(this).parent().addClass("active");
//     $(this).parent().siblings().removeClass("active");
//   })
// }


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


