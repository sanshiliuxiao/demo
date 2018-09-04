var train= {
  init: function() {
    this.conNode = document.querySelector('#content');
    this.bgNode = document.querySelector('#bg'); 
    this.startNode = document.querySelector('#start');
    this.timeNode = document.querySelector('#time');
    this.LockStartTimer = false; // 防止多次点击训练开始，节流。
    this.timerLock; // 计时功能 
    this.bind();
  },
  start: function() {
    this.currentTime = 0;
    this.rowSize = 5;
    this.colSize = 5;
    var x = this.generateNumber(this.rowSize, this.colSize); // 返回 order 和 arr
    this.orderArr = x.orderArr;
    this.messArr = x.messArr;
    this.render();
  },
  bind: function() {
    console.log('绑定');
    var _this = this;
    this.startNode.addEventListener('click',function() {
      if (_this.LockStartTimer) clearTimeout(_this.LockStartTimer);
      alert('开始');
      _this.LockStartTimer = setTimeout(function(){
        _this.start();
        _this.LockStartTimer  = undefined;
        clearInterval(_this.timerLock); // 清除旧的计时器
        _this.timer();
      }, 200);
    });
    this.conNode.addEventListener('click', function(e){
      console.log(e.target.dataset.value,  _this.orderArr);
      // 如果当前点击的数字，正好为顺序数组的第一个，就正确
      console.log(e.target.dataset.value,  _this.orderArr[0]);
      if ( Number(e.target.dataset.value) ===  _this.orderArr[0]) {
        console.log(_this.orderArr.shift());
        if (_this.orderArr.length === 0) {
          // 如果 顺序数组的长度为零，则完成
          clearInterval(_this.timerLock) // 清除计时器
          alert('完成')
        }
      } else {
        _this.bgNode.classList.add('active');
        _this.bgNode.innerText = _this.orderArr[0];
        setTimeout(() => {
          // 箭头函数 
          _this.bgNode.classList.remove('active');
        }, 500);
      }

    });
  },
  render: function() {
    // 这里使用少许ES6 方便。
    console.log('渲染 ' + this.messArr);
    // ES6 箭头函数
    this.conNode.innerHTML= this.messArr.map((elem)=>{
      // ES6模板语法
      return `<span class="box" data-value="${elem}">${elem}</span>`
    }).join('');
  },
  generateNumber: function(rowSize,colSize){
    // 生成方块并打乱顺序
    var num = 0;
    var arr = [];
    for (var i=0; i<rowSize*colSize; ++i) {
      num++;
      arr.push(num);
    }
    // 打乱顺序， 洗牌算法
    var newArr = arr.slice();
    var m = newArr.length;
    var t, i;
    while (m) {
      i = Math.floor(Math.random()*m);
      m--;
      t = newArr[m];
      newArr[m] = newArr[i]
      newArr[i] = t
    }
    return {"orderArr": arr,"messArr" : newArr};
  },
  timer: function(){
    // 当点击开始的时候，启动计时功能。
    console.log('开始计时')
    // setInterval 的this,其实是全局的this，除非使用箭头函数。setTimeout 一样。
    // 箭头函数没有自己的this， 在箭头函数中使用this， 会指向最近一层作用域内的this
    this.timerLock = setInterval(()=>{
      this.currentTime+= 0.01; // 每加一代表加0.01s
      this.timeNode.innerText = this.formatTime(this.currentTime);
    }, 10);
  },
  formatTime: function(time) {
    return time.toFixed(2);
  }
}

train.init();