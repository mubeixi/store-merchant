<template>
  <div @click.stop="setData({}, 0)"  class="tab wrap" id="tabwrap" :class="tab.config.position" :style="{margin:tab.config.position === 'left'?tab.style.wrapmargin:0+'px'}" >
    <div class="tabs" id="tabs">
      <li :class="{active:tabActive===idx}" :id="'tab-item'+idx" @click="clickTab(item,idx)" v-for="(item,idx) in tab.value.list"><span>{{item.title}}</span></li>
    </div>
    <div class="tabs-panel" >
      <div class="box"  :class="[className]" >
        <ul class="list" :style="{margin:tab.config.position === 'top'?tab.style.wrapmargin:0+'px'}">
          <li v-for="(item,idx) in goodsList" class="item"
              :class="[idx%2==0?'even':'odd',tab.config.radius=='round'?'round':'']"
              :style="[itemMarginObj(idx)]"
          >
            <div class="cover" :style="{width:itemw,height:itemw,backgroundImage:'url('+domainFunc(item.ImgPath)+')'}" >
              <div v-show="tab.config.attr.tag.show" :class="tab.config.attr.tag.style"
                   v-if="['new','hot'].indexOf(tab.config.attr.tag.style)!=-1" class="tag">{{tab.config.attr.tag.style=='hot'?'hot':'new'}}</div>
              <div v-show="tab.config.attr.tag.show" v-else class="tag img"><img :src="tab.config.attr.tag.img|domain" /></div>
            </div>
            <div class="info" :style="{width:itemw}" :class="{empyInfo:isEmpeyInfo}">
              <div class="left">
                <div v-show="tab.config.attr.title.show" class="title">{{item.Products_Name}}</div>
                <div v-show="tab.config.attr.desc.show" class="font12 graytext desc">{{item.Products_BriefDescription||'暂无介绍'}}</div>
                <div v-show="tab.config.attr.price.show" class="price"><span class="sign">￥</span>{{item.Products_PriceX}}</div>
              </div>
              <div  v-show="tab.config.attr.buybtn.show" class="buybtn">{{tab.config.attr.buybtn.text||'购买'}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>


  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapState, mapActions, mapMutations } from 'vuex';
import Tab from '@/assets/js/diy/tab';
import { deepCopyStrict, deepCopy,domain } from '@/common/utils';
import {getProductList} from '@/common/fetch';
import de from 'element-ui/src/locale/lang/de';

    @Component({
      props: {
        index: {
          required: true,
        },
        data: {
          type: Object,
          default: () => ({}),
        },
      },
      data() {
        return {
            tabActive:0,
            currentTab:null,
            goodsList:[],
            tab: {style:{},value:{list:[]},config:{}},
            fullWidth:0
        };
      },
      computed: {
          goods(){
              return {}
          },
          isEmpeyInfo(){
              return this.tab.config.attr.title.show && !this.tab.config.attr.desc.show && !this.tab.config.attr.price.show && !this.tab.config.attr.buybtn.show
          },
          w(){
            return this.fullWidth;
          },
          itemw(){
              let full = this.fullWidth;

              if(this.tab.config.style===2){
                  return (full-this.goods.style.wrapmargin*2-this.goods.style.margin*3)/2+'px';
              }

              if(this.tab.config.style===4){
                  return full/3+'px';
              }
              return 'auto';

          },
          className(){
            return 'style'+this.tab.config.style
          },
        style() {
          // return deepCopyStrict(this.coupon.styleDefault, this.coupon.style);
        },
        activeAttr: {
          get() {
            return this.$store.state.activeAttr;
          },
          set(nval) {

          },
        },
        ...mapState(['editStatus']),
      },
      filters: {
        str2num(val){
            return parseInt(val)
        }
      },
      watch: {
        // 'tab.value.list':{
        //   handler(val){
        //       this.loadGoodsList()
        //   }
        // },
        currentTab:{
          deep:true,
          immediate:true,
          handler(val){

              this.loadGoodsList()

          }
        },
        // 属性变化
        activeAttr: {
          deep: true,
          handler(val) {

          },
        },
      },
      components: {

      },
      methods: {
        clickTab(item,idx){

            if(this.tabActive===idx){
                this.loadGoodsList();
                return;
            }
            this.tabActive=idx
            this.currentTab = item;
        },
        loadGoodsList(){
            let val = this. currentTab;
            if(!val)return;
            let {cate_id,title,limit} = val,param = {};

            if(limit){
                param.limit = limit
            }
            if(cate_id){
                param.Cate_ID = this.tab.value.list[this.tabActive].cate_id
            }

            getProductList(param).then(res=>{
                this.goodsList = res.data
            })
        },
        itemMarginObj(idx){

            let conf = this.tab.style.margin;
            let {left=conf,top=conf,bottom=conf,right=conf} = {}
            // {marginBottom:tool.style.margin+'px',marginLeft:idx%2==0?tool.style.margin:tool.style.margin/2+'px',marginRight:idx%2==0?tool.style.margin/2:tool.style.margin+'px'}
            switch (this.tab.config.style) {
                case 1:
                    top=0;
                    left=0;
                    right=0;
                    break;
                case 4:
                    top=0;
                    bottom=0;
                    left = 0;
                break;
                case 3:
                    top=0;
                    left=0;
                    right=0;
                break;
                case 2:
                    console.log(idx)
                    top=0;
                    left = idx%2==0?conf:conf/2;
                    right = idx%2==0?conf/2:conf;
                break;
            }
            console.log({
                marginTop:top+'px',
                marginBottom: bottom+'px',
                marginLeft: left+'px',
                marginRight: right+'px'
            })
            return{
                marginTop:top+'px',
                marginBottom: bottom+'px',
                marginLeft: left+'px',
                marginRight: right+'px'
            }

        },
        getPic(jsonstr){
            if(!jsonstr)return '';
            let obj = JSON.parse(jsonstr);
            if(!obj||!obj.ImgPath||obj.ImgPath.length<1)return '';

            return domain(obj.ImgPath[0])
        },
        domainFunc(url){
            return domain(url)
        },
        setData(item, index) {
          // console.log('hehe',this.search)
          this.$store.commit('activeAttr', this.tab);// 这里点击之后，setAttr马上就有响应。

          this.$store.commit('tabIndex', this.index);

          // 用vuex就不要一层层传递了，头都晕了
          // this.$emit('setData', this.img.attrData)
        },
        // ...mapActions(),
      },

    })
