<template>
  <div class="sourcePage">
    <el-dialog
      :visible.sync="innerVisible"
      :title="label"
      :top="top"
      width="70%"
      @close="cancel"
      :close-on-click-modal="maskClose"
      :close-on-press-escape="maskClose"
      append-to-body
      class="innerDislog"
    >


      <div class="container">

<!--        <div class="pagination padding10-r">-->
<!--          <el-pagination-->
<!--            :hide-on-single-page="true"-->
<!--            @prev-click="prev"-->
<!--            @next-click="next"-->
<!--            @current-change="current"-->
<!--            background-->
<!--            layout="prev, pager, next"-->
<!--            :total="page_total">-->
<!--          </el-pagination>-->
<!--        </div>-->
      </div>

      <span slot="footer" class="dialog-footer">
         已选择{{finderDialogInstance.select}}/{{finderDialogInstance.limit}}
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="subFn">确 定</el-button>
            </span>
    </el-dialog>

  </div>
</template>

<script lang="ts">

    import {
        Action,
        State
    } from 'vuex-class'
  import {getFileList,getDirectoryList} from '../../common/fetch';
  import {Component, Vue, Prop} from 'vue-property-decorator';
  @Component({
      props:{
          top:{
              type:String,
          },
          label: {
              type: String,
              default: '选择素材'
          },
          maskClose:{
              type:Boolean,
              default:false
          },
          show: {
              type: Boolean,
              default: false
          },
      },
      watch:{
          show: {
              immediate: true,
              handler(val) {
                  this.innerVisible = val;
              }
          },
      }
  })

  export default class WzwFinder extends Vue{

      @State finderDialogInstance

      innerVisible = false
      dirs = []//目录list
      lists = []//资源list,也可能是音频、视频、商品

      select_source_list = []

      source_type = 'img'

      //分页
      paginate =  {
          page: 1,
          total: 0,
          pageSize: 999
      }

      cancel(){
          window.finderDialogInstance.visible = false
      }

      subFn(){
          this.$emit('')
      }

      init_func(){
          getDirectoryList().then(res=>{
              this.dirs = res.data
          })

          getFileList(this.paginate).then(res=>{
              this.lists = res.data
          })
      }

      created(){

      }
  }
</script>

<style scoped>

</style>
