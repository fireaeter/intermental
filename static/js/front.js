function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
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
function get_sync_posts() {
    var locally_posts = JSON.parse(localStorage.getItem("posts"));
    if (locally_posts != null) {
        return [locally_posts, locally_posts.length];
    }else {
        return 0;
    }
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
    var query = $("#search_query_form").val();
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

$("#search_query_form").keypress(function(event) {
    if (event.which == 13) {
          event.preventDefault();
          var query = $("#search_query_form").val();
          get_search_results(query);
      }
  });

$("#book_submit_password_form").keypress(function(event) {
    if (event.which == 13) {
          event.preventDefault();
          var book_name = getCookie("book_name");
          var book_submit_password = $("#book_submit_password_form").val();
          var post_header = $("#post_header").val();
          var post_content = quill.getContents();
          add_post_to_book(book_name, book_submit_password, post_header, post_content);
      }
  });

function save_post_locally(header, content) {
    var locally_posts = JSON.parse(localStorage.getItem("posts"));
    if (locally_posts != null) {
        locally_posts[locally_posts.length] = {"header": header, "content": content};
        localStorage.setItem("posts", JSON.stringify(locally_posts));
    }else{
        var locally_posts_array = [];
        locally_posts_array[0] = {"header": header, "content": content};
        localStorage.setItem("posts", JSON.stringify(locally_posts_array));
    }
}

$("#save_post_locally_button").on('click', function(e) {
    var post_header = $("#post_header").val();
    var post_content = quill.getContents();
    save_post_locally(post_header, post_content);
    locally_posts_num = get_sync_posts()[1];
    document.getElementById("sync_posts_num").innerHTML=locally_posts_num;
});
$("#sync_posts_button").on('click', function(e) {
    $('.sync_posts_modal')
    .modal({
        blurring: true,
        approve  : '.positive, .approve, .ok',
        deny     : '.negative, .deny, .cancel',
        transition: 'vertical flip'
    })
    .modal('show');
});
$("#submit_sync_form").keypress(function(event) {
    if (event.which == 13) {
            event.preventDefault();
            var book_name = getCookie("book_name");
            var password = $("#submit_password_sync_form").val();
            console.log(password);
            var locally_posts = JSON.parse(localStorage.getItem("posts"));
            var current_post;
            if(locally_posts != null) {
                locally_posts_length = locally_posts.length;
                for(i = 0;i < locally_posts.length;i++){
                    console.log(locally_posts_length - i);
                    current_post = locally_posts[i];
                    console.log(current_post);
                    add_post_to_book(book_name, password, current_post['header'], JSON.stringify(current_post['content']));
                }
                localStorage.removeItem('posts');
                locally_posts_num = get_sync_posts()[1];
                if(locally_posts_num != undefined) {
                    document.getElementById("sync_posts_num").innerHTML=locally_posts_num;
                }else {
                    document.getElementById("sync_posts_num").innerHTML=0;
                }
            }else {
                console.log("no posts to sync");
            }
        }
    });