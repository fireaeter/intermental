var entrylist = []
// function get_entry_list() {
//   return new Promise(function(resolve, reject) {
//       $.ajax({
//           url: "/api/entry/all/None/None",
//           success: function(data){
//               resolve(data);
//           }, 
//           error: function(error) {
//               reject(error)
//           }
//       });
//   });
// };
// get_entry_list().then(function(response) {
//     entrylist=response
// }, function(error) {
//   return error;
// });
// get_entry_list();
// setTimeout(function () {
//   var app_entry = new Vue({
//     el: '#app_entry',
//     data: {
//       todos: entrylist
//     }
//   });
// }, 1000);
// Vue.component('recom', {
//   props: ['name'],
//   template: '<div class="section__text mdl-cell mdl-cell--10-col-desktop mdl-cell--6-col-tablet mdl-cell--3-col-phone"> <h5>{{name.user}}</h5> </div>'
// })
// var app_entry = new Vue({
//   el: '#app_recom',
//   data: {
//     entryList: entrylist
//   }
// });
// function get_entry(){
//   $.ajax({
//     type: "GET",
//     url: "/api/entry/all/None/None",
//     success: function(data){
//       console.log(JSON.parse(data))
//     },
//     error: function(data){
//       console.log(JSON.parse(data))
//     }
//   });
// }
function render_posts(posts){
  var header = ""
  var content = ""
  for(i = 0;i < posts.length;i++){
    header = JSON.parse(posts[i])['header']
    content = JSON.parse(posts[i])['content']
    $("#app_entry").append('<div class="mdl-card mdl-cell mdl-cell--12-col"> <div class="mdl-card__supporting-text"> <h4>'+header+'</h4>'+content+'</div> <div class="mdl-card__actions"></div></div>');
  }
}

function get_all_entries(){
  return new Promise(function(resolve, reject) {
    $.ajax({
        url: "/api/posts",
        success: function(data){
            resolve(data);
        }, 
        error: function(error) {
            reject(error)
        }
    });
});
}
get_all_entries().then(function(response) {
  entrylist=response;
  render_posts(entrylist);
}, function(error) {
return error;
});
get_all_entries();