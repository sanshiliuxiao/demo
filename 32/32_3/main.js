// 已在html文件中引用了jquery
$('.tab').on('click', function(){
  // 回调函数中的this，是dom对象，不是jQUery对象
  // dom对象转 jquery对象,
  // 选中该元素的父亲的所有子元素，去除active
  $(this).parent('.nav').children('.tab').removeClass('active');
  // 为当前元素添加 active
  this.classList.add('active');
  $(this).parents('.mod-tab')
         .find('.panel')
         .eq($(this).index())
         .addClass('active')
         .siblings()
         .removeClass('active')

})