<template>
  <div @click.stop="setData({}, 0)" :title="'播放地址'+video.config.src" class="video">

    <img v-if="video.config.cover" :src="video.config.cover|domain"/>
    <div v-else>
      <video width="100%" height="100%" controls="controls">
        您的浏览器不支持 video 标签。
      </video>
    </div>
    <span class="fun-plugin-tag">视频</span>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';
    import Video from '@/assets/js/diy/video';
    import {deepCopy, deepCopyStrict} from '@/common/utils';

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
                video: {},
            };
        },
        computed: {
            style() {
                return deepCopyStrict(this.video.styleDefault, this.video.style);
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
            setData(item, index) {
                // console.log('hehe',this.video)
                // @ts-ignore
                this.$store.commit('activeAttr', this.video);// 这里点击之后，setAttr马上就有响应。

                // @ts-ignore
                this.$store.commit('tabIndex', this.index);

                // 用vuex就不要一层层传递了，头都晕了
                // this.$emit('setData', this.img.attrData)
            },
            // ...mapActions(),
        },

    })
    export default class VideoComponent extends Vue {
        created() {
            //用这个来搞事啊
            //funvm也是vue实例，而且不是根实例，是这个组件的实例，可以快捷的调用组件中的对象或者方法以及$ref
            Video.prototype.funvm = this;
            this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
            this.video = deepCopy(new Video(this), this.data);
            //重新绑定attrData.content，让修改可以同步到其他地方
            this.video.setIndex(0,{value:false,config:false})
        }
    }
</script>

<style scoped lang="stylus">
  .video
    width 100%
    height 0
    padding-top 55.6%
    position relative

    img
      position absolute
      width 100%
      height 100%
      top 0
      vertical-align top

    video
      position absolute
      width 100%
      top 0
      bottom 0
      vertical-align: top

</style>
