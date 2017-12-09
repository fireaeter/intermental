function get_search_results(query){
  $.ajax({
    url: "/api/search/"+query,
    success: function(data){
      NProgress.set(0.8);
      // document.getElementById("query_word").innerHTML += query;      
      for(i = 0;i < data.length;i++) {   
        document.getElementById("search_results_list").innerHTML += '<tr><td class="collapsing"><i class="book icon"></i><strong><a style="color:black;" href="book.html?current_book='+data[i]+'">'+data[i]+'</a></strong></td></tr>';
      }
      NProgress.done();
      $("#main_block").hide();
      $("#menu_right_block").hide();
  //     $( ".go_to_user" ).on("click", function() {
  //       var user = this.getAttribute("user");
  //       console.log(user);
  //       window.location = "/static/user.html?login="+user;
  //   });
      $("#search_results_block").show();
    }
  });
}

function add_book(book_name, book_password, book_author, book_keywords, birhday){
  $.ajax({
    type: "POST",
    url: "/api/books",
    data: JSON.stringify({'book_name': book_name, 'book_password': book_password, 'book_author': book_author, 'book_keywords': book_keywords, 'birthday': birhday}),
    success: function(msg){
      console.log("api - book added successfuly");
    }
 }); 
}
function add_post_to_book(book_name, password, header, content){
  $.ajax({
    type: "POST",
    url: "/api/books/"+book_name+"/posts",
    data: JSON.stringify({'password': password, 'header': header, 'content': content})
 }); 
}
function get_book_data(current_book){
  $.ajax({
    type: "GET",
    url: "/api/books/"+current_book,
    success: function(data){
      var book_info = JSON.parse(data)[0];
      var book_posts_num = JSON.parse(data)[1];
      document.getElementById("birthday_field").innerHTML += book_info['birthday'];
      document.getElementById("created_field").innerHTML += book_info['created_date'];
      document.getElementById("book_name_field").innerHTML += book_info['blog_name'];
      document.getElementById("keywords_field").innerHTML += book_info['keywords'];
      document.getElementById("book_posts_num_field").innerHTML += book_posts_num;
    }
 }); 
}
function get_all_book_entries(current_book) {
  $.ajax({
      url: "/api/books/"+current_book+"/posts?range=10,0",
      success: function (data) {
        for(i = 1;i < data.length;i++) {
          console.log(data[i]);
         document.getElementById("book_entries_list").innerHTML+='<tr><td>'+data[i]['header']+'</td><td>'+data[i]['date']+'</td>';
        }
      },
      error: function (error) {
          console.log("error getting book entries");
      }
  });
}
function render_book_page(data){
  for(i = 1;i < data.length;i++) {
    document.getElementById("posts_list").innerHTML += '<li class="collection-item"><div>'+data[i]['header']+'<a href="#!" class="secondary-content"><i style="color:black;" class="material-icons">arrow_forward</i></a></div></li>';
    console.log(data[i]);
  }
  setTimeout(
    function(){
      $("#load_data").remove();
      $( "#add_post_button" ).on( "click", function() {
        window.location.href="/static/page.html";
      });
      toggle("ui_content", "visible");
    }
  ,3000);
}