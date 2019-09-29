<template>
  <div @click.stop="setData({}, 0)"  class="nav wrap" >
    <div class="box"  :class="[className]" >
      <ul class="list" :style="{display:nav.value.list.length<5?'flex':'block'}">
        <li v-for="(item,idx) in nav.value.list" class="item" :style="{flex:nav.value.list.length<5?'1':''}">
          <div v-show="nav.config.type===1" class="cover" :style="{backgroundImage:'url('+domainFunc(item.img)+')'}" >
          </div>
          <div  class="title">{{item.title||'标题'}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapState, mapActions, mapMutations } from 'vuex';
import Nav from '@/assets/js/diy/nav';
import { deepCopyStrict, deepCopy,domain } from '@/common/utils';

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
            nav: {},
        };
      },
      computed: {
        className(){
            return 'style1';//+this.nav.config.style
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
        domainFunc(url){
            return domain(url)
        },
        setData(item, index) {
          // console.log('hehe',this.search)
          this.$store.commit('activeAttr', this.nav);// 这里点击之后，setAttr马上就有响应。

          this.$store.commit('tabIndex', this.index);

          // 用vuex就不要一层层传递了，头都晕了
          // this.$emit('setData', this.img.attrData)
        },
        // ...mapActions(),
      },

    })
export default class NavComponent extends Vue {
  created() {
      //Nav.prototype.vm = this;
    this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
    this.nav = deepCopy(new Nav(), this.data);
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/css/fun.less";

ul,li{
  .rest;

}


.box{
  .list{

    .item{
      margin-right: 10px;
      text-align: center;
      .cover{
        .cover-full-bg(cover,0,white);
        width: 60px;
        height: 60px;
        margin: 0 auto;
      }
      .title{
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        color: #444;
      }
    }
  }
}

.style1{

  .list{
    margin: 10px;
    white-space: nowrap;
    overflow-x: scroll;
    ::-webkit-scrollbar{
      display: none;
    }

    .item{
      display: inline-block;
      height: 90px;
      overflow-y: hidden;
    }
  }
}

</style>
