<template>
  <div @click.stop="setData({}, 0)"  class="goods wrap" >
    <div class="box"  :class="[className]" >
      <ul class="list">
        <li v-for="(item,idx) in goodsList" class="item">
          <div class="cover" :style="{backgroundImage:'url('+domainFunc(item.ImgPath)+')'}" >
            <div class="tag">{{item.tag}}</div>
          </div>
          <div class="info">
            <div class="title">{{item.Products_Name}}</div>
            <div class="price"><span class="sign">￥</span>{{item.Products_PriceX}}</div>
            <div class="buybtn">购买</div>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapState, mapActions, mapMutations } from 'vuex';
import Goods from '@/assets/js/diy/goods';
import { deepCopyStrict, deepCopy,domain } from '@/common/utils';
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
            goodsList:[],
            goods: {},
        };
      },
      computed: {
          className(){
            return 'style'+this.goods.config.style
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
        'goods.value':{
          immediate:true,
          deep:true,
          handler(val){
              if(!val)return;
              let {list=[],cate_id,limit} = val;

              let param = {pageSize:limit?limit:6}
              if(cate_id){
                  param.Cate_ID = cate_id
              }else{
                  param.Products_ID = list.join(',')
              }

              getProductList(param).then(res=>{
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
      components: {

      },
      methods: {
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
          this.$store.commit('activeAttr', this.goods);// 这里点击之后，setAttr马上就有响应。

          this.$store.commit('tabIndex', this.index);

          // 用vuex就不要一层层传递了，头都晕了
          // this.$emit('setData', this.img.attrData)
        },
        // ...mapActions(),
      },

    })
export default class GoodsComponent extends Vue {
  created() {
    Goods.prototype.vm = this;
    this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
    this.goods = deepCopy(new Goods(), this.data);
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/css/fun.less";

*::-webkit-scrollbar {
  display: none !important;
}

.cover{
  .cover-full-bg(cover,0);
  height: 100%;
}
ul,li{
  .rest;
  display: block;
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

.style1{
  .list{
    .item{
      margin-bottom: 10px;
      .cover{

        .cover-full-bg(cover,49%,#f7f7f7);

        .tag{

        }
      }
      .info{
        position: relative;
        background: white;
        padding: 10px;
        .title{
          color: #444;
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
          position: absolute;
          right: 0;
          top:50%;
          transform: translateY(-50%);
        }
      }

    }
  }
}

</style>
