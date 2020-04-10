<template>
  <div @click.stop="setData({}, 0)" class="goods wrap" id="goods"
       :style="{background:goods.style.bgColor,paddingLeft:goods.style.wrapmargin+'px',paddingRight:goods.style.wrapmargin+'px'}">
    <div class="box" :class="[className]">
      <ul class="list" >
        <li v-for="(item,idx) in goodsList" class="item"
            :class="[idx%2==0?'even':'odd',goods.config.radius=='round'?'round':'',goods.config.showmode]"
            :style="[itemMarginObj(idx)]"
        >
          <div class="cover"
               :style="{width:itemw,height:itemH,backgroundSize:goods.config.fill?goods.config.fill:'cover',backgroundImage:'url('+domainFunc(item.ImgPath)+')'}">
            <div v-show="goods.config.attr.tag.show" :class="goods.config.attr.tag.style"
                 v-if="['new','hot'].indexOf(goods.config.attr.tag.style)!=-1" class="tag">
              {{goods.config.attr.tag.style=='hot'?'hot':'new'}}
            </div>
            <div v-show="goods.config.attr.tag.show" v-else class="tag img"><img
              :src="goods.config.attr.tag.img|domain"/></div>
          </div>
          <div class="info" :style="{width:itemw}" :class="{empyInfo:isEmpeyInfo}">
            <div class="left">
              <div v-show="goods.config.attr.title.show" class="title">{{item.Products_Name}}</div>
              <div v-show="goods.config.attr.desc.show" class="font12 graytext desc">
                {{item.Products_BriefDescription||'暂无介绍'}}
              </div>
              <div v-show="goods.config.attr.price.show" class="price"><span class="sign">￥</span>{{item.Products_PriceX}}
              </div>
            </div>
            <div v-show="goods.config.attr.buybtn.show" class="buybtn" :class="'theme'+goods.config.attr.buybtn.style">
              {{goods.config.attr.buybtn.text||'购买'}}
            </div>
          </div>
        </li>

        <!--因为参数是带了limit,所以这里不会为负数-->
