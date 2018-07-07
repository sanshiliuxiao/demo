function Carousel($ct) {
  this.init($ct);
  this.bind();
  this.autoPlay();
}
Carousel.prototype = {
  init: function($ct){
    this.$ct = $ct;
    this.$imgCt = this.$ct.find('.img-ct');
    // 选取的dom节点，不会根据html结构而动态改变。
    this.$imgs = this.$ct.find('.img-ct>li');
    console.log(this.$imgs, this.$ct.find('.img-ct>li') );
    this.imgWidth = this.$imgs.eq(0).width();
    this.imgCount = this.$imgs.length;
    this.index = 0;
    this.isAnimate = false;
    this.$preBtn = this.$ct.find('.pre');
    this.$nextBtn = this.$ct.find('.next');
    this.$bullets = this.$ct.find('.bullet li');
    this.$imgCt.append(this.$imgs.first().clone());
    this.$imgCt.prepend(this.$imgs.last().clone());
    this.$imgCt.width((this.imgCount + 2)*this.imgWidth);
    this.$imgCt.css( {
      left: '-='+ this.imgWidth + 'px'
    });
  },
  bind: function(){
    var _this = this;
    this.$preBtn.on('click', function(){
      console.log('pre...');
      _this.playPre(1)
    }),
    this.$nextBtn.on('click', function(){
      console.log('next...');
      _this.playNext(1);
    }),
    this.$bullets.on('click', function(){
      // jquery 事件监听， 得到的this，是原生dom,使用$转换
      // index, 得到当前this属于父级元素的第几个节点 （从0开始）
      console.log(_this.index, $(this).index());
      console.log($(this).index() - _this.index);
      var len = $(this).index() > _this.index ? $(this).index() - _this.index : _this.index - $(this).index();
      console.log('len', len);
      if ($(this).index() > _this.index) {
        _this.playNext(len);
      } else {
        _this.playPre(len);
      }
    })
  },
  playPre: function(len){
    var _this = this;
    if (_this.isAnimate) return
    _this.isAnimate = true;
    this.$imgCt.animate({
      left: '+=' + this.imgWidth*len
    },function(){
      console.log(_this.index);
      _this.index-=len;
      console.log(_this.index);
      if (_this.index < 0){
        _this.$imgCt.css('left', - _this.imgWidth*_this.imgCount);
        _this.index = _this.imgCount-1;
      }
      _this.setBullet();
      _this.isAnimate = false;
    })
  },
  playNext: function(len){
    console.log('playNext')
    var _this = this;
    if (_this.isAnimate) return
    _this.isAnimate = true;
    this.$imgCt.animate({
      left: '-='+this.imgWidth*len
    }, function(){
      console.log(_this.index);
      _this.index+=len;
      console.log(_this.index);
      if (_this.index === _this.imgCount){
        // 当索引值等于图片数量值时，替换
        //这是替身攻击，在一瞬间将最后一张图片，替换成相同的另一张图片
        _this.$imgCt.css('left', -_this.imgWidth);
        _this.index = 0;
      }
      _this.setBullet();
      _this.isAnimate = false;
    })
  },

  setBullet: function(){
    this.$bullets.eq(this.index).addClass('active').siblings().removeClass('active');
  },
  autoPlay: function(){
    console.log('autoPlay...');
    var _this = this
    _this.autoClock = setTimeout(function(){
      _this.autoPlay();
      _this.playNext(1);
    },2000);
  },
  stopAuto: function(){
    clearTimeout(this.autoClock);
  }
}

// 如果存在多个轮播, 不会互相影响
var ct1 = new Carousel($('.carousel').eq(0));