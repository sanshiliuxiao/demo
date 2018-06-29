/*
*/

// 自定义事件管理中心， 进行分发事件
var EventCenter = {
  on: function(type, handler) {
    $(document).on(type, handler);
  },
  fire: function(type, data){
    $(document).trigger(type, data);
  }
}

//音乐列表
var Footer = {
  init: function(){
    this.$footer = $('#footer');
    this.$box = $('.box');
    this.$musicList = $('#music-list');
    this.$leftBtn = $('#footer #music-left');
    this.$rightBtn = $('#footer #music-right');
    this.isToStart = true;
    this.isToEnd = false;
    this.isAnimate = false;
    this.bind();
    this.render();
  },
  bind : function(){
    var _this = this;
    this.$rightBtn.on('click', function(){
      if (_this.isAnimate) return;
      var itemWidth = _this.$musicList.find('.cover').outerWidth(true);
      var cowCount = Math.floor(_this.$box.width()/itemWidth)
      if (!_this.isToEnd) {
        _this.isAnimate = true;
        _this.$musicList.animate({
          left: '-=' + itemWidth*cowCount
        }, 400, function(){
          _this.isAnimate = false;
          _this.isToStart = false;  
          if (parseFloat(_this.$box.width()) - parseFloat(_this.$musicList.css('left')) > parseFloat(_this.$musicList.width()) ){
              _this.isToEnd = true;
          }
        })
      }
    });
    this.$leftBtn.on('click', function(){
      if (_this.isAnimate) return
      var itemWidth = _this.$musicList.find('.cover').outerWidth(true);
      var cowCount = Math.floor(_this.$box.width()/itemWidth)
      if (!_this.isToStart) {
        _this.isAnimate = true;
        _this.$musicList.animate({
          left: '+=' + itemWidth*cowCount
        }, 400, function(){
          _this.isAnimate = false;
          _this.isToEnd = false;
          if (parseInt(_this.$musicList.css('left'))>= 0){
            _this.isToStart = true;
          }
        })
      }
    });
    this.$footer.on('click', '.cover', function(){
      $(this).addClass('active').siblings().removeClass('active');
      EventCenter.fire('select-albumn', {
        channelId: $(this).attr('data-channel-id'),
        channelTags: $(this).attr('data-channel-tags')
      });
    })

  },
  render: function(){
    var _this = this;
    $.getJSON('https://jirenguapi.applinzi.com/fm/getChannels.php').done(function(ret){
      _this.renderFooter(ret.channels);
    }).fail(function(){
    })
  },
  renderFooter: function(channels){
    var html = '';
    channels.unshift({
      channel_id: 0,
      name: '我的最爱',
      cover_small: 'http://cloud.hunger-valley.com/17-10-24/1906806.jpg-small',
      cover_middle: 'http://cloud.hunger-valley.com/17-10-24/1906806.jpg-middle',
      cover_big: 'http://cloud.hunger-valley.com/17-10-24/1906806.jpg-big',
    })
    channels.forEach(function(channel){
      html += '<div class="cover" data-channel-id='+ channel.channel_id+ ' data-channel-tags='+  channel.name  + '>' 
            + '<div class= "image" style="background-image:url('+ channel.cover_small+');"></div>'
            + '<p>' + channel.name + '</p>'
            + '</div>' 
    });
    this.$musicList.html(html);
    this.setStyle()
  },
  setStyle: function(){
    
    var count = this.$musicList.find('.cover').length;
    var width = this.$musicList.find('.cover').outerWidth(true);;
    this.$musicList.css({
      width: count * width + 'px',
    })
  }
}

var Fm = {
  init: function(){
    this.channelId = null;
    this.channelName = null;
    this.$container = $('#main');
    this.$actions = this.$container.find('#actions');
    this.$areaBar = this.$container.find('.area-bar');
    this.$social = this.$container.find('.social-function');
    this.song = null;
    this.statusClock = null;
    this.collections = this.loadFromLocal();
    this.audio = new Audio();
    this.audio.autoplay = true;
    this.audio.volume = 0.4;
    this.bind();
  },
  bind: function(){
    var _this = this;
    EventCenter.on('select-albumn', function(e, channelObj){
      _this.channelId = channelObj.channelId;
      _this.channelTags = channelObj.channelTags;
      _this.loadMusic()
    })
    // 播放
    this.$actions.find('.btn-play').on('click', function(){
      var $btn = $(this);
      if ($btn.hasClass('icon-pause')) {
        $btn.removeClass('icon-pause').addClass('icon-play');
          setTimeout(() => {
            _this.audio.pause() 
          }, 200)

      } else {
        $btn.removeClass('icon-play').addClass('icon-pause');
          setTimeout(() => {
            _this.audio.play();
          }, 200);

      }
    });
    // 下一曲
    this.$actions.find('.btn-next').on('click', function(){
      setTimeout(() => {
        _this.loadMusic();
      }, 200);

    });
    // 收藏 利用html5的本地存储localStorage
    this.$actions.find('.btn-like').on('click', function(){
      var $btn = $(this);
      if ($btn.hasClass('active')) {
        $btn.removeClass('active');
        delete _this.collections[_this.song.sid];
      } else {
        $btn.addClass('active');
        _this.collections[_this.song.sid] = _this.song;
      }
      _this.saveToLocal();
    })
    // 进度条拖动
    this.$areaBar.find('.bar').on('click', function(e){
      var precent = e.offsetX / parseInt(getComputedStyle(this).width);
      if (precent>1) {precent == 0.99;}
      _this.audio.currentTime = _this.audio.duration * precent;
      _this.updataStatus();
    });
    // 其他功能 下载 分享 评论
    this.$social.on('click', 'li', function(){
      alert('暂不支持呢');
    })
    // 音乐播放监听，更新状态
    this.audio.addEventListener('play', function(){
      clearInterval(_this.statusClock);
      _this.statusClock = setInterval(function(){
        _this.updataStatus();
      }, 1000);
      
    })
    // 音乐暂停监听， 更新状态
    this.audio.addEventListener('pause', function(){
      clearInterval(_this.statusClock);
    })
    // 音乐结束监听
    this.audio.addEventListener('ended', function(){
      _this.loadMusic();
    })
  },
  loadMusic(){
    var _this = this;
    if (this.channelId === '0') {
      _this.loadCollection();
    }else {
      $.getJSON('//jirenguapi.applinzi.com/fm/getSong.php', {channel: this.channelId}).done(function(ret){
        _this.setMusic(ret['song'][0]);
      })
    }
  },
  setMusic: function(song){
    this.song = song;
    this.audio.src = this.song.url;
    $('#bg').css('background-image', 'url('+ this.song.picture+ ')');
    this.$container.find('#aside figure').css('background-image', 'url('+this.song.picture+')')
    if (this.song== null || this.song.title == null || this.song.artist == null){
      console.log('哦吼, 有问题哦,再点一次啦');
      this.$container.find('#music-infor .music-name').text('哦吼, 有问题哦');
      this.$container.find('#music-infor .tags').text('(*_*)');
      this.$container.find('#music-infor .author').text('^_^');
    } else {
      this.$container.find('#music-infor .music-name').text((this.song.title|| '^_^'));
      this.$container.find('#music-infor .tags').text((this.channelTags|| '^_^'));
      this.$container.find('#music-infor .author').text((this.song.artist|| '^_^'));
      this.$actions.find('.btn-play').removeClass('icon-play').addClass('icon-pause');
    }
    if(this.collections[song.sid]){
      this.$actions.find('.btn-like').addClass('active')
    }else{
      this.$actions.find('.btn-like').removeClass('active')
    }
    this.loadLyric();
  },
  loadLyric: function(){
    var _this = this;
    $.getJSON('//jirenguapi.applinzi.com/fm/getLyric.php', {sid: this.song.sid}).done(function(ret){
      var lyric = ret.lyric;
      var lyricObj = {};
      lyric.split('\n').forEach(function(line){
        var times = line.match(/\d{2}:\d{2}/g);
        var str = line.replace(/\[.*?\]/g, '');
        if (Array.isArray(times)) {
          times.forEach(function(time){
            lyricObj[time] = str
          })
        }
      })
      _this.lyricObj = lyricObj;
    })
  },
  updataStatus: function(){
    var min = Math.floor(this.audio.currentTime/60);
    var sec = Math.floor(this.audio.currentTime%60);
    sec = (sec+'').length === 2 ?  sec : '0'+sec;
    this.$areaBar.find('.current-time').text(min+':'+ sec);
    this.$areaBar.find('.bar-progress').css('width',
    this.audio.currentTime/this.audio.duration*100+'%');
    var line = this.lyricObj['0'+min+':'+sec];
    if (line) {
      this.$container.find('.lyric p').text(line);
    }
  },

  loadFromLocal: function(){
    return JSON.parse(localStorage['collections']|| '{}');
  },
  saveToLocal: function(){
    localStorage['collections'] = JSON.stringify(this.collections)
  },
  loadCollection: function(){
    var keyArray = Object.keys(this.collections)
    if(keyArray.length === 0) return
    var randomIndex = Math.floor(Math.random()* keyArray.length);
    var randomSid = keyArray[randomIndex];
    this.setMusic(this.collections[randomSid]);
  }
}
Fm.init();
Footer.init();


