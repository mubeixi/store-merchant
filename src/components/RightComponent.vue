<template>
  <div class="right-template">
    <ul>
      <li @click.stop="emitPreviewPlugin(key)" :data-label="item.label"
          v-for="(item,key) in tmplData[templateEditIndex]">
        <svg class="fun-icon icon sorticon"  aria-hidden="true">
          <use xlink:href="#icon-paixu" ></use>
        </svg>
        {{item.tag|getTitleByTag}}
        <div class="right" @click.stop="removePlugin(key)">
          <i  class="el-icon-delete"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';

    @Component({
        methods: {
            emitPreviewPlugin(idx) {
                this.$parent.$refs.preview.clickPlugin(idx);
            },
            removePlugin(idx){
                this.$parent.$refs.preview.removeTemplateByKeyCode(idx);
            }
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
        padding 0 0 0 10px
        font-size 14px
        line-height 38px
        cursor pointer
        border-bottom 1px solid #e7e7e7
        color #444
        height 38px
        .sorticon{
          cursor move
          color #999
          font-size 18px
          line-height 38px
        }
        .right{
          float right
          width 30px
          text-align center
        }
        .el-icon-delete{

          height 38px
          line-height 38px

        }
        .el-icon-delete:hover{
          color #409eff

        }
      }

      li:hover {
        background #f2f2f2
      }

      li:last-child {
        border-bottom none
      }
    }
  }
</style>
