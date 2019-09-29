<template>
  <div @click.stop="setData({}, 0)"  :style="{height:style.height+'px',backgroundColor:style.bgColor}" class="space">
<!--    <div ></div>-->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapState, mapActions, mapMutations } from 'vuex';
import Space from '@/assets/js/diy/space';
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
          space: {},
        };
      },
      computed: {
        style() {
          return deepCopyStrict(this.space.styleDefault, this.space.style);
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
          // console.log('hehe',this.space)
          this.$store.commit('activeAttr', this.space);// 这里点击之后，setAttr马上就有响应。


          this.$store.commit('tabIndex', this.index);

          // 用vuex就不要一层层传递了，头都晕了
          // this.$emit('setData', this.img.attrData)
        },
        // ...mapActions(),
      },

    })
export default class SpaceComponent extends Vue {
  created() {
    //console.log(4444);
    this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
    this.space = deepCopy(new Space(this), this.data);
  }
}
</script>

<style scoped lang="stylus">
  .space
    height 0
    width 100%
</style>
