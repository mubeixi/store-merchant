<template>
  <div class="sourcePage">
    <el-dialog
      :visible.sync="innerVisible"
      :title="label"
      :top="top"
      width="1080px"
      @close="cancel"
      :close-on-click-modal="maskClose"
      :close-on-press-escape="maskClose"
      append-to-body
      class="innerDislog"
    >


      <div class="container">
          <div class="container-left">
              <div class="container-leftTop">
                <div class="item" :class="{active:idx==current_type_idx}" v-for="(dir,idx) in dirs" :key="idx" @click="selectSourceType(dir,idx)">
                  {{dir.label}}
                </div>
              </div>
              <div class="items">
                <el-popover
                  placement="top"
                  width="160"
                  trigger="manual"
                  v-model="recallVisible"
                >
                  <el-input v-model="folder_name" size="small" class="line10"></el-input>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="recallVisible =false">取消</el-button>
                    <el-button @click="createDirFn" type="primary" size="mini" >确定</el-button>
                  </div>
                  <div  slot="reference"   @click.prevent="recallVisible = true">新建分组</div>
                </el-popover>
              </div>
          </div>
          <div class="container-right">
              <div class="container-right-title">
                <!--面包屑菜单-->
                <div class="w300 crumb">
                  <template v-for="(txt,idx) in current_path_arr">
                    <span @click="bindCrumb(idx)" class="crumb-txt">{{txt}}</span>
                    <template v-if="idx+1<current_path_arr.length">
                      <span class="crumb-space">/</span>
                    </template>
                  </template>
                </div>
                <!--文件上传-->
                <div class="container-right-titleRight">
                  <span class="padding10-c">大小不超过5M，已开启水印.</span>
                  <wzw-file-button
                    :multiple="true"
                    :accept="accept"
                    :current_path="current_path"
                    :limit="9"
                    @preview="previewFn"
                    @done="upSuccess"
                  >
                    <template slot="btn">
                      <el-button >上传文件</el-button>
                    </template>
                    <template slot="preview" slot-scope="props">
<!--                      <div class="preview-list" v-show="props.previews.length>0">-->
<!--                        <div class="item" style="display:block;margin-right: 10px;" v-for="(file,idx) in props.previews">-->
<!--                          <div><span class="font12">{{file.name}}</span><el-progress  :percentage="file.percent"></el-progress></div>-->
<!--                        </div>-->
<!--                      </div>-->
                    </template>
                  </wzw-file-button>

                </div>
              </div>
              <div class="container-right-image" style="height:390px;overflow: hidden">
                <!--:style="{marginRight:((idx2+1)%8==0?'0px':'')}"-->

                <div  class="image"  :key="idx2" v-for="(file,idx2) in preview_file_list" >
                  <img class="img" :src="domainFn(file.url)"  >
                  <div class="progress">
                    <el-progress :text-inside="true" :percentage="file.percent"></el-progress>
                  </div>
                </div>

                  <div  class="image" :class="{check:file.checked}" :key="idx2" v-for="(file,idx2) in current_file_list" >
                    <!--文件夹先显示-->
                    <template v-if="file.is_dir" >
                      <div class="dir" @click.top="selectDir(file)" >
                        <div>
                          <i style="font-size: 36px;" class="el-icon-folder-opened"></i>
                        </div>
                        <span class="font12">{{file.filename}}</span>
                      </div>
                    </template>
                    <!--文件显示-->
                    <template v-else>
                      <div @click="addFn(file)" style="position: absolute;width: 100%;height: 100%;">
                        <div  class="imgUnChecked">
                          <i class="el-icon-check icon " v-if="file.checked"></i>
                        </div>
                        <img class="img"  v-lazy="domainFn(file.fileurl)"  >
                      </div>

                    </template>
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
          <div style="float: left">
             已选择{{select_file_list.length}}/{{finderDialogInstance.limit}}
          </div>
          <div style="margin: 0 auto">
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
    import {createDirectory, fetch as fetchFn, getFileList} from '../../common/fetch';
  import {Component, Vue, Prop} from 'vue-property-decorator';
  import {domain} from '../../common/utils';
  import WzwFileButton from '@/components/comm/WzwFileButton';
    import {fun} from '../../common';


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
          up_progress_list(){
            return window.UP_PROGRESS_LIST
          },
          current_path_arr(){
              let arr = this.current_path.split('/')
              let rt = []
              for(var item of arr){
                  if(item)rt.push(item)
              }
              return rt
          }
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
                  this.current_file_list=this.lists.slice((this.currentPage-1)*this.pageSize,(this.currentPage-1)*this.pageSize+this.pageSize)
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
      @State up_progress_list


      folder_name = ''
      async createDirFn(){
          if(!this.folder_name){
              fun.error({msg:'文件夹名称不能为空'})
              return;
          }

          await createDirectory({folder_name:this.folder_name,root_path:this.current_path}).then(res=>{

          })

          this.folder_name = ''
          this.recallVisible = false
          this.init_func()
      }


      handleTabClick(tab, event){

          this.init_func()
          console.log(tab, event);
      }


      //点击面包屑菜单
      bindCrumb(idx){
          let current_path_arr = [...this.current_path_arr];
          let tempArr = current_path_arr.splice(0,idx+1);
          this.current_path = tempArr.join('/')+'/'
          this.init_func()
      }



      current_file_list = []
      pageSize = 21
      currentPage = 1
      totalPage = 1
      current_type_idx = 0
      current_path = 'image/'
      innerVisible = false
      source_type = 'image'

      dirs = [
          {label:'图片',source_type:'image',accept:'image/gif, image/jpeg,image/png,image/bmp'},
          {label:'视频',source_type:'media',accept:'audio/mp4, video/mp4,application/ogg, audio/ogg,.wmv'},
          {label:'文件',source_type:'file',accept:'application/vnd.ms-powerpoint,application/vnd.ms-excel,application/msword,application/pdf'},
          {label:'其他',source_type:'other',accept:'aplication/zip'},
      ]
      //目录list
      lists = []//资源list,也可能是音频、视频、商品

      recallVisible = false //新建分组

      select_file_list = []
      pageGo=''

      domainFn(url){
          return domain(url,'?x-oss-process=image/resize,m_lfit,h_110,w_110')
      }

      addFn(file){
          console.log('点击图片')
          let fullPath = domain(file.fileurl)

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

          this.cancel()
          switch (this.source_type) {
              case 'image':
                  window.finderDialogInstance.callFn.choose && window.finderDialogInstance.callFn.choose(this.select_file_list)
              break;
              case 'video':
                  window.finderDialogInstance.callFn.chooseMedia && window.finderDialogInstance.callFn.chooseMedia(this.select_file_list)
                  break;
          }



          //this.$emit('')
      }

      loadDir(){


      }

      accept = 'image/gif, image/jpeg,image/png,image/bmp'
      selectSourceType(type,idx){
          this.accept = type.accept
          this.current_type_idx = idx
          this.source_type = type.source_type
          this.current_path = `${type.source_type}/`
          this.init_func()
      }
      selectDir(dir){
          this.current_path = dir.filepath
          this.init_func()
      }

      init_func(){


          let dir=this.current_path,order='Name',path='',source_type=this.source_type//控制类型
          console.log(`source_type is ${source_type}`)

          getFileList({attach_path:dir,type:source_type}).then(res=>{

              let tempDirs = [],tempLists = [...res.data];


              //this.dirs = tempDirs;
              this.lists  = tempLists;

              // let arr = []
              // while (tempLists.length>this.pageSize){
              //     arr.push(tempLists.splice(0,this.pageSize))
              // }
              // if(tempLists.length>0){
              //     arr.push(tempLists)
              // }
              //
              // console.log(arr,"sss")
              // for(let item of arr){
              //     for(let it of item){
              //         this.lists.push(it)
              //     }
              // }


              //let len = tempLists.length
              this.totalPage = Math.ceil(this.lists.length/this.pageSize)

              this.currentPage = 1
              this.current_file_list=this.lists.slice((this.currentPage-1)*this.pageSize,(this.currentPage-1)*this.pageSize+this.pageSize)

          })
          console.log('点击目录略')




          // fetchFn(
          //     'nature',
          //     {dir,order,path,source_type},
          //     false,
          //     `http://localhost:9100/member/file_manager_json.php?dir=${dir}&order=${order}&path=${path}&source_type=${source_type}`,
          //     'get'
          // ).then(res=>{
          //
          //     let tempDirs = [],tempLists = []
          //     for(var file of res.data.file_list){
          //         tempLists.push(file)
          //         //空目录不放了把
          //         // if(file.is_dir){
          //         //     tempDirs.push(file)
          //         // }else if(file.is_photo){
          //         //     tempLists.push(file)
          //         // }
          //     }
          //
          //
          //
          //     this.dirs = tempDirs;
          //
          //     let arr = []
          //     while (tempLists.length>this.pageSize){
          //         arr.push(tempLists.splice(0,this.pageSize))
          //     }
          //     if(tempLists.length>0){
          //         arr.push(tempLists)
          //     }
          //
          //     console.log(arr,"sss")
          //     for(let item of arr){
          //         for(let it of item){
          //             this.lists.push(it)
          //         }
          //     }
          //     //this.lists = arr;
          //     this.current_path = res.data.current_path
          //
          //     let len = tempLists.length
          //     this.totalPage = Math.ceil(this.lists.length/this.pageSize)
          //
          //     this.currentPage = 1
          //     this.current_file_list=this.lists.slice((this.currentPage-1)*this.pageSize,(this.currentPage-1)*this.pageSize+this.pageSize)
          //
          // }).catch(e=>{console.log(e)})
      }


      uplists = []
      previews = []

      progressFn(files){

      }

      preview_file_list = []

      previewFn(arr){

          // filename:"3333"
          // filepath:"image/3333/"
          // fileurl:"http://wupengfei.oss-cn-beijing.aliyuncs.com/image/3333/"
          // is_dir:1

          let preview_file_list = arr
          console.log(preview_file_list)
          this.preview_file_list = preview_file_list
          // let previews = preview_file_list.map(file=>{
          //     return {
          //         fileurl:file.url,
          //         filepath:'',
          //         filename:file.name,
          //         is_dir:0,
          //         percent:file.percent,
          //     }
          // })
          //this.current_file_list = previews.concat(this.current_file_list)

      }
      upSuccess(){
          console.log('done')
          this.init_func()
          // let file_list = {...arguments}
          // this.uplists = file_list
      }

      created(){
          this.init_func()
      }
  }
