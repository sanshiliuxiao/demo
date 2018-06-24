## tab 组件

HTML 结构

```html
div.tab-container>ul.tab-header>li*number^.tab-body>div*number
```

css 变化

```css
.tab-header .active {
    /*  */
}
.tab-body .active {
    /*  */
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



[demo演示地址](./demo/39_tab组件/sample.html)