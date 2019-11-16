<template>
  <div class="right-template">
    <ul>
      <draggable v-model="pluginList"  @start="drag=true" @end="drag=false">
        <transition-group>
          <li :key="key" @click.stop="emitPreviewPlugin(key)" :data-label="item.label"
              v-for="(item,key) in pluginList">
<!--            <svg class="fun-icon icon sorticon"  aria-hidden="true">-->
<!--              <use xlink:href="#icon-paixu" ></use>-->
<!--            </svg>-->
            <i class="el-icon-sort" style="margin-left: 6px"></i>
            {{item.tag|getTitleByTag}}
            <div class="right" @click.stop="removePlugin(key)">
              <i  class="el-icon-delete"></i>
            </div>
          </li>

        </transition-group>
      </draggable>
      <div class="line10"></div>

    </ul>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';
    import draggable from 'vuedraggable';

    @Component({
        components:{
            draggable
        },
        methods: {
            emitPreviewPlugin(idx) {
                this.$parent.$refs.preview.clickPlugin(idx);
            },
            removePlugin(idx){
                this.$parent.$refs.preview.removeTemplateByKeyCode(idx);
            }
        },
        computed: {
            pluginList:{
                get() {
                    return this.tmplData[this.templateEditIndex]
                },
                set(val) {

                    // this.$store.commit('tabIndex',-1)
                    // this.$store.commit('activeAttr',{attrData: {}})

                    // let pluginNameList = val.map(plugin=>{
                    //     return plugin.tag
                    // })

                    // this.$set(this.$parent.$refs.preview.templateList,this.templateEditIndex,[])
                    // this.$set(this.$parent.$refs.preview.templateData,this.templateEditIndex,[])



                    // this.$set(this.$parent.$refs.preview.templateList,this.templateEditIndex,pluginNameList)
                    // this.$set(this.$parent.$refs.preview.templateData,this.templateEditIndex,val)

                    this.$parent.$refs.preview.restTmplFun(val);


                    // console.log(val)

                }
            },
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

      overflow hidden
      padding 0 16px

      li {
        padding 0px
        margin-top 12px
        font-size 14px
        line-height 40px
        cursor pointer
        /*border-bottom 1px solid #e7e7e7*/
        box-shadow 0 0 4px 0 rgba(10,42,97,.2)
        color #444
        height 40px

        .sorticon{
          cursor move
          color #999
          font-size 22px
          line-height 40px
          height 40px
          padding-right 6px
          float left

        }
        .right{
          float right
          width 30px
          text-align center
        }
        .el-icon-delete{

          height 40px
          line-height 40px

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