</script>

<style scoped lang="less">
.crumb{
  .crumb-txt{
    cursor: pointer;
    color: #409EFF;
    &:last-child{
      color: #606266;
    }
  }
  .crumb-space{
    padding: 0 1px;
  }
}
.container{
  display: flex;
  max-height: 450px;
}
.container-left{
  max-height: 450px;
  position: relative;
  border-right: 1px solid #e7e7e7;
  margin-right: 20px;
  .container-leftTop{
    max-height: 350px;
    overflow-y:auto ;
    .item{
      width: 120px;
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      cursor: pointer;
      box-sizing: border-box;
      &.active{
        color: #409EFF;
      }
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

  .container-right-title {
    display: flex;
    margin-bottom: 20px;
    .container-right-titleRight{
      position: relative;
      z-index: 4;
      margin-left: auto;
      display: flex;
      align-items: center;
      .preview-list{
        background: white;
        padding: 10px;
        position: absolute;
        border:1px solid #eee;
        width: 290px;
        top: 46px;
        right: 0;
        z-index: 3;
        .item{

        }

      }
    }
  }
  .container-right-image{
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    width: 890px;
    margin: 0 auto;
    /*padding-left: 10px;*/
    .dir{
      width: 110px;
      height: 110px;
      padding: 26px 0;
      margin: 0 13px 20px 0;
      border: 1px solid #eee;
      text-align: center;
      box-sizing: border-box;
      :hover{
        color: #155bd4;
        i{

        }
      }
    }
    .image{
      width: 110px;
      height: 110px;
      margin: 0 13px 20px 0;
      box-sizing: border-box;
      background: #fff;
      position: relative;
      cursor: pointer;
      .progress{
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
      &.check{
        border:1px solid #44B549;
        &:before{
          position: absolute;
          width: 100%;
          height: 100%;
          background: #000;
          content:"";
          opacity: 0.1;
        }
        .imgUnChecked{
          background: #44B549;
        }
      }
      &:nth-child(7n) {
        margin-right: 0;
      }
      .imgUnChecked{
        width: 25px;
        height: 25px;
        box-sizing: border-box;
        border: 1px solid #ffffff;
        position: absolute;
        top: 5px;
        left: 5px;
        background-color: rgba(0, 0, 0, 0.2);
        z-index: 3;
        .icon{
          font-size: 20px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
          color: #fff;
        }
      }
      .img{
        z-index: 2;
        width: 100%;
        height: auto;
        max-height: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
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
