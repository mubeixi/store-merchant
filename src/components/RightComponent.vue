<template>
  <div class="right-template">
    <ul>
      <li @click="emitPreviewPlugin(key)" :data-label="item.label" v-for="(item,key) in tmplData[templateEditIndex]">
        {{item.tag|getTitleByTag}}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapState, mapActions } from 'vuex';

@Component({
  methods: {
    emitPreviewPlugin(idx) {
      this.$parent.$refs.preview.clickPlugin(idx);
    },
  },
  computed: {
    ...mapState(['tmplData', 'templateEditIndex']),
  },
})
export default class RightComponent extends Vue {


}
</script>

<style scoped lang="stylus">
  .right-template {
    background-color: white;


    ul {
      margin 0
      padding 0
      overflow: hidden;
      li {
        padding-left 10px
        font-size 14px
        line-height 28px
        cursor pointer

        border-bottom 1px solid #e7e7e7
      }
      li:hover{
        background #f2f2f2
      }
      li:last-child{
        border-bottom none
      }
    }
  }
</style>
