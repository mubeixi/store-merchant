<template>
<!--  :class="{miniwrap:size=='mini'}"-->
  <div class="uploadComponents flex">
    <el-upload
      ref="upload"
      class="upload"
      :class="[imgUrl?'isHas':'',limit>1?'multiple':'',size,Len==limit?'is_full':'']"
      :multiple="limit>1"
      :accept="accept"
      :name="elName"
      :limit="limit"
      :disabled="disabled"
      :data.sync='ajaxData'
      :action="baseURL+'/api/little_program/shopconfig.php'"
      list-type="picture-card"
      :file-list="fileList"
      :show-file-list='showFileList'
      :on-preview="onPreview"
      :on-success='success'
      :on-error="error"
      :on-exceed="exceedFunc"
      :on-remove="handleRemove"
      :on-progress="progressFn"
      :before-upload='beforeUpload'
      :on-change='change'>
      <i class="el-icon-plus" v-if="Len<limit"></i>
        <div slot="file"  slot-scope="{file}">
          <template v-if="file.status!='success'">
            <el-progress :width="width-2" style="width: 100%" type="circle" :percentage="file.percentage|percent"></el-progress>
          </template>
         <template v-if="file.status=='success'">
           <video
             v-if="type==='video'"
             class="el-upload-list__item-thumbnail"
             :src="file.url"
           >
           </video>
           <img v-if="type==='image'"
                class="el-upload-list__item-thumbnail"
                :src="domainFn(file.url)" />
           <span class="el-upload-list__item-actions">
            <span v-if="size!='minimal'"
              class="el-upload-list__item-preview"
              @click="onPreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span>

            <span
              class="el-upload-list__item-delete"
              @click="doRemove(file)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
         </template>


        </div>

<!--      <template v-if="type==='vidoe' &&file_temp_list.length>0">-->
<!--        <div>{{file_temp_list[0]}}</div>-->
<!--&lt;!&ndash;        <video :src="file_temp_list[0]|domain"></video>&ndash;&gt;-->
<!--      </template>-->
      <div slot="tip" v-if="tip" class="el-upload__tip ">{{tip}} <i @click="remove" style="position: absolute;right: 0;top: 0;font-size: 22px;cursor: pointer;" v-if="showDelIcon && imgUrl" class="el-icon-circle-close del-icon"></i> </div>
    </el-upload>

    <el-dialog  title="预览素材" :visible.sync="preShow">
      <video width="100%" controls
             autoplay :src="domainFn(dialogImageUrl)" v-if="type==='video'"></video>
      <img width="100%" :src="domainFn(dialogImageUrl)"  v-if="type==='image'" alt="">
    </el-dialog>

  </div>
</template>

<script lang="ts">

  import {Component, Vue, Prop} from 'vue-property-decorator';
  import {mapActions, mapState} from 'vuex';
  import { baseApiUrl } from '@/common/env';
  import {createToken, GET_ACCESS_TOKEN, get_Users_ID} from '@/common/fetch';
  import { domain,objTranslate} from '@/common/utils';


  function noop() {
  }

  import {fun} from '@/common';

  @Component({
      computed: {
          width(){
              const conf = {mini:80,minimal:32,small:100}
              return conf[this.size]?conf[this.size]:80
          },
          activeAttr: {
              get() {
                  return this.$store.state.activeAttr;
              },
              set: () => {
              },
          },
          ajaxData() {
              let act = this.type==='video'?'upload_video':'upload_image'
              let param = {
                  Users_ID: get_Users_ID(),
                  act: act,
                  env : 'wx_mp',
                  access_token:GET_ACCESS_TOKEN()
              };
              let ajaxData = createToken(param);
              return ajaxData;
          }

      },
      watch:{
          // hasList:{
          //     immediate:true,
          //     deep:true,
          //     handler(val){
          //         this.fileList = val.map((img,idx)=>{
          //             return {
          //                 url:domain(img),
          //                 name:(new Date()).getTime()+idx
          //             }
          //         })
          //     }
          // }
      }
  })

  export default class UploadComponents extends Vue{

      @Prop({
          type:String,
          default:'image'
      })
      elName:string
      @Prop({
          type:Boolean,
          default:false
      })
      disabled:boolean

      @Prop({
          type:String,
          default:'image'
      })
      type:string

      @Prop({
          type:String,
          default:''
      })
      tip:string

      @Prop(String)
      imgUrl:string

      @Prop({
          type:Boolean,
          default:true
      })
      showFileList:boolean

      @Prop({
          type:Array,
          default:()=>[]
      })
      imgs:object


      @Prop({
          type:Number,
          default:1
      })
      limit:number

      @Prop({
          type:Function,
          default:noop
      })
      onSuccess:any

      @Prop({
          type:Function,
          default:noop
      })
      onRemove:any

      @Prop({
          type:String,
          default:'image/png, image/jpeg'
      })
      accept:string

      @Prop({
          type:Object,
          default:()=>{aspectRatio:1}
      })
      cropperOption:object

      @Prop({
          type:Number,
          default:-1
      })
      idx2:number

      @Prop({
          type:String,
          default:'default'
      })
      size:string

      @Prop(Boolean)
      showDelIcon:boolean

      @Prop(Boolean)
      cropper:boolean

      @Prop({
          type:Array,
          default:()=>[]
      })
      hasList:any

      fileList = []

      //file_temp_list = []
      Len = 0


      baseURL = baseApiUrl

      preShow = false
      dialogImageUrl = ''

      restFileList(files){
          let rt = []
          if(!files){
              files = this.$refs.upload.uploadFiles;
          }

          console.log(files)

          let url,video_url,video_img;
          for(var item of files ){

              //cover_url如果不是第一次上传是没有的
              video_url = item.url

              if(this.type==='video'){
                  if(item.url.indexOf('blob')!=-1){
                      if(item.status==='success' && item.response && item.response.data){
                          video_url = item.response.data.video_url
                          video_img = item.response.data.video_img
                      }else{
                          continue;
                      }
                  }
                  rt.push({video_url:video_url,video_img:video_img})
              }else if(this.type === 'image'){

                  url = item.url
                  if(item.url.indexOf('blob')!=-1){

                      if(item.status==='success' && item.response && item.response.data){
                          url = item.response.data.path
                      }else{
                          continue;
                      }

                  }
                  rt.push({url:url})

              }

          }
          this.Len = rt.length;
          return rt;
      }

      domainFn(url){
          return domain(url)
      }

      /**
       *
       * @param list array
       */
      handleInitHas(list){
          console.log(list)
          this.fileList = list.map((url,idx)=>{
              return {
                  url:url,
                  name:Date.now()+idx
              }
          })
          this.Len = this.fileList.length
      }
      progressFn(event, file, fileList){
          console.log(event,file,fileList)
      }
      onPreview(file){
          console.log(file)
          this.dialogImageUrl = file.url;
          this.preShow = true;
      }
      doRemove(file){
          //直接调组件内部的方法
          this.$refs.upload.handleRemove(file)
      }
      handleRemove(file, fileList){
          console.log(file, fileList)
          let call = this.onSuccess
          // let idx = null;
          // for(var i of fileList){
          //     if(fileList[i].url == file.url){
          //         idx =i ;
          //         break;
          //     }
          // }
          call && call(this.restFileList(fileList));
      }
      domainFunc(url) {
          return domain(url);
      }
      exceedFunc() {
          fun.error({ msg: '最多上传' + this.limit + '个文件' });
      }
      error(err, file, fileList) {
          console.log('上传失败了')
          fun.error({
              msg: JSON.stringify(err),
              title: '上传失败',
          });
          // // 写死试一下
          // const mock = {
          //     data: {
          //         path: 'https://knowledges.qd101.net/uploads/20190921/183707ef00bcaa47dc813d3dd50c0061.jpg',
          //     },
          // };
          // this.onSuccess.apply(this, mock);
      }
      change(file, fileList) {

          this.Len = fileList.length
          //this.file_temp_list = fileList
          // let _self = this
          // for(var fileItem of fileList){
          //     if(fileItem.response && fileItem.response.data){
          //         console.log(fileItem)
          //         fileItem.type = _self.type
          //         //this.file_temp_list.push(file.url)
          //     }
          // }
          // console.log(fileList)
          // this.file_temp_list = fileList.map(file=>{
          //     return file.url
          // })
      }
      beforeUpload() {

      }
      success(response, file, fileList) {
          if(response.errorCode!=0){
              fun.error({msg:response.msg})
              return;
          }
          console.log('response is ',response,fileList)
          let call = this.onSuccess
          if(response && response.data){
              call && call(this.restFileList(fileList));
          }

      }

      created(){
          //this.fileList = this.hasList
      }
  }


</script>

<style lang="less" scoped>

  .file-item{
    .item{
      .cover{
        background-size: contain;
        background-repeat: no-repeat;
        background-color: #f8f8f8;
        background-position: center center;
      }
    }
  }
  /*.uploadComponents {*/
  /*  .upload {*/
  /*    .avatar {*/
  /*      width: 100%;*/
  /*      height: 100%;*/
  /*      background-size: contain;*/
  /*      background-repeat: no-repeat;*/
  /*      background-position: center;*/
  /*      background-color: #f2f2f2;*/
  /*    }*/
  /*  }*/
  /*}*/

  /*.miniwrap .tip {*/
  /*  margin-top:  0;*/
  /*  line-height:  80px;*/
  /*}*/

  /*.tip {*/
  /*  margin-top:  110px;*/
  /*  margin-left:  10px;*/
  /*}*/


</style>
