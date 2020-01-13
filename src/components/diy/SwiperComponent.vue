<template>
  <div @click.stop="setData({}, 0)" class="swiper wrap fun-preview-swiper" :class="{single:swiper.value.list.length<2}">
      <div v-if="swiper.value.list.length==1">
        <img style="width: 100%;display: block;" :src="domainFunc(swiper.value.list[0].img_src)" />
      </div>

        <el-carousel height="175px" v-else
        :autoplay="swiper.config.autoplay"
        :interval="swiper.config.interval|str2num"
        trigger="click"
        :loop="swiper.config.loop" >
        <el-carousel-item v-for="(item,idx) in swiper.value.list" :key="idx">
            <h3 v-if="!item.img_src" class="small text-center">请上传图片</h3>
            <div v-else class="cover-full" style="background-size: cover" :style="{backgroundImage:'url('+domainFunc(item.img_src)+')'}"></div>
        </el-carousel-item>
        </el-carousel>
    <span class="fun-plugin-tag">图片Banner</span>

  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';
    import Swiper from '@/assets/js/diy/swiper';
    import {deepCopy, domain} from '@/common/utils';

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
            //保存的是秒
            str2num(val) {
                return parseInt(val)*1000
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
        components: {},
        methods: {
            domainFunc(url) {
                return domain(url)
            },
            setData(item, index) {
                // console.log('hehe',this.search)
                // @ts-ignore
                this.$store.commit('activeAttr', this.swiper);// 这里点击之后，setAttr马上就有响应。

                // @ts-ignore
                this.$store.commit('tabIndex', this.index);

                // 用vuex就不要一层层传递了，头都晕了
                // this.$emit('setData', this.img.attrData)
            },
            // ...mapActions(),
        },

    })
    export default class SwiperComponent extends Vue {
        created() {
            //用这个来搞事啊
            //funvm也是vue实例，而且不是根实例，是这个组件的实例，可以快捷的调用组件中的对象或者方法以及$ref
            Swiper.prototype.funvm = this;
            //Swiper.prototype.vm = this;
            this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
            this.swiper = deepCopy(new Swiper(), this.data);
            //重新绑定attrData.content，让修改可以同步到其他地方
            this.swiper.setIndex(0,{value:false,config:false})
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

  .cover-full {
    .cover-full-bg(cover, 0);
    background-size: contain;
    height: 100%;
  }

</style>
