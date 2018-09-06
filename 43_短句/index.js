; (function () {
  var bodyNode = document.body;
  var textNode = document.querySelector('#text');
  var newQuote = document.querySelector('#new-quote');
  var qqKongJian = document.querySelector('#qq-kongjian');
  var weiBo = document.querySelector('#wei-bo');
  console.log(qqKongJian, weiBo);
  getNewQuote(render)

  newQuote.addEventListener('click', function () {
    throttle(getNewQuote, render, 1000);
  })
  qqKongJian.addEventListener('click',function(e){
    e.preventDefault();
    var title =  '一言';
    var url = window.location.href;
    var desc = textNode.innerText;
    var summary = textNode.innerText;
    console.log(title, url);
    shareToQQ(title, url, desc, summary);
  })

  weiBo.addEventListener('click', function(e){
    e.preventDefault();
    var title = textNode.innerText;
    var url = window.location.href;
    console.log(title, url);
    shareToXL(title, url);
  })

  function getNewQuote(callback) {
    const xhr = new XMLHttpRequest();
    /*一言api https://blog.lwl12.com/read/hitokoto-api.html */
    xhr.open("GET", "https://api.lwl12.com/hitokoto/v1?encode=realjson", true);
    xhr.onreadystatechange = function () {
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
    textNode.innerText = data.text;
    textNode.setAttribute('title', data.source + (data.author ? '-' + data.author : ''));
    /*延时清除动画效果 */
    setTimeout(() => {
      textNode.classList.remove('animated');
      textNode.classList.remove('fadeInUp');
    }, 500)

  }
  function throttle(method, callback, wait) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function () {
      method(callback)
    }, wait);
  }
  // 随机生成颜色 
  function getRandomColor() {
    return (function (m, s, c) {
      return (c ? arguments.callee(m, s, c - 1) : '#') +
        s[m.floor(m.random() * 16)]
    })(Math, '0123456789abcdef', 5)
  }
}());

function shareToXL(title, url, picurl) {
  var sharesinastring = 'http://v.t.sina.com.cn/share/share.php?title=' + title + '&url=' + url + '&content=utf-8&sourceUrl=' + url + '&pic=' + picurl;
  window.open(sharesinastring, 'newwindow', 'height=400,width=400,top=100,left=100');
}
function shareToQQ(title, url, desc, summary) {
  var shareqqzonestring= 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+ url + '&title='+ title + '&desc='+ desc +'&summary='+summary
  window.open(shareqqzonestring,'newwindow','height=400,width=400,top=100,left=100');
  
}