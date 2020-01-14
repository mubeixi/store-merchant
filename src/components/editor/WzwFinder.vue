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
      class="innerDislog"
    >


      <div class="container">
          <div class="container-left">
              <div class="container-leftTop">
                <template v-for="(dir,idx) in dirs" >
                  <div class="item js-type-item" v-if="filterSourceType(dir.source_type)" :class="{active:idx==current_type_idx}"  @click="selectSourceType(dir,idx)">
                    {{dir.label}}
                  </div>
                </template>

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
                  <div  slot="reference"   @click.prevent="recallVisible = true">新建目录</div>
                </el-popover>
              </div>
          </div>
          <div class="container-right" v-loading="reqLoading">
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
                  <span class="padding10-c font12 graytext" v-if="!initData.storage_type && source_type=='image'">限传{{limit}}个文件,单张图片大小限制为{{parseInt(maxSize/1024)}}M.如需上传更大图片，请联系客服</span>
                  <span class="padding10-c font12 graytext" v-if="!initData.storage_type && source_type=='media'">限传{{limit}}个文件,单个视频限制长度为{{seconds}}秒.如需上传更长时间视频，请联系客服</span>
                  <wzw-file-button
                    :multiple="true"
                    :accept="accept"
                    :maxSize="maxSize"
                    :storage_type.sync="storage_type"
                    :current_path="current_path"
                    :limit="limit"
                    :extParam="extParam"
                    @preview="previewFn"
                    @progress="progressFn"
                    @done="upSuccess"
                  >
                    <template slot="btn">
                      <el-button >上传文件</el-button>
                    </template>
                    <template slot="preview" slot-scope="props">
                      <div></div>
