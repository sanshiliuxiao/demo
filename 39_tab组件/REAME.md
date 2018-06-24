## tab 组件

HTML 结构

```html
div.tab-container>ul.tab-header>li*number^.tab-body>div*number
```

css 变化

```css
/* 自行编写*/
.tab-header .active {
    /*  */
    background: blue
}
.tab-body .active {
    /*  */
    display: block;
}
```



tab 组件的使用方法

```javascript
var tab1 = new Tab(document.querySelectorAll('.tab-container')[0]);
var tab1 = new Tab(document.querySelectorAll('.tab-container')[1]);
tab1.init();
tab2.init();
// ...
```

### 功能

每一个teb，都是独立的，但功能相同。点击相应的tab-header项，tab-body的内容也相应的发生改变。

[demo演示地址](https://sanshiliuxiao.github.io/demo/39_tab%E7%BB%84%E4%BB%B6/sample.html)