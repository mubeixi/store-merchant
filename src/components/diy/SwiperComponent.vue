<template>
  <div @click.stop="setData({}, 0)"  class="swiper wrap" >
    <el-carousel
      :autoplay="swiper.config.autoplay"
      :interval="swiper.config.interval|str2num"
      trigger="click"
      :loop="swiper.config.loop" height="150px">
<!--      <el-carousel-item v-for="item in 4" :key="item" v-if="swiper.value.list.length<1">-->
<!--        <h3 class="small text-center">{{ item }}</h3>-->
<!--      </el-carousel-item>-->
      <el-carousel-item v-for="(item,idx) in swiper.value.list" :key="idx" >
        <h3 v-if="!item.img_src" class="small text-center">请上传图片</h3>
        <div v-else class="cover-full" :style="{backgroundImage:'url('+domainFunc(item.img_src)+')'}" ></div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapState, mapActions, mapMutations } from 'vuex';
import Swiper from '@/assets/js/diy/swiper';
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
            swiper: {},
        };
      },
      computed: {
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
          this.$store.commit('activeAttr', this.swiper);// 这里点击之后，setAttr马上就有响应。

          this.$store.commit('tabIndex', this.index);

          // 用vuex就不要一层层传递了，头都晕了
          // this.$emit('setData', this.img.attrData)
        },
        // ...mapActions(),
      },

    })
export default class SwiperComponent extends Vue {
  created() {
    Swiper.prototype.vm = this;
    this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
    this.swiper = deepCopy(new Swiper(), this.data);
  }
}
</script>

<style scoped lang="less">
@import "~@/assets/css/fun.less";


.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.cover-full{
  .cover-full-bg(cover,0);
  height: 100%;
}

</style>
