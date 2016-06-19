

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
  modalListener();
}

var initializeDatepicker = function(){
  var date = new Date();
  $('#datepicker-begin').datepicker({
    format: "yyyy-mm-dd",
    autoclose: true,
    todayHighlight: true
  });
  $('#datepicker-end').datepicker({
    format: "yyyy-mm-dd",
    autoclose: true,
    todayHighlight: true
  });
  $('#datepicker-end').datepicker('setDate', new Date());
  $('#datepicker-end').datepicker('update');
}

var modalListener = function(){
  $('#about-click').on('click', function(e){
    e.preventDefault();
    $('#overlay').show();
    $("body").addClass("modal-open");
    $('#about-modal').fadeIn([2]);
  });
  $('#overlay').on('click', function(){
    $('#about-modal').hide();
      $("body").removeClass("modal-open")
    $('#overlay').hide();
  })
}


var historyModalListener = function(){
  $('#myModal').on('show.bs.modal', function(event){
    var link = $(event.relatedTarget);
    var img_name = link.data('invoice');
    var transaction_id = link.data('id');
    var modal = $(this);
    $.ajax({
      method: 'GET',
      url: '/history/invoice/' + transaction_id
    }).done(function(response){
      modal.find('.modal-body').html(response);
    });

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
    alert("End date cannot be before start date");
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

          todayHighlight: true
        });
        // submitFormListener();
    });

  });
}

// NOT IN USE BECAUSE OF PAPERCLIP
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


