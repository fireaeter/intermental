Vue.component('entry', {
  props: ['name'],
  template: '<div class="mdl-card mdl-cell mdl-cell--12-col-desktop mdl-cell--6-col-tablet mdl-cell--4-col-phone"> <div class="mdl-card__supporting-text"> <h4>Тестовая запись</h4>{{name.text}}</div><div class="mdl-card__actions"></div><p></p><div class="mdl-card__menu"><i style="color:red;" class="material-icons">favorite_border</i>1<i class="material-icons">arrow_forward</i></div></div>'
})
var app_entry = new Vue({
  el: '#app_entry',
  data: {
    entryList: [
      { id: 0, text: 'Разнообразный и богатый опыт начало повседневной работы по формированию позиции позволяет оценить значение позиций, занимаемых участниками в отношении поставленных задач. С другой стороны сложившаяся структура организации в значительной степени обуславливает создание систем массового участия.Значимость этих проблем настолько очевидна, что постоянный количественный рост и сфера нашей активности представляет собой интересный эксперимент проверки направлений прогрессивного...' },
      { id: 1, text: 'Сыр' },
      { id: 2, text: 'Что там ещё люди едят?' }
    ]
  }
});
Vue.component('recom', {
  props: ['name'],
  template: '<div class="section__text mdl-cell mdl-cell--10-col-desktop mdl-cell--6-col-tablet mdl-cell--3-col-phone"> <h5>{{name.user}}</h5> </div>'
})
var app_entry = new Vue({
  el: '#app_recom',
  data: {
    entryList: [
      { id: 0, user: 'romka' },
      { id: 1, user: 'vlad' },
      { id: 2, user: 'vitek' }
    ]
  }
});
function get_entry(){
  $.ajax({
    type: "GET",
    url: "/api/entry/all/None/None",
    success: function(data){
      console.log(JSON.parse(data))
    },
    error: function(data){
      console.log(JSON.parse(data))
    }
  });
}
