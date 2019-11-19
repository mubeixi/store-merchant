<template>
<!--  :class="{miniwrap:size=='mini'}"-->
  <div class="uploadComponents flex">
    <el-upload
      ref="upload"
      class="upload"
      :class="[imgUrl?'isHas':'',limit>1?'multiple':'',size,file_temp_list.length==limit?'is_full':'']"
      :multiple="limit>1"
      :accept="accept"
      :name="elName"
      :limit="limit"
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
      :before-upload='beforeUpload'
      :on-change='change'>
      <i class="el-icon-plus"></i>
      <template v-if="type==='vidoe' &&file_temp_list.length>0">
        {{file_temp_list[0]}}
<!--        <div v-for="(img,idx) in file_temp_list" class="file-item">-->
<!--          <div class="cover" :style="{backgroundImage:'url('+img.url+')'}"></div>-->
<!--        </div>-->
      </template>
      <div slot="tip" class="el-upload__tip ">{{tip}} <i @click="remove" style="position: absolute;right: 0;top: 0;font-size: 22px;cursor: pointer;" v-if="showDelIcon && imgUrl" class="el-icon-circle-close del-icon"></i> </div>
    </el-upload>

    <el-dialog :visible.sync="preShow">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

  </div>
</template>

<script lang="ts">

  import {Component, Vue, Prop} from 'vue-property-decorator';
  import {mapActions, mapState} from 'vuex';

  import { baseApiUrl } from '@/common/env';
  import { createToken, get_Users_ID } from '@/common/fetch';
  import {domain, objTranslate} from '@/common/utils';

  function noop() {
  }

  import {fun} from '@/common';

  @Component({
      computed: {
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
                  env : 'wx_mp'
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

      @Prop(String)
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

      @Prop(String)
      type:string

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

      file_temp_list = []

      baseURL = baseApiUrl

      preShow = false
      dialogImageUrl = ''

      handleInitHas(list){

          this.fileList = list.map((img,idx)=>{
              return {
                  url:domain(img),
                  name:(new Date()).getTime()+idx
              }
          })
      }

      onPreview(file){

          this.dialogImageUrl = file.url;
          this.preShow = true;
      }

      handleRemove(file, fileList){
          this.file_temp_list = fileList.map(file=>{
              return file.url
          })
          console.log(file)

          let call = this.onRemove
          call && call(file.response.data);
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
          console.log(fileList)
          for(var file of fileList){
              if(file.response && file.response.data){
                  this.file_temp_list.push(file.url)
              }
          }
          // this.file_temp_list = fileList.map(file=>{
          //     return file.url
          // })
      }
      beforeUpload() {

      }
      success(response, file, fileList) {
          let call = this.onSuccess
          if(response && response.data){
              call && call(response.data);
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
