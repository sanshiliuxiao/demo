var helper ={
  isToEnd: function($viewport, $content){
    return $viewport.height() + $viewport.scrollTop() + 10 > $content;
  },
  createNode: function(movie) {
    var template = `<div class="item">
          <a href="#">
            <div class="cover"><img src="#" alt="被禁止加载了"></div>
            <div class="detail">
              <h2></h2>
              <div class="extra"><span class="score"></span>分 / <span class="collect"></span></div>
              <div class="extra"><span class="year"></span> / <span class="type"></span></div>
              <div class="extra">导演：<span class="director"></span></div>
              <div class="extra">主演：<span class="actor"></span></div>
            </div>
          </a>
        </div>`;
    var $node = $(template);
    $node.find('a').attr('href', movie.alt);
    $node.find('.cover img').attr('src', movie.images.medium);
    $node.find('.detail h2').text(movie.title);
    $node.find('.score').text(movie.rating.average);
    $node.find('.collect').text(movie.collect_count);
    $node.find('.year').text(movie.year);
    $node.find('.type').text(movie.genres.join('/'));
    $node.find('.director').text(function(){
      var directorArr =[];
      movie.directors.forEach(function(item){
        directorArr.push(item.name);
      })
      return directorArr.join('、');
    });
    $node.find('.actor').text(function(){
      var actorArr = [];
      movie.casts.forEach(function(item){
        actorArr.push(item.name);
      })
      return actorArr.join('、');
    });
    return $node;
  }
}
var top250 = {
  init: function(){
    // 函数 和变量不要重名
    this.isLoading = false;
    this._index = 0;
    this.isFinish = false;
    this.$elem_top = $('#top250');
    this.bind();
    this.start();
  },
  bind: function(){
    var _this = this;  
    // 因为 他的parent 设置了 scorll， 所以只有它的父亲存在scorll事件
    this.$elem_top.parent().scroll(function(){
      if (!(_this.isFinish) && helper.isToEnd(_this.$elem_top.parent(),_this.$elem_top.height())) {
          console.log('没有到达底部');
          _this.start();
      }
    })
  },
  start: function(){
    var _this = this; //防止this变更 ，而导致找不到函数 
    this.getData(function(data){
      // 这里其实是一种回调 ，封装
      _this.render(data);
    })
  },
  getData: function(callback){
    var _this = this;
    // 判断数据是否正在加载， 避免重复发送请求
    if (_this.isLoading) return;
    _this.isLoading = true;
    // 找到加载样式的图标 并展示
    _this.$elem_top.nextAll('.loading').show();
    // 发送ajax请求
    $.ajax({
      url: 'http://api.douban.com/v2/movie/top250',
      data: {
        start: _this._index || 0,
      },
      dataType: 'jsonp'
    }).done(function(ret){
      console.log(ret);
      _this._index += 20;
      //console.log(_this._index, ret.total)
      if (_this._index >= ret.total){
        _this.isFinish = true;
      }
      callback&&callback(ret);
    }).fail(function(){
      console.log('数据异常');
    }).always(function(){
      _this.isLoading = false;
      _this.$elem_top.nextAll('.loading').hide();
    })
  },
  render: function(data){
    console.log('1 --> ' + data);
    var _this = this;
    data.subjects.forEach(function(movie){
      _this.$elem_top.append(helper.createNode(movie));
    })
  }
};
var usBox = {
  init: function(){
    this.$elem_us = $('#beimei');
    this.start();
  },
  start: function(){
    var _this = this;
    this.getData(function(data){
      _this.render(data);
    })
  },
  getData: function(callback){
    var _this = this;
    _this.$elem_us.nextAll('.loading').show();
    $.ajax({
      url: 'http://api.douban.com/v2/movie/us_box',
      data: {
        start: _this._index || 0,
      },
      dataType: 'jsonp'
    }).done(function(ret){
      console.log(ret);
      callback&&callback(ret);
    }).fail(function(){
      console.log('数据异常');
    }).always(function(){
      _this.$elem_us.nextAll('.loading').hide();
    })
  },
  render: function(data){
    var _this = this;
    data.subjects.forEach(function(item){
      _this.$elem_us.append(helper.createNode(item.subject));
    })
  }
};
var search = {
  init: function(){
    this.$search = $('#search');
    this.$input = this.$search.find('input');
    this.$btn = this.$search.find('button');
    this.$content = this.$search.find('.search-result');
    this._index = 0;
    this.isFinish = false;
    console.log(this.$search, this.$input, this.$btn);
    
    this.bind();
  },
  bind: function(){
    var _this = this;
    this.$btn.click(function(){
      console.log('222');
      _this.getData(_this.$input.val(), function(data){
        // 如果 点击搜索 就 将当前数据清除， 然后重置index， 
        _this._index = 0;
        _this.$content.empty();
        _this.render(data);
      });
    });
    this.$search.parent().scroll(function(){
      if (!(_this.isFinish) && helper.isToEnd(_this.$search.parent(),_this.$search.height())) {
          console.log('没有到达底部');
          _this.getData(_this.$input.val(), function(data){
            _this.render(data);
          });
      }
    })
  },
  getData: function(keyword,callback){
    var _this = this;
    _this.$search.nextAll('.loading').show();
    $.ajax({
      url: 'http://api.douban.com/v2/movie/search',
      timeout: 3000,
      data: {
        q: keyword,
        start: _this._index
      },
      dataType: 'jsonp'
    }).done(function(ret){
      console.log(ret);
      _this._index += 20;
      //console.log(_this._index, ret.total)
      if (_this._index >= ret.total){
        _this.isFinish = true;
      }
      callback&&callback(ret);
    }).fail(function(){
      console.log('数据异常');
    }).catch(function(){
      if (e.statusText == 'timeout'){
        _this.$search.nextAll('.loading').hide();
        console.log('超时了');
      }
    }).always(function(){
      _this.$search.nextAll('.loading').hide();
    })
  },
  render: function(data){
    var _this = this;
    data.subjects.forEach(function(item){
      _this.$content.append(helper.createNode(item));
    })
  }
};
var app = {
  init: function(){
    this.$tabs = $('footer>div');
    this.$panels = $('main>section');
    this.$section = $('section');
    this.bind();

    top250.init();
    usBox.init();
    search.init();
  },
  bind: function(){
    var _this = this //此时先讲当前环境的this（app） 赋值给 _this
    this.$tabs.on('click', function(){
      $(this).addClass('active').siblings().removeClass('active');
      /* 这个this此时 已经不是app的this了， 而是当前选中的元素的 */
      _this.$panels.eq($(this).index()).fadeIn().siblings().hide()
    });
    window.ontouchmove = function(e){
      e.preventDefault();
    }
    _this.$section.each(function(){
      this.ontouchmove = function(e) {
        e.preventDefault();
      }
    })

  }
}


app.init();
