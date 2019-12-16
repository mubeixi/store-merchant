import Vue from 'vue';
import Common from './commonClass';
import {deepCopy, objTranslate} from "../../../common/utils";

function setValue() {
  // let value = {}
  // Vue.set(this, 'value', value)
}

function setConfig() {
  // 如果新对象，那么可以考虑用默认值替换掉。
  if (JSON.stringify(this.style) === JSON.stringify({
    bgColor: '',
    height: 30,
    color: '',
    inputBgColor: '',
  })) {
    Vue.set(this, 'style', JSON.parse(JSON.stringify(this.styleDefault)));
  }
  // let config = {}
}

//一行二个的数据模板
const cube_select_style1 = {
  row:1,
  col:2,
  list:[
    {
      IDX:0,
      bgimg:"",
      x:0,
      y:0,
      x1:1,
      y1:1
    },
    {
      IDX:1,
      bgimg:"",
      x:1,
      y:0,
      x1:2,
      y1:1
    }
  ]
};

// 一行三个
const cube_select_style2 = {
  row:1,
  col:3,
  list:[
    {
      IDX:0,
      bgimg:"",
      x:0,
      y:0,
      x1:1,
      y1:1
    },
    {
      IDX:1,
      bgimg:"",
      x:1,
      y:0,
      x1:2,
      y1:1
    },
    {
      IDX:2,
      bgimg:"",
      x:2,
      y:0,
      x1:3,
      y1:1
    }
  ]
};

//一行四个
const cube_select_style3 = {
  row:1,
  col:4,
  list:[
    {
      IDX:0,
      bgimg:"",
      x:0,
      y:0,
      x1:1,
      y1:1
    },
    {
      IDX:1,
      bgimg:"",
      x:1,
      y:0,
      x1:2,
      y1:1
    },
    {
      IDX:2,
      bgimg:"",
      x:2,
      y:0,
      x1:3,
      y1:1
    },
    {
      IDX:3,
      bgimg:"",
      x:3,
      y:0,
      x1:4,
      y1:1
    }
  ]
};

//两左两右
const cube_select_style4 = {
  row:2,
  col:2,
  list:[
    {
      IDX:0,
      bgimg:"",
      x:0,
      y:0,
      x1:1,
      y1:1
    },
    {
      IDX:1,
      bgimg:"",
      x:1,
      y:0,
      x1:2,
      y1:1
    },
    {
      IDX:2,
      bgimg:"",
      x:0,
      y:1,
      x1:1,
      y1:2
    },
    {
      IDX:3,
      bgimg:"",
      x:1,
      y:1,
      x1:2,
      y1:2
    }
  ]
};

//一左两右
const cube_select_style5 = {
  row:2,
  col:2,
  list:[
    {
      IDX:0,
      bgimg:"",
      x:0,
      y:0,
      x1:1,
      y1:2
    },
    {
      IDX:1,
      bgimg:"",
      x:1,
      y:0,
      x1:2,
      y1:1
    },
    {
      IDX:2,
      bgimg:"",
      x:1,
      y:1,
      x1:2,
      y1:2
    }
  ]
};

//一上两下
const cube_select_style6 = {
  row:2,
  col:2,
  list:[
    {
      IDX:0,
      bgimg:"",
      x:0,
      y:0,
      x1:2,
      y1:1
    },
    {
      IDX:1,
      bgimg:"",
      x:0,
      y:1,
      x1:1,
      y1:2
    },
    {
      IDX:2,
      bgimg:"",
      x:1,
      y:1,
      x1:2,
      y1:2
    }
  ]
};

//一左三右
const cube_select_style7 = {
  row:4,
  col:4,
  list:[
    {
      IDX:0,
      bgimg:"",
      x:0,
      y:0,
      x1:2,
      y1:4
    },
    {
      IDX:1,
      bgimg:"",
      x:2,
      y:0,
      x1:4,
      y1:2
    },
    {
      IDX:2,
      bgimg:"",
      x:2,
      y:2,
      x1:3,
      y1:4
    },

    {
      IDX:3,
      bgimg:"",
      x:3,
      y:2,
      x1:4,
      y1:4
    }
  ]
};


const tmplArr = {cube_select_style1,cube_select_style2,cube_select_style3,cube_select_style4,cube_select_style5,cube_select_style6,cube_select_style7}

function setAttrData() {
  const data = {
    title: '图片混排',
    content: [
      {
        type: 'color',
        text: '背景颜色',
        model: this.style.bgColor,
        editType: 'style',
        editKey: 'bgColor',
        editCB: item => {
          return item.model?item.model:'none'
        },
      },
      {
        type: 'slider',
        text: '页面边距',
        max:30,
        min:0,
        editType: 'style',
        editKey: 'wrapmargin',
        model: this.style.wrapmargin,
      },
      {
        type: 'slider',
        text: '图片间距',
        max:30,
        min:0,
        editType: 'style',
        editKey: 'margin',
        model: this.style.margin,
      },
      {
        type: 'radio',
        text: '选择模板',
        editType: 'config',
        editKey: 'type',
        model: this.config.type,
        editCB: (item) => {

          if(item.model!='diy'){

            let tmplData = tmplArr['cube_select_style'+item.model];

            //设置行列
            Vue.set(this.config, 'row', tmplData.row);
            Vue.set(this.config, 'col', tmplData.col);

            //根据选择不同初始化数据
            Vue.set(this.value, 'list',JSON.parse(JSON.stringify(tmplData.list)));

          }

          Vue.set(this.config, 'type', item.model);

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去

          return item.model;

        },
        value: [
          {
            label: '一行两个',
            value: 1,
          },
          {
            label: '一行三个',
            value: 2,
          },
          {
            label: '一行四个',
            value: 3,
          },
          {
            label: '二左二右',
            value: 4,
          },
          {
            label: '一左二右',
            value: 5,
          },
          {
            label: '一上两下',
            value: 6,
          },
          {
            label: '一左三右',
            value: 7,
          },
          {
            label: '自定义',
            value: 'diy',
          }

        ],
      },
      {
        type: 'radio',
        text: '自定义',
        hide:this.config.type!='diy',
        editType: 'config',
        editKey: 'row',
        model: this.config.row,
        editCB: (item) => {
          console.log(item)

          //设置行列
          Vue.set(this.config, 'row', item.model);
          Vue.set(this.config, 'col', item.model);

          //用属性名称来初始化数据
          Vue.set(this.value, 'list', []);

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去

          return item.model;

        },
        value: [
          {
            label: '4X4',
            value: 4,
          },
          {
            label: '5X5',
            value: 5,
          },
          {
            label: '6X6',
            value: 6,
          },
          {
            label: '7X7',
            value: 7,
          },

        ],
      },
      {
        type: 'MagicCube',
        text: '内容设置',
        row: this.config.row,
        col: this.config.col,
        tagName:this.tagName,
        width:375,
        style_type:this.config.type,
        value: this.value.list,
        //数据变化放进来的
        seclectChangeCB: (arr,pageEl) => {
          // console.log('55555555555555555cube选中列表有变动',this.tagName)
          // console.log(objTranslate(arr),objTranslate(this.value),objTranslate(this));
          //如果是数组的长度变小了
          if (arr.length < this.value.list.length) {
            var ids = []
            for (var i in this.value.list) {
              var j = 0;
              for (var area of arr) {
                //如果都存在，则没有什么
                console.log(area.IDX, this.value.list[i].IDX)
                if (area.IDX === this.value.list[i].IDX) {
                  j++;
                }
              }

              //记录要删除的多个
              if (!j) {
                ids.push(parseInt(i))
              }

            }
            console.log('需要删除', ids)
            //倒序，索引从大到小 删除不受影响
            ids.reverse()
            for (var idx of ids) {
              this.value.list.splice(idx, 1)
            }
          } else {
            for (var i in arr) {
              if (this.value.list[i]) {
                Vue.set(this.value.list, i, arr[i]);//强制触发数据和视图绑定
              } else {
                Vue.set(this.value.list, i, {
                  link: '',
                  linkType: '',
                  tooltip: '',
                  ...arr[i]
                });//强制触发数据和视图绑定
              }
            }
          }

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去

          //清空
          //console.log(pageEl)
          // setTimeout(function () {
          //   Vue.set(pageEl,'currentData',{})
          // },300)

          // pageEl.currentData = {}

        },
        bindCB: (dataType, type, path, tooltip, dataItem, pageEl, idx2) => {

          console.log(dataType, type, path, tooltip, dataItem, pageEl, idx2)
          pageEl.bindLinkDialogShow = false;

          // console.log(dataType, type, path, tooltip, dataItem,pageEl,idx2)
          Vue.set(this.value.list[idx2], 'link', path);
          Vue.set(this.value.list[idx2], 'ext', dataItem);
          Vue.set(this.value.list[idx2], 'linkType', type);
          Vue.set(this.value.list[idx2], 'tooltip', tooltip);

          //这里重新生成的attrData应该会在组件中直接显示。 也就是说我只需要直接把this给activeAttr即可
          this.setIndex(0, {value:false,config:false});
          this.vm.$store.commit('activeAttr', this);// 传出去

        },
        // 之类是输入的回调，可以根据需要决定写什么
        imgCB: (item, idx2) => {


        },
        removeCB: (idx) => {

        }

      },


    ],
  };


  Vue.set(this, 'attrData', data);
}

function attrData(options = {}) {
  // console.log(this.config)
  // @ts-ignore
  const {value, config, attrData} = options;
  // console.log(value, config, attrData);
  if (value !== false) setValue.call(this);
  if (config !== false) setConfig.call(this);
  if (attrData !== false) setAttrData.call(this);
}

/**
 * 魔方类
 */
class Cube extends Common {

  tag = 'cube';
  // activeIndex = 0;

  style = {
    wrapmargin: 0,//页面边距
    margin: 0,//商品距离
    bgColor: '#fff',
    // height: 30,
    // color: '',
    // inputBgColor: '',
  }

  /**
   * @bgColor 组件背景颜色
   * @height 高度
   * @color 文字颜色
   * @inputBgColor  输入框背景
   */
  styleDefault = {
    // bgColor: '#fff',
    // height: 30,
    // color: '#444',
    // inputBgColor: '#f2f2f2',
  }

  config = {
    type: 'diy',//这里是有多种便捷的选择
    row: 4,
    col:4
    // loop:false,//是否循环
    // interval:5000,//切换时间
    // autoplay:false,//自动播放

  }
  // img: "/uploadfiles/wkbq6nc2kc/image/SwiftFox_ZH-CN9413097062_1920x1080.jpg"
  // link: "/product/list?cate_id=194"
  // linkType: "cate"
  // title: "dsadsdadas"
  // tooltip: "分类：男装"

  value = {
    list: [],//存优惠券数组
  }

  tagName = ''


  constructor() {
    super();

    let nowTime = new Date();
    let timeStamp = nowTime.getTime()

    this.tagName = 'cube'+timeStamp/1000;


    // 统一这样来初始化
    attrData.call(this, {});
  }

  // value = []


  setIndex(index: number, options: object) {
    console.log('cube is setIndex')
    this.activeIndex = index;
    attrData.call(this, options);
  }
}

export default Cube;