<!--        <li v-for="(item,idx) in (limit-goodsList.length>4?4:limit-goodsList.length)" class="item"-->
<!--            :class="[idx%2==0?'even':'odd',goods.config.radius=='round'?'round':'',goods.config.showmode]"-->
<!--            :style="[itemMarginObj(idx)]"-->
<!--        >-->
<!--          <div class="cover"-->
<!--               :style="{width:itemw,height:itemw,backgroundImage:'url('+domainFunc(infoTmpl.ImgPath)+')'}">-->
<!--            <div v-show="goods.config.attr.tag.show" :class="goods.config.attr.tag.style"-->
<!--                 v-if="['new','hot'].indexOf(goods.config.attr.tag.style)!=-1" class="tag">-->
<!--              {{goods.config.attr.tag.style=='hot'?'hot':'new'}}-->
<!--            </div>-->
<!--            <div v-show="goods.config.attr.tag.show" v-else class="tag img"><img-->
<!--              :src="goods.config.attr.tag.img|domain"/></div>-->
<!--          </div>-->
<!--          <div class="info" :style="{width:itemw}" :class="{empyInfo:isEmpeyInfo}">-->
<!--            <div class="left">-->
<!--              <div v-show="goods.config.attr.title.show" class="title">{{infoTmpl.Products_Name}}</div>-->
<!--              <div v-show="goods.config.attr.desc.show" class="font12 graytext desc">-->
<!--                {{infoTmpl.Products_BriefDescription||'暂无介绍'}}-->
<!--              </div>-->
<!--              <div v-show="goods.config.attr.price.show" class="price"><span class="sign">￥</span>{{infoTmpl.Products_PriceX}}-->
<!--              </div>-->
<!--            </div>-->
<!--            <div v-show="goods.config.attr.buybtn.show" class="buybtn" :class="'theme'+goods.config.attr.buybtn.style">-->
<!--              {{goods.config.attr.buybtn.text||'购买'}}-->
<!--            </div>-->
<!--          </div>-->
<!--        </li>-->
      </ul>
    </div>
    <span class="fun-plugin-tag">商品列表</span>

  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';
    import Goods from '@/assets/js/diy/goods';
    import {deepCopy, domain,mixinStyle} from '@/common/utils';
    import {getProductList} from '@/common/fetch';

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
                goodsList: [],
                infoTmpl:{
                    Products_ID:33,
                    Products_Name:'商品名称',
                    Products_PriceX:99.99,
                    Products_BriefDescription:'商品简介',
                    ImgPath:''
                },
                goods: {},
                fullWidth: 0
            };
        },
        computed: {
            limit(){
              try {

                if(Array.isArray(this.goods.value.cate_id) && this.goods.value.cate_id.length>0){
                  return this.goods.value.limit
                }else if(Array.isArray(this.goods.value.list) && this.goods.value.list.length>0){
                  return this.goods.value.list.length
                }else{
                  return 6
                }

              }catch (e) {
                return 6
              }
            },
            isEmpeyInfo() {
                return !this.goods.config.attr.title.show && !this.goods.config.attr.desc.show && !this.goods.config.attr.price.show && !this.goods.config.attr.buybtn.show
            },
            w() {
                return this.fullWidth;
            },
            itemw() {
                let full = this.fullWidth;

                if(this.goods.config.showmode == 'border-bgwhite'){
                    full -= 4;//4个边框
                }

                if (this.goods.config.style === 2) {
                    //内边不是乘以3 而是1
                    return (full - this.goods.style.wrapmargin * 2 - this.goods.style.margin * 1) / 2 + 'px';
                }

                if (this.goods.config.style === 1) {
                    //内边不是乘以3 而是1
                    return (full - this.goods.style.wrapmargin * 2)+'px'
                }

                if (this.goods.config.style === 3) {
                    //内边不是乘以3 而是1
                    return 140+'px';
                }

                if (this.goods.config.style === 4) {
                    return full / 3 + 'px';
                }
                return 'auto';

            },
            itemH(){
                let full = this.fullWidth;
                let ratio = this.goods.config.ratio?this.goods.config.ratio:1;
                let num = 0;

                if(this.goods.config.showmode == 'border-bgwhite'){
                    full -= 4;//4个边框
                }
                if (this.goods.config.style === 2) {
                    //内边不是乘以3 而是1
                    num = (full - this.goods.style.wrapmargin * 2 - this.goods.style.margin * 1) / 2
                }

                if (this.goods.config.style === 3) {
                    //内边不是乘以3 而是1
                    num = 140
                }

                if (this.goods.config.style === 1) {
                    //内边不是乘以3 而是1
                    num = full - this.goods.style.wrapmargin * 2
                }

                if (this.goods.config.style === 4) {
                    num = full / 3;
                }
                if(num>0){
                    return num*ratio +'px';
                }
                return 'auto';
            },
            className() {
                return 'style' + this.goods.config.style
            },
            style() {
                //return mixinStyle(this.goods.styleDefault, this.goods.style);
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
            str2num(val) {
                return parseInt(val)
            }
        },
        watch: {
            'goods.value': {
                immediate: true,
                deep: true,
                handler(val) {

                    if (!val) return;
                    let {list = [], cate_id=[], limit} = val;

                    //console.log(list,cate_id,limit)

                    //如果值还没有设置的话
                    //取消注释，拉取默认的商品。这样的话，方便有主题让人应用
                    // if(list.length===0 && cate_id.length===0){
                    //     return;
                    // }

                    let param = {pageSize: this.limit}
                    if (cate_id.length>0) {
                        param.Cate_ID = cate_id.join(',')
                    }

                    if (list.length>0) {
                        param.Products_ID = list.join(',')
                    }

                    if(list.length===0 && cate_id.length===0){
                        param.pageSize = 6
                    }

                    getProductList(param).then(res => {
                        this.goodsList = res.data
                    })

                }
            },
            // 属性变化
            activeAttr: {
                deep: true,
                handler(val) {

                },
            },
        },
        components: {},
        methods: {
            itemMarginObj(idx) {

                let conf = this.goods.style.margin;
                let {left = conf, top = conf, bottom = 0, right = conf} = {}
                // {marginBottom:tool.style.margin+'px',marginLeft:idx%2==0?tool.style.margin:tool.style.margin/2+'px',marginRight:idx%2==0?tool.style.margin/2:tool.style.margin+'px'}
                switch (this.goods.config.style) {
                    case 1:
                        // top = 0;
                        left = 0;
                        right = 0;
                        break;
                    case 4:
                        // top = 0;
                        bottom = 0;
                        left = 0;
                        break;
                    case 3:
                        // top = 0;
                        left = 0;
                        right = 0;
                        break;
                    case 2:
                        //console.log(idx)
                        // top = 0;
                        left = idx % 2 == 0 ? 0 : conf / 2;
                        right = idx % 2 == 0 ? conf / 2 : 0;
                        break;
                }
                // console.log({
                //     marginTop: top + 'px',
                //     marginBottom: bottom + 'px',
                //     marginLeft: left + 'px',
                //     marginRight: right + 'px'
                // })
                //6666
                if(idx===0 )top = 0
                //这个需要是2
                if(idx===1 && this.goods.config.style==2 )top = 0
                return {
                    marginTop: top + 'px',
                    marginBottom: bottom + 'px',
                    marginLeft: left + 'px',
                    marginRight: right + 'px'
                }

            },
            getPic(jsonstr) {
                if (!jsonstr) return '';
                let obj = JSON.parse(jsonstr);
                if (!obj || !obj.ImgPath || obj.ImgPath.length < 1) return '';

                return domain(obj.ImgPath[0])
            },
            domainFunc(url) {
                if(!url){
                    return 'http://www.qiyeban.com/uploadfiles/wkbq6nc2kc/image/20190930095641111.png';//展位图替换掉吧。。
                }

                return domain(url)
            },
            setData(item, index) {
                // console.log('hehe',this.search)
                // @ts-ignore
                this.$store.commit('activeAttr', this.goods);// 这里点击之后，setAttr马上就有响应。

                // @ts-ignore
                this.$store.commit('tabIndex', this.index);

                // 用vuex就不要一层层传递了，头都晕了
                // this.$emit('setData', this.img.attrData)
            },
            // ...mapActions(),
        },

    })
    export default class GoodsComponent extends Vue {
        created() {
            let _self = this;
            this.$nextTick().then(res => {
                _self.fullWidth = document.getElementById('canvas').offsetWidth;
            })

            //用这个来搞事啊
            //funvm也是vue实例，而且不是根实例，是这个组件的实例，可以快捷的调用组件中的对象或者方法以及$ref
            Goods.prototype.funvm = this;
            //Goods.prototype.vm = this;
            this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
            this.goods = deepCopy(new Goods(), this.data);
            //重新绑定attrData.content，让修改可以同步到其他地方
            this.goods.setIndex(0,{value:false,config:false})
        }
    }