<!--                      <div class="preview-list" v-show="props.previews.length>0">-->
<!--                        <div class="item" style="display:block;margin-right: 10px;" v-for="(file,idx) in props.previews">-->
<!--                          <div><span class="font12">{{file.name}}</span><el-progress  :percentage="file.percent"></el-progress></div>-->
<!--                        </div>-->
<!--                      </div>-->
                    </template>
                  </wzw-file-button>

                </div>
              </div>
              <div class="container-right-image" style="height:440px;overflow: hidden">
                <!--:style="{marginRight:((idx2+1)%8==0?'0px':'')}"-->

                <div  class="image"   v-for="(file,idx3) in preview_file_list" >
                  <img class="img" :src="file.url"  >
                  <div class="progress">
                    <el-progress :text-inside="true" :show-text="false" :percentage="file.percent"></el-progress>
                  </div>
                </div>

                  <div  class="image" :class="{check:file.checked && select_file_list.length>0}" :key="idx2" v-for="(file,idx2) in current_file_list" >
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
                      <div  style="position: absolute;width: 100%;height: 100%;">
                        <div @click="addFn(file)"  class="imgUnChecked">
                          <i class="el-icon-check icon " v-if="file.checked && select_file_list.length>0"></i>
                        </div>
                        <template v-if="source_type=='media'">
                          <!--<video @click="addFn(file)" class="img-cover" :src="file.fileurl"></video>-->
                          <img @click="addFn(file)" class="img-cover" :src="getFileUrl(file.fileurl)" />
                        </template>
                        <template v-else>
                          <div @click="addFn(file)" class="img-cover" v-lazy:background-image="getFileUrl(file.fileurl)"></div>
                        </template>
                        <div class="file_name">
                          {{file.filename}}
                        </div>

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
  import WzwFileButton from './WzwFileButton.vue';
    import {fun} from '../../common';
    import {isDev} from '../../common/env';


  @Component({
      props:{
          limit:{
              type: [String,Number],
              default: 10
          },
          top:{
              type:String,
              default:'10vh'
          },
          label: {
              type: String,
              default: '选择素材'
          },
          maskClose:{
              type:Boolean,
              default:true
          },
          show: {
              type: Boolean,
              default: false
          },
      },
      computed:{
          dir_list(){
            let rt = []
            for(var dir of this.dirs){
                if(window.finderDialogInstance.allow.indexOf(dir.source_type)!==-1){
                    rt.push(dir)
                }
            }
            return rt
          },
          //上传按钮插件的配置
          extParam(){
              return {type:this.source_type}
          },
          storage_type(){
            return this.initData.storage_type == 1 ?'aliyun':'local'
          },
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
                  if(val){

                      //init处理
                      // this.current_type_idx = 0
                      // this.current_path = this.dir_list[0].source_type+'/'
                      // // this.innerVisible = false
                      // this.source_type = this.dir_list[0].source_type

                      //点击第一个啊

                      this.$nextTick().then(()=>{
                          let firstEl = document.querySelector('.js-type-item')
                          firstEl.click()
                          this.select_file_list = []
                          this.init_func()
                      })

                  }

              }
          },
          initData:{
              deep: true,
              handler(val){
                  const upload_rule = val.upload_rule
                  //console.log(upload_rule)
                  this.accept = upload_rule['image'].exts
                  this.maxSize = upload_rule['image'].size
                  this.seconds = upload_rule['media'].seconds

              }
          }

      },
      components: {
          WzwFileButton
      }
  })

  export default class WzwFinder extends Vue{


      @State finderDialogInstance
      @State up_progress_list
      @State initData

      filterSourceType(source_type){
          return this.finderDialogInstance.allow.indexOf(source_type)!==-1
      }
      reqLoading = false //loading

      getFileUrl(url){
          //oss才支持
          //后端牛逼，服务器也支持了this.initData.storage_type &&
          if(isDev){
              url = domain(url);
          }

          if(this.source_type=='media')return `${url}?x-oss-process=video/snapshot,t_1000,f_jpg,w_200`
          if(this.source_type=='image')return `${url}-r200`
          //if(isDev) return domain(url)
          return url
      }

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
          {label:'视频',source_type:'media',accept:'audio/mp4, video/mp4'},//,application/ogg, audio/ogg,.wmv
          {label:'文件',source_type:'file',accept:'application/vnd.ms-powerpoint,application/vnd.ms-excel,application/msword,application/pdf'},
          {label:'其他',source_type:'other',accept:'application/zip,application/x-zip,application/x-zip-compressed,application/x-rar-compressed'},
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
              case 'media':
                  window.finderDialogInstance.callFn.chooseMedia && window.finderDialogInstance.callFn.chooseMedia(this.select_file_list)
                  break;
          }

      }

      loadDir(){


      }

      accept = 'image/gif, image/jpeg,image/png,image/bmp'
      maxSize = 0
      seconds = 15

      selectSourceType(type,idx){
          if(this.reqLoading)return //如果还在请求就不动
          const upload_rule = this.initData.upload_rule

          // this.accept = upload_rule[type.source_type].exts
          this.accept = type.accept //upload_rule[type.source_type].exts
          this.maxSize = upload_rule[type.source_type].size

          this.current_type_idx = idx
          this.source_type = type.source_type
          this.current_path = `${type.source_type}/`
          this.init_func()
      }
      selectDir(dir){
          this.current_path = dir.filepath
          this.init_func()
      }

      async init_func(){
          //防止多次请求
          if(this.reqLoading)return //如果还在请求就不动

          let dir=this.current_path,order='Name',path='',source_type=this.source_type//控制类型
          console.log(`source_type is ${source_type}`)

          this.reqLoading = true

          await getFileList({attach_path:dir,type:source_type}).then(res=>{

              let tempDirs = [],tempLists = [...res.data];

              this.lists  = tempLists;

              this.totalPage = Math.ceil(this.lists.length/this.pageSize)

              this.currentPage = 1
              this.current_file_list=this.lists.slice((this.currentPage-1)*this.pageSize,(this.currentPage-1)*this.pageSize+this.pageSize)

          })

          this.reqLoading = false
          console.log('点击目录略')


      }


      uplists = []
      previews = []

      preview_file_list = []

      //不用一直改了
      progressFn(arr){
          for(var i=0;i<arr.length;i++){
              if(this.preview_file_list[i]){
                  this.preview_file_list[i].percent = arr[i].percent
              }

          }
      }

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
          //this.init_func()
          // const upload_rule = this.initData.upload_rule
          // if(upload_rule.hasOwnProperty('image')){
          //     this.accept = upload_rule.image.exts
          //     this.maxSize = upload_rule.image.size
          // }



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
  user-select: none;
  //max-height: 450px;
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
  /*max-height: 450px;*/
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
      height: 124px;
      margin: 0 13px 20px 0;
      box-sizing: border-box;
      background: #fff;
      position: relative;
      cursor: pointer;
      .progress{
        position: absolute;
        z-index: 3;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
      &.check{
        .img-cover{
          border:1px solid #44B549;
        }
        &:before{
          position: absolute;
          width: 110px;
          height: 110px;
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
        width: 110px;
        height: 110px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
      .img-cover{
        /*z-index: 2;*/
        width: 110px;
        height: 110px;
        /*position: absolute;*/
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;

      }
      .file_name{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 4px 0;
        font-size: 12px;
        text-align: center;
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
