/*{
  "src" : "https://sanshiliu.oss-cn-shenzhen.aliyuncs.com/music_demo/Yell.mp3",
  "title": "YELL",
  "auther": "Naomile",
  "img": "https://sanshiliu.oss-cn-shenzhen.aliyuncs.com/music_demo/images/yell.jpg"
}*/
function $(selector) {
  return document.querySelector(selector);
}
var musicList = [];
var currentIndex = 0;
var audio = new Audio();
audio.autoplay = true;
audio.volume = 0.1;

getMusicList(function(list){
  musicList = list;
  loadMusicList();
  loadMusic(musicList[currentIndex]);

})
function getMusicList(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "./music-data/music.json", true);
  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status <300 || xhr.status === 304) {
      console.log('ok');
      callback(JSON.parse(this.responseText));
    } else {
      console.log('获取数据失败');
    }
  };
  xhr.onerror = function() {
    console.log(error);
  };
  xhr.send();
}
// 加载音乐
function loadMusic(musicObj) {
  audio.src = musicObj.src;
  $('.music-picture').src = musicObj.img;
  $('.info .title').innerText = musicObj.title;
  $('.info .auther').innerText = musicObj.auther;
}
// 加载歌曲列表 
function loadMusicList(){
  var fragment = document.createDocumentFragment();
  for (var i=0; i<musicList.length; ++i) {
    var li = document.createElement('li');
    // 预先为每一首歌曲添加一个id， 方便之后事件代理给父级时，知道是第几个子元素
    li.id = i;
    var node = document.createTextNode(musicList[i].title);
    li.appendChild(node);
    fragment.appendChild(li);
  }
  $('.music-list ul').appendChild(fragment);
  // 为第一首歌添加样式
  $('.music-list ul>li').classList.add('music-current-play');
}

// 播放进度条及时间
audio.onplay = function() {
  clock = setInterval(function(){
    $('.progress-now').style.width = (audio.currentTime/audio.duration)*100 +'%';
    var min = Math.floor(audio.currentTime/60);
    var sec = Math.floor(audio.currentTime%60);
    sec = (sec+'').length === 2 ? sec : '0'+sec;
    $('.time').innerText = min + ':' + sec;
  }, 1000);
}
audio.onpause = function() {
  clearInterval(clock);
}

// 控制
$('.control .play').onclick = function() {
  if (audio.paused) {
    audio.play();
    this.querySelector('.fa').classList.remove('fa-play');
    this.querySelector('.fa').classList.add('fa-pause');
  } else {
    audio.pause();
    this.querySelector('.fa').classList.remove('fa-pause');
    this.querySelector('.fa').classList.add('fa-play');
  }
}
  // 下一曲
$('.control .forward').onclick = function() {
  currentIndex = (++currentIndex)%musicList.length;
  loadMusic(musicList[currentIndex]);
  $('.control .play').querySelector('.fa').classList.remove('fa-play');
  $('.control .play').querySelector('.fa').classList.add('fa-pause');
  changeCurrentStyle()
}

//上一曲
$('.control .back').onclick = function() {
  currentIndex = (musicList.length + --currentIndex)%musicList.length;
  loadMusic(musicList[currentIndex]);
  $('.control .play').querySelector('.fa').classList.remove('fa-play');
  $('.control .play').querySelector('.fa').classList.add('fa-pause');
  changeCurrentStyle()
}

// 拖动进度条 
$('.progress .bar').onclick = function(e){
  // 位置偏移量x 比上该元素样式的宽度值
  var precent = e.offsetX / parseInt(getComputedStyle(this).width);

  if (precent>1) {precent == 0.99;}
  audio.currentTime = audio.duration * precent;
}

// 播放完毕后的处理
audio.onended = function(){
  currentIndex = (++currentIndex)%musicList.length;
  loadMusic(musicList[currentIndex]);
  changeCurrentStyle()
}
// 为播放列表中的元素 添加事件， 事件代理给父级
$('.music-list ul').onclick = function(e){
  // e.target 就是被点中的节点
  e = e || window.event;
  target = e.target || e.srcElement;
  //console.log(target);
  //console.log(target.id);
  currentIndex = target.id;
  loadMusic(musicList[currentIndex]);

  changeCurrentStyle()

}

function changeCurrentStyle(){
      // 为正在播放的歌曲添加样式
      $('.music-current-play').classList.remove('music-current-play');
      var selector_current = '.music-list li[id="' + currentIndex + '"]';
      $(selector_current).classList.add('music-current-play');
}