</script>

<style scoped lang="less">
  @import "~@/assets/css/fun.less";



  .wrap{
    background: #f8f8f8;
  }
  //无边框白底 有边框白底 无边框透明底
  /*'noborder-bgwhite','border-bgwhite','noborder-nobg'*/
  .noborder-bgwhite{

  }

  .border-bgwhite{
    box-sizing: border-box;
    border: 1px solid #e3e3e3;
  }

  .noborder-nobg{
    .info{
      background: none !important;
    }
  }




  *::-webkit-scrollbar {
    display: none !important;
  }

  .cover {
    .cover-full-bg(cover, 0);
    height: 100%;
  }

  ul, li {
    .rest;
    display: block;
  }


  .empyInfo {
    padding: 0 !important;
  }

  .buybtn {
    color: #444;
    padding: 2px 14px;
    font-size: 14px;
    height: 24px;
    line-height: 24px;
    background: #ff4444;
    color: white;
    /*border: 1px solid #409EFF;*/

    &.theme1{
      background: #ff4444;
      color: white;
      border-radius: 1px;
    }

    &.theme2{
      color: #ff4444;
      background: white;
      border: 1px solid #ffacac;
    }
  }

  .tag {
    position: absolute;
    left: 0px;
    top: 0px;
    background: red;
    height: 20px;
    line-height: 20px;
    color: white;
    text-align: center;
    padding: 0 8px;
    border-radius: 0 0 4px 0;
    font-size: 12px;

    &.img {
      background: none;

      img {
        position: absolute;
        width: 16px;
        height: 16px;
        left: 0;
        top: 0;
      }
    }
  }

  .round {
    border-radius: 2%;
    overflow: hidden;
  }

  .desc {
    height: 12px;
    line-height: 12px;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  @import "goods.less";

</style>
