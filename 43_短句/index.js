;(function(){
  var bodyNode = document.body;
  var textNode = document.querySelector('#text');
  var newQuote = document.querySelector('#new-quote');

  getNewQuote(render)
  newQuote.addEventListener('click', function(){
    throttle(getNewQuote, render, 1000);
  })
  function getNewQuote(callback){
    console.log('111');
    const xhr = new XMLHttpRequest();
    /*一言api https://blog.lwl12.com/read/hitokoto-api.html */
    xhr.open("GET", "https://api.lwl12.com/hitokoto/v1?encode=realjson", true);
    xhr.onreadystatechange  = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          callback(JSON.parse(xhr.response));
        } else {
          alert('加载失败');
        }
  
      }
    }
    xhr.send();
  }
  function render(data) {
    console.log(data);
    var color = getRandomColor()
    bodyNode.style.setProperty('--bg-color', color);
    bodyNode.style.setProperty('--text-color', color);
    textNode.classList.add('animated');
    textNode.classList.add('fadeInUp');
    textNode.innerText =  data.text;
    textNode.setAttribute('title', data.source + (data.author? '-'+data.author : ''));
    /*延时清除动画效果 */
    setTimeout(()=>{
      textNode.classList.remove('animated');
      textNode.classList.remove('fadeInUp');
    }, 500)

  }
  function throttle(method, callback, wait) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function(){
      method(callback)
    },wait);
  }
  // 随机生成颜色 
  function getRandomColor(){
    return (function(m,s,c){
      return (c ? arguments.callee(m,s,c-1) : '#') +
        s[m.floor(m.random() * 16)]
    })(Math,'0123456789abcdef',5)
  }
}());