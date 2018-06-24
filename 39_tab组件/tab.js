function Tab (node){
  this.node = node;
  this.index = 0;
  this.tabHeaderLis = node.querySelectorAll(' .tab-header li');
  this.tabBodyLis = node.querySelectorAll('.tab-body div');
}

Tab.prototype = {
    constructor: Tab,
    init: function(){
      console.log(this.tabHeaderLis);
      console.log(this.tabBodyLis);
      this.bind();
      this.render();
    },
    bind: function(){
      var _this =this;
      this.tabHeaderLis.forEach(function(item, idx){
        item.index = idx;
        item.addEventListener('click',function(e){
          //console.log(e.target, item.index);
          _this.index = item.index;
          //console.log(_this.index);
          _this.render();
        })
      })

    },
    render: function() {
      //console.log(this.index);
      for (var i=0; i<this.tabHeaderLis.length; ++i) {
        this.tabHeaderLis[i].classList.remove('active');
        this.tabBodyLis[i].classList.remove('active');
      }
      this.tabHeaderLis[this.index].classList.add('active');
      this.tabBodyLis[this.index].classList.add('active');
    }

}