export default class TabComponent extends Vue {
  created() {
    let _self = this;
    this.$nextTick().then(res=>{
        _self.fullWidth = document.getElementById('canvas').offsetWidth;
    })
    //Tab.prototype.vm = this;
    this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
    this.tab = deepCopy(new Tab(), this.data);
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/css/fun.less";

.wrap{
  position: relative;
}

.wrap.left{
  border-bottom: 1px solid #e7e7e7;
  min-height: 500px;
  .tabs{
    color: #444;
    width: 90px;

    overflow-x: hidden;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    border-right: 1px solid #e7e7e7;

    li{
      font-size: 16px;
      display: block;

      /*text-align: center;*/
      overflow-x: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      height: 44px;
      cursor: pointer;
      text-align: center;
      color: #666;
      border-bottom: 1px solid #e7e7e7;
      &.active{
        border-left: 2px solid #f56c6c;
        color: #333;
      }
      span{


        line-height: 44px;


      }
    }
  }
  .tabs-panel{
    margin-left: 100px;
    margin-right: 10px;
    padding-top: 10px;
  }

}

.wrap.top{

  .tabs{
    color: #444;
    white-space: nowrap;
    padding: 0 10px;
    overflow-x: scroll;
    overflow-y: hidden;
    li{
      display: inline-block;
      margin-right: 10px;
      height: 36px;
      cursor: pointer;
      &.active{
        span{
          border-bottom: 2px solid #f56c6c;
        }

      }
      span{

        line-height: 32px;
        padding-bottom: 8px;

      }
    }
  }

}




.cover{
  .cover-full-bg(cover,0);
  height: 100%;
}
ul,li{
  .rest;
  display: block;
}


.empyInfo{
  padding: 0 !important;
}
.buybtn{
  color: #444;
  padding: 0px 16px;
  font-size: 14px;
  height: 32px;
  line-height: 32px;
  background: #409EFF;
  color: white;
  border: 1px solid #409EFF;
}

.tag{
  position: absolute;
  left: 0px;
  top:0px;
  background: red;

  height: 24px;
  line-height: 24px;
  color: white;
  text-align: center;
  padding: 0 8px;
  border-radius: 0 0 6px 0;
  font-size: 12px;
  &.img{
    background: none;
    img{
      position: absolute;
     width: 32px;
      height: 20px;
      left: 0;
      top:0;
    }
  }
}

.round{
  border-radius: 2%;
  overflow: hidden;
}

.desc{
  height: 12px;
  line-height: 12px;
  overflow-x: hidden;
  text-overflow: ellipsis;
}

.style1{
  .list{
    .item{
      //margin-bottom: 10px;
      .cover{
        position: relative;
        .cover-full-bg(cover,49%,#f7f7f7);

        .tag{

        }
      }
      .info{
        /*position: relative;*/
        background: white;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        flex:1;
        .title{
          height: 22px;
          line-height: 22px;
          overflow-x: hidden;
          text-overflow: ellipsis;
          color: #444;
          margin-bottom: 6px;
        }
        .desc{
          margin-bottom: 6px;
        }
        .price{
          .sign{
            font-size: 12px;
          }
          font-size: 16px;
          color: #f56c6c;
        }
        .buybtn{
          /*position: absolute;*/
          /*right: 10px;*/
          /*top:50%;*/
          /*transform: translateY(-50%);*/
        }
      }

    }
  }
}

.style2{

  .list{
    display: flex;
    flex-wrap: wrap;

    .item{

      box-sizing: border-box;
      display: block;
      overflow: hidden;

      /*&.even{*/
      /*  margin: 10px 5px 10px 10px;*/
      /*}*/

      /*&.odd{*/
      /*  margin: 10px 10px 10px 5px;*/
      /*}*/

      .cover{
        position: relative;
        .cover-full-bg(cover,0%,#f7f7f7);

        .tag{

        }
      }
      .info{
        width: 100%;
        background: white;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        .left{
          flex: 1;
          .title{
            width: 100%;
            overflow-x: hidden;
            height: 21px;
            text-overflow: ellipsis;
            line-height: 21px;
            color: #444;
            margin-bottom: 6px;
            font-size: 14px;
          }
          .desc{
            margin-bottom: 6px;
          }
          .price{
            .sign{
              font-size: 12px;
            }
            font-size: 14px;

          }
        }
        .buybtn{
          font-size: 12px;
          height: 24px;
          line-height: 24px;
          /*position: absolute;*/
          /*right: 0;*/
          /*top:50%;*/
          /*transform: translateY(-50%);*/
        }
      }

    }
  }
}


.style3{
  .list{


    .item{
      width: 100%;
      box-sizing: border-box;
      display: flex;
      overflow: hidden;
      //flex-direction:row-reverse;

      /*&.even{*/
      /*  margin: 10px 5px 10px 10px;*/
      /*}*/

      /*&.odd{*/
      /*  margin: 10px 10px 10px 5px;*/
      /*}*/


      .cover{
        position: relative;
        flex: 1;
        .cover-full-bg(cover,35%,#f7f7f7);

        .tag{

        }
      }
      .info{
        width: 140px !important;
        /*width: 100%;*/
        background: white;
        padding: 10px;
        box-sizing: border-box;
        overflow: hidden;
        .left{

          .title{
            width: 100%;
            overflow-x: hidden;
            height: 21px;
            text-overflow: ellipsis;
            line-height: 21px;
            color: #444;
            margin-bottom: 6px;
            font-size: 14px;
          }
          .desc{
            margin-bottom: 6px;
          }
          .price{
            margin: 6px 0;
            .sign{
              font-size: 12px;
            }
            font-size: 14px;

          }
        }
        .buybtn{
          font-size: 12px;
          height: 24px;
          line-height: 24px;
          display: inline-block;
          /*position: absolute;*/
          /*right: 0;*/
          /*top:50%;*/
          /*transform: translateY(-50%);*/
        }
      }

    }
  }
}

.style4{

  .list{

    white-space: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
    .item{

      display: inline-block;
      box-sizing: border-box;

      overflow: hidden;
      //flex-direction:row-reverse;

      /*&.even{*/
      /*  margin: 10px 5px 10px 10px;*/
      /*}*/

      /*&.odd{*/
      /*  margin: 10px 10px 10px 5px;*/
      /*}*/


      .cover{
        position: relative;
        flex: 1;
        .cover-full-bg(cover,0%,#f7f7f7);

        .tag{

        }
      }
      .info{

        /*width: 100%;*/
        background: white;
        padding: 10px;
        box-sizing: border-box;
        overflow: hidden;
        .left{

          .title{
            width: 100%;
            overflow-x: hidden;
            height: 21px;
            text-overflow: ellipsis;
            line-height: 21px;
            color: #444;
            margin-bottom: 6px;
            font-size: 14px;
          }
          .desc{
            margin-bottom: 6px;
          }
          .price{
            margin: 6px 0;
            .sign{
              font-size: 12px;
            }
            font-size: 14px;

          }
        }
        .buybtn{
          font-size: 12px;
          height: 24px;
          line-height: 24px;
          display: inline-block;
          /*position: absolute;*/
          /*right: 0;*/
          /*top:50%;*/
          /*transform: translateY(-50%);*/
        }
      }

    }
  }
}

</style>
