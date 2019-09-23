<template>
  <div @click.stop="setData({}, 0)" >
    <div :class="{islink:text.value.link?1:0}"
         :style="{fontSize:text.style.fontSize+'px',color:text.style.color,backgroundColor:text.style.bgColor,textAlign:text.style.textAlign}"
         class="text">{{text.value.content}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapState, mapActions, mapMutations } from 'vuex';
import Text from '@/assets/js/diy/text';
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
      text: {},
    };
  },
  computed: {
    style() {
      return deepCopyStrict(this.text.styleDefault, this.text.style);
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
      // console.log('hehe',this.hr)
      this.$store.commit('activeAttr', this.text);// 这里点击之后，setAttr马上就有响应。
      this.$store.commit('tabIndex', this.index);

      // 用vuex就不要一层层传递了，头都晕了
      // this.$emit('setData', this.img.attrData)
    },
    // ...mapActions(),
  },

})
export default class TextComponent extends Vue {
  created() {
    this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的
    this.text = deepCopy(new Text(this), this.data);
  }
}
</script>

<style scoped lang="stylus">
.text
  width 100%
</style>
