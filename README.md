### 数据跨组件共享同步机制梳理 2019.9.29

Common.class.js
```
//activeIndex 来记录页面

//tabs组件如果选择在顶部和左边，样式会不一样
//组件类的基类指向了vue根实例，并且绑定好了$store到vuex实例。
Search.prototype.vm = Vue; 
```

SearchComponents
```
//实例的this.可以便捷调用组件中的data和方法以及ref
Search.prototype.funvm = this;


//1.这里的this.data是ajax获取的之前保存的数据或者拖拽组件用Search类生成的默认数据
//2.另外data是通过深拷贝给searchObj,所以后面data就没用用了。
//3.这里的searchObj和this.search的指向是相同的，所以改一个另一个会改动，但是searchObj在其他地方没有使用过了。

let searchObj = new Search();
this.search = deepCopy(searchObj, this.data);

//Plugins组件被拖拽进Preview的时候，会自动点击一下这个wrap,导致触发setData方法，利用vuex改变activeAttr，同时右侧setAttr组件所有行为都于active.attrData关联，达到了组件拖拽好右侧就自动显示该组件的配置相关内容。

<div @click.stop="setData({}, 0)" class="search wrap"></div>
setData(item, index) {
    //用vuex跨组件
    this.$store.commit('activeAttr', this.search);
    this.$store.commit('tabIndex', this.index);
}
```


Preview
```
//数据流程一致，即可以从setAttr->vuex->preview(templateData)。
//到preview不是为了改变样式，而是为了数据同步而已，提交直接从vuex中读取tmplData。
```

Search.js
```
//因为数据从Preview利用:data传递到各个预览组件中，但是只有在created的时候用了一下props的data组件外，其他地方就没用过了。

//所以需要修改任何东西，都只能在Search.js里面来搞定了(另外setAttr里面的change方法也直接操作Vuex中的数据)。


//因为写在Search.js里面的改动，就等于是SearchComponents.vue组件中的this.search变量在变动


//比如this.config.style =2 即在SearchComponents.vue组件中的this.search.config = 2(其实就是this.search是Search.js的一个实例)



//优点是逻辑集中维护，不用小心意料之外的东西
//缺点是Search.js需要维护的逻辑有点多
```




备注
```
1.如果发现组件的简单值样式没有生效，是组件的config或者value属性里面没有申明属性，导致vue无法感知到数据变化（而简单值无需走editCB这种妖艳的操作)

```

cube组件额外说明
```
1.数据保存后，再重新渲染
2.修改属性后，页面上下边距不动，只动左右间距
3.(划重点)setAttr页面的currentData这个变量，如果在拖拽组件没有修改的情况下，会导致依赖组件.js中依赖this的方法，会有错误的this指向。
```



