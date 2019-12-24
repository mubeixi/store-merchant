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
                <div class="item" v-for="(dir,idx) in dirs" :key="idx" @click="selectDir(dir)">
                  {{dir.filename}}
                </div>
<!--                <div class="item" v-for="n in 10">-->
<!--                  haah1（454）-->
<!--                </div>-->
              </div>
              <div class="items">
                <el-popover
                  placement="top"
                  width="160"
                  trigger="manual"
                  v-model="recallVisible"
                >
                  <el-input size="small" class="line10"></el-input>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="recallVisible =false">取消</el-button>
                    <el-button type="primary" size="mini" >确定</el-button>
                  </div>
                  <div  slot="reference"   @click.prevent="recallVisible = true">新建分组</div>
                </el-popover>
              </div>
          </div>

          <div class="container-right">
              <div class="container-right-title">
                <div>
                  <el-tabs>
                    <el-tab-pane label="图片" name="first"></el-tab-pane>
                    <el-tab-pane label="视频" name="second"></el-tab-pane>
                    <el-tab-pane label="商品" name="third"></el-tab-pane>
                  </el-tabs>
                </div>
                <div class="container-right-titleRight">
                  大小不超过5M，已开启水印.
                  <wzw-file-button
                    :multiple="true"
                    :limit="9"
                    @done="upSuccess"
                  >
                    <template slot="preview" slot-scope="props">

                      <div class="item" style="display: inline-block;margin-right: 10px;" v-for="(file,idx) in props.previews">
<!--                        <img :src="file.url" :title="file.name" width="100px" />-->
                      </div>

                    </template>
                    <template slot="btn">
                      <el-button >上传文件</el-button>
                    </template>
                  </wzw-file-button>
                </div>
              </div>
              <div class="container-right-image" style="height:396px;overflow: hidden">
                  <div @click="add(file)" class="image" :key="idx2" v-for="(file,idx2) in current_file_list">
                    <div class="imgUnChecked">
                      <img class="img" v-if="file.checked" src="@/assets/img/imgChecked.png" >
                    </div>
                    <img class="img" v-lazy="domainFn(current_url+file.filename)"  >
                  </div>
              </div>
              <div class="paginate-box" >
                <div style="text-align: right;">
                  <el-button @click="minusPage" size="mini"><</el-button><div style="display: inline-block" class="padding10-c">{{currentPage}}/{{totalPage}}</div><el-button size="mini" @click="plusPage">></el-button>
                  <el-input size="mini" class="pageGo" v-model.number="pageGo" ></el-input>
                  <span class="spanCur" @click="changeCurrent">跳转</span>
                </div>
                <div style="height: 10px;"></div>
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
             已选择{{select_file_list.length}}/{{finderDialogInstance.limit}}
          </div>
          <div style="margin-left: 200px">
            <el-button type="success" @click="subFn">确 定</el-button>
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
  import {domain} from '../../common/utils';
  import WzwFileButton from '@/components/comm/WzwFileButton';


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
      computed:{

      },
      filters:{
          // imgFilter(filename){
          //     return domain(this.+filename)
          // }
      },
      watch:{
          currentPage:{
              immediate: true,
              handler(){
                  this.pageGo=this.currentPage
                  this.current_file_list=this.lists.slice(this.currentPage*18,this.currentPage*18+18)
              }
          },
          show: {
              immediate: true,
              handler(val) {
                  this.innerVisible = val;
              }
          },

      },
      components: {
          WzwFileButton
      }
  })

  export default class WzwFinder extends Vue{

      @State finderDialogInstance

      current_file_list = []
      pageSize = 18
      currentPage = 1
      totalPage = 1
      current_url = ''
      innerVisible = false
      dirs = []//目录list
      lists = []//资源list,也可能是音频、视频、商品

      recallVisible=false //新建分组

      select_file_list = []
      pageGo=''

      domainFn(url){
          return domain(url)
      }

      add(file){
          let fullPath = domain(this.current_url+file.filename)
          if(!file.checked){
              if(this.finderDialogInstance.limit<=this.select_file_list.length){
                  this.$message('照片最多可选'+this.finderDialogInstance.limit+'张');
                  return
              }
              this.$set(file,'checked',true)
              this.select_file_list.push(fullPath)
          }else{
              this.$set(file,'checked',false)
              let index = this.select_file_list.indexOf(fullPath);
              if (index > -1) {
                  this.select_file_list.splice(index, 1);
              }
          }



      }

      source_type = 'img'

      //分页
      paginate =  {
          page: 1,
          total: 0,
          pageSize: 999
      }

      changeCurrent(){
          if(this.pageGo<this.totalPage){
              this.currentPage=this.pageGo
          }else{
              this.pageGo=this.totalPage
              this.currentPage=this.totalPage
          }
      }
      plusPage(){
          if(this.currentPage==this.totalPage)return;
          this.currentPage++
          //this.pageGo=this.currentPage
      }

      minusPage(){
          if(this.currentPage==1)return;
          this.currentPage--
          //this.pageGo=this.currentPage
      }

      cancel(){
          window.finderDialogInstance.visible = false
      }

      subFn(){

          window.finderDialogInstance.callFn.choose(this.select_file_list)
          this.cancel()
          //this.$emit('')
      }

      loadDir(){


      }

      selectDir(dir){
          this.init_func(dir.filename)
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

              let tempDirs = [],tempLists = []
              for(var file of res.data.file_list){
                  //空目录不放了把
                  if(file.is_dir){
                      tempDirs.push(file)
                  }else if(file.is_photo){
                      tempLists.push(file)
                  }
              }



              this.dirs = tempDirs;

              let arr = []
              while (tempLists.length>this.pageSize){
                  arr.push(tempLists.splice(0,this.pageSize))
              }
              if(tempLists.length>0){
                  arr.push(tempLists)
              }

              console.log(arr,"sss")
              for(let item of arr){
                  for(let it of item){
                      this.lists.push(it)
                  }
              }
              //this.lists = arr;
              this.current_url = res.data.current_url

              let len = tempLists.length
              this.totalPage = Math.ceil(this.lists.length/18)

              this.currentPage = 1
              this.current_file_list=this.lists.slice(this.currentPage*18,this.currentPage*18+18)

          }).catch(e=>{console.log(e)})
      }


      uplists = []

      upSuccess(){
          let file_list = {...arguments}
          this.uplists = file_list
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
      display: flex;
      align-items: center;
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
      position: relative;
      .imgUnChecked{
        width: 25px;
        height: 25px;
        box-sizing: border-box;
        border: 1px solid #ffffff;
        background-color: #EEEEEE;
        position: absolute;
        top: 5px;
        left: 5px;
        opacity: 0.8;
      }
      .img{
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
.pageGo{
  display: inline-block;max-width: 40px;margin-left: 10px;margin-right: 10px;
}
.pageGo /deep/ .el-input__inner{
  padding-left: 5px;
  padding-right: 5px;
  text-align: center;
}
  .spanCur{
    cursor: pointer;
    color: #67C23A;
  }

</style>
