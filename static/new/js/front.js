function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function toggle(el, act) {
    document.getElementById(el).style.visibility = act;
  }
function get_signup_fields_values() {
    var book_name = $("#book_name_form").val();
    var book_author = $("#book_author_form").val();
    var book_password = $("#book_password_form").val();
    var book_keywords = $("#book_keywords_form").val();
    var birthday = $("#birthday_form").val();
    return [book_name, book_author, book_password, book_keywords, birthday];
}
function get_post_values() {
    var post_header = $("#post_header_form").val();
    var post_content = $("#post_content").val();
    var book_password = $("#book_password_form").val();
    var book_keywords = $("#book_keywords_form").val();
    var birthday = $("#birthday_form").val();
    return [book_name, book_author, book_password, book_keywords, birthday];
}
$('#birthday_calendar').calendar({type: 'date'});

$('.ui.dropdown').dropdown();

$("#search_button").on('click', function(e) {
    var query = $("#query_input").val();
    get_search_results(query);
});

$(".signup_button").on('click', function(e) {
    $('.signup_modal')
    .modal({
        blurring: true,
        approve  : '.positive, .approve, .ok',
        deny     : '.negative, .deny, .cancel',
        transition: 'vertical flip'
    })
    .modal('show')
  ;
  $('#birthday_calendar').calendar({
    type: 'date'
    });
});
$("#signup_completed_button").on('click', function(e) {
    console.log("signup button clicked");
    $('.message .close')
    .on('click', function() {
      $(this)
        .closest('.message')
        .transition('fade')
      ;
    });
    signup_fields_values = get_signup_fields_values();
    var book_name = signup_fields_values[0];
    var book_author = signup_fields_values[1];
    var book_password = signup_fields_values[2];
    var book_keywords = signup_fields_values[3];
    var birthday = signup_fields_values[4];
    add_book(book_name, book_password, book_author, book_keywords, birthday);
    return false;
});
$("#signup_erase_button").on('click', function(e) {
    $("#book_name_form").val("");
    $("#book_author_form").val("");
    $("#book_password_form").val("");
    $("#book_keywords_form").val("");
    $("#birthday_form").val("");
    return false;
});
$("#send_post_button").on('click', function(e) {
    $('.accept_post_modal')
      .modal('show')
    ;
});
$('#post_submit_form').submit(function(e){
    e.preventDefault();
    alert("ok");
});
$("#book_submit_password_form").keypress(function(event) {
    if (event.which == 13) {
          event.preventDefault();
          var book_submit_name = $("#book_submit_name_form").val();
          var book_submit_password = $("#book_submit_password_form").val();
          var post_header = $("#post_header").val();
          var post_content = quill.getContents();
          add_post_to_book(book_submit_name, book_submit_password, post_header, post_content);
      }
  });