<template>
  <div @click.stop="setData({}, 0)" :title="'播放地址'+video.config.src"   class="video">
    <img :src="video.config.cover|domain" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapState, mapActions, mapMutations } from 'vuex';
import Video from '@/assets/js/diy/video';
import { deepCopyStrict, deepCopy } from '@/common/utils';

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
      components: {

      },
      methods: {
        setData(item, index) {
          // console.log('hehe',this.video)
          this.$store.commit('activeAttr', this.video);// 这里点击之后，setAttr马上就有响应。


          this.$store.commit('tabIndex', this.index);

          // 用vuex就不要一层层传递了，头都晕了
          // this.$emit('setData', this.img.attrData)
        },
        // ...mapActions(),
      },

    })
export default class VideoComponent extends Vue {
  created() {
    this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
    this.video = deepCopy(new Video(this), this.data);
  }
}
</script>

<style scoped lang="stylus">
  .video
    width 100%
    img
      width 100%
</style>
