function $(selector) {
  return document.querySelector(selector);
}
/*
function $$(selector) {
  return document.querySelectorAll(selector);
}

$$('.modal .login').forEach(function(node){
  node.onclick = function() {
    $('.flip-modal').classList.remove('register');
    $('.flip-modal').classList.add('login');
  }
});

$$('.modal .register').forEach(function(node){
  node.onclick = function() {
    $('.flip-modal').classList.remove('login');
    $('.flip-modal').classList.add('register');
  }
});
*/
// 事件代理给父级 
$('.flip-modal').addEventListener('click',function(e){
  e.stopPropagation()
  if (e.target.classList.contains('login')) {
    $('.flip-modal').classList.remove('register');
    $('.flip-modal').classList.add('login');
  }
  if (e.target.classList.contains('register')) {
    $('.flip-modal').classList.remove('login');
    $('.flip-modal').classList.add('register');
  }
  if (e.target.classList.contains('close')) {
    $('.flip-modal').style.display = 'none';
  }
})
$('header .login i').onclick = function(e){
  e.stopPropagation();
  $('.flip-modal').style.display = 'block';
}

document.addEventListener('click', function(){
  $('.flip-modal').style.display = 'none';
})

// 提交验证
$('.modal-login form').addEventListener('submit', function(e){
  e.preventDefault();
  if(!(/^\w{3,8}$/.test($('.modal-login input[name=username]').value))) {
    $('.modal-login .errormsg').innerText = '用户名需要输入3-8个字符，包括数字字母下划线';
    return false;
  }
  if (!(/^\w{6,10}$/.test($('.modal-login input[name=password]').value))){
    $('.modal-login .errormsg').innerText = '密码需要6-10个字符，包括字母数字下划线';
    return false;
  }
  this.submit();
})

$('.modal-register form').addEventListener('submit', function(e){
  e.preventDefault();
  if(!(/^\w{3,8}$/.test($('.modal-register input[name=username]').value))) {
    $('.modal-register .errormsg').innerText = '用户名需要输入3-8个字符，包括数字字母下划线';
    return false;
  }
  if (/^sanshiliu$|^sanshiliuxiaoye$/.test($('.modal-register input[name=username]').value)){
    $('.modal-register .errormsg').innerText = '用户名已存在';
  }
  if (!(/^\w{6,10}$/.test($('.modal-register input[name=password1]').value))){
    $('.modal-register .errormsg').innerText = '密码需要6-10个字符，包括字母数字下划线';
    return false;
  }
  if (!(/^\w{6,10}$/.test($('.modal-register input[name=password2]').value))){
    $('.modal-register .errormsg').innerText = '密码需要6-10个字符，包括字母数字下划线';
    return false;
  }
  if ($('.modal-register input[name=password1]').value !== $('.modal-register input[name=password2]').value){
    $('.modal-register .errormsg').innerText = '两次密码不一致';
    return false;
  }
  this.submit();
})

// 是否播放音乐
$('footer .btn').addEventListener('click', function(e){
  e.stopPropagation();
  var audio = $('footer audio');
  if (audio !=null) {
    if(!audio.paused) {
      audio.pause();
      $('footer .btn').classList.remove('fa-pause');
      $('footer .btn').classList.add('fa-play');
    } else if (audio.paused){
      audio.play();
      $('footer .btn').classList.remove('fa-play');
      $('footer .btn').classList.add('fa-pause');
    }
  }
})
