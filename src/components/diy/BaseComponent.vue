<template>
  <div @click.stop="setData({}, 0)"  class="base wrap" >
    <div class="cover" :class="[className]" :style="{backgroundImage:'url('+domainFunc(base.config.cover)+')'}">
      <img class="logo" :src="base.config.logo|domain" />
      <div class="title">{{base.config.title}}</div>
      <div class="desc">{{base.config.desc}}</div>
      <div class="total">商品 {{base.config.total}}</div>
      <div class="new">新品 {{base.config.new}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapState, mapActions, mapMutations } from 'vuex';
import Base from '@/assets/js/diy/base';
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
            base: {},
        };
      },
      computed: {
          className(){
            return 'style'+this.base.config.style
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
          this.$store.commit('activeAttr', this.base);// 这里点击之后，setAttr马上就有响应。

          this.$store.commit('tabIndex', this.index);

          // 用vuex就不要一层层传递了，头都晕了
          // this.$emit('setData', this.img.attrData)
        },
        // ...mapActions(),
      },

    })
export default class BaseComponent extends Vue {
  created() {
    Base.prototype.vm = this;
    this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
    this.base = deepCopy(new Base(), this.data);
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/css/fun.less";




.cover{
  .cover-full-bg(cover,0);
  height: 100%;
}

.style1{
  color: white;
  .logo{}
  .title{}
  .desc{}
  .total{}
  .new{}
}

.style2{
  color: red;
  .logo{}
  .title{}
  .desc{}
  .total{}
  .new{}
}

</style>
