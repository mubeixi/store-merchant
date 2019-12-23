<template>
  <div class="sourcePage">
    <el-dialog
      :visible.sync="innerVisible"
      :title="label"
      :top="top"
      width="974px"
      @close="cancel"
      :close-on-click-modal="maskClose"
      :close-on-press-escape="maskClose"
      append-to-body
      class="innerDislog"
    >


      <div class="container">
          <div class="container-left">
              <div class="container-leftTop">
                <div class="item" v-for="n in 10">
                  全部图片（454）
                </div>
                <div class="item" v-for="n in 10">
                  haah1（454）
                </div>
              </div>
              <div class="items">新建分组</div>
          </div>

          <div class="container-right">
              <div class="container-right-title">
                <div class="container-right-titleRight">
                  大小不超过5M，已开启水印.
                  <el-button>上传文件</el-button>
                </div>
              </div>
              <div class="container-right-image">
                  <div class="image" v-for="n in 18">
                    <img src="https://new401.bafangka.com/uploadfiles/wkbq6nc2kc/image/20191205144638181.jpg">
                  </div>
              </div>
          </div>

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
          <div>
             已选择{{finderDialogInstance.select}}/{{finderDialogInstance.limit}}
          </div>
          <div style="margin-left: 200px">
            <el-button type="primary" @click="subFn">确 定</el-button>
            <el-button style="margin-left: 40px" @click="cancel">取 消</el-button>
          </div>
      </span>
    </el-dialog>

  </div>
</template>

<script lang="ts">

    import {
        Action,
        State
    } from 'vuex-class'
  import {fetch as fetchFn} from '../../common/fetch';
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

      loadDir(){


      }

      init_func(ppath=''){

          let dir=ppath,order='Name',path=''
          fetchFn(
              'nature',
              {dir,order,path},
              false,
              `http://localhost:9100/member/file_manager_json.php?dir=${dir}&order=${order}&path=${path}`,
              'get'
          ).then(res=>{

              for(var file of res.data.file_list){
                  //空目录不放了把
                  if(file.is_dir){
                      this.dirs.push(file)
                  }else if(file.is_photo){
                      this.lists.push(file)
                  }
              }

          }).catch(e=>{console.log(e)})
      }

      created(){
          this.init_func()
      }
  }
</script>

<style scoped lang="less">
.container{
  display: flex;
  max-height: 450px;
}
.container-left{
  max-height: 450px;
  position: relative;
  .container-leftTop{
    width: 190px;
    max-height: 350px;
    overflow-y:auto ;
    .item{
      width: 190px;
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      cursor: pointer;
      box-sizing: border-box;
      &:hover{
        background-color: #F8F8F8;
      }
    }
  }
  .items{
    height: 40px;
    padding-left: 20px;
    line-height: 40px;
    cursor: pointer;
    color: #409EFF;
    position: absolute;
    bottom: 0px;
  }



}
/*滚动条样式*/
::-webkit-scrollbar {/*滚动条整体样式*/
  color: transparent;
  width: 0;
  height: 0;
}

.container-right{
  max-height: 450px;
  flex: 1;
  box-sizing: border-box;
  border-left: 1px solid #999999;
  .container-right-title {
    display: flex;
    margin-bottom: 20px;
    .container-right-titleRight{
      margin-left: auto;
    }
  }
  .container-right-image{
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    padding-left: 10px;
    .image{
      width: 112px;
      height: 112px;
      margin-left: 10px;
      margin-bottom: 20px;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }

}


.dialog-footer{
  display: flex;
  align-items: center;
}

</style>
