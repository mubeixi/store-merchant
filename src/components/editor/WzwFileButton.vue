<template>
  <!--  <textarea name="content" id="editor"></textarea>-->
  <div>
    <input @change="fileFn($event)" :multiple="multiple" :id="elIdName" :name="elIdName" :accept="acceptStr" type="file" class="input-comp-file" />
    <div class="btnbox"  @click="selectFile">
      <slot name="btn">
        <button >上传文件</button>
      </slot>
    </div>
    <slot name="preview" :previews.sync="previews" >
      <div class="previews">
        <div class="item" v-for="(file,idx) in previews">
          <img :src="file.url" :title="file.name" width="60px" />
        </div>
      </div>
    </slot>


  </div>
</template>

<script lang="ts">

    import { Component, Vue ,Prop } from 'vue-property-decorator';
    import {
        Action,
        State
    } from 'vuex-class'
    import {getAliyunOssSign,uploadImgByBase64,uploadFileFn} from '../../common/fetch';
    import {objTranslate} from '../../common/utils';
    import _ from 'underscore'
    const defaultAllowFileType = [ 'jpeg', 'png', 'gif', 'bmp']

    const upFIleUrl = 'http://localhost:9100/upload-multi'

    function returnFileSize(number) {
        if(number < 1024) {
            return number + 'bytes';
        } else if(number > 1024 && number < 1048576) {
            return (number/1024).toFixed(1) + 'KB';
        } else if(number > 1048576) {
            return (number/1048576).toFixed(1) + 'MB';
        }
    }


    function random_string(len) {
        len = len || 32;
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var maxPos = chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    function get_suffix(filename) {
        let pos = filename.lastIndexOf('.')
        let suffix = ''
        if (pos != -1) {
            suffix = filename.substring(pos)
        }
        return suffix;
    }

    import {ls} from '../../common/tool/ls';
    import {fun} from '../../common';
    import {get_Users_ID,GET_ACCESS_TOKEN,createToken} from '../../common/fetch';

    const formatNumber = n => {
        n = n.toString()
        return n[1] ? n : '0' + n
    }

    const formatTime = () => {
        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()

        return [year, month, day].map(formatNumber).join('') + [hour, minute, second].map(formatNumber).join('')
    }

    //阿里云直传
    const upFileFnByAliyunOss = async ({file={},current_path,name='file',idx,list=[],progress})=>{

        let aliyunOssSign = null

        const users_id = get_Users_ID()
        const appendStr = ''//`/uploadfiles/${users_id}/`

        await getAliyunOssSign({full_path:current_path}).then(res=>{
            console.log(res)
            let {accessid,callback,dir,expire,host,policy,signature} = res.data
            aliyunOssSign = {accessid,callback,dir,expire,host,policy,signature}
        })


        console.log(file,name)

        let formdata = new FormData();

        let get_suffix_val = get_suffix(file.name)

        let new_multipart_params = {
            'key' : aliyunOssSign.dir+formatTime()+random_string(4)+get_suffix_val,
            'policy': aliyunOssSign.policy,
            'OSSAccessKeyId': aliyunOssSign.accessid,
            'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
            'callback' : aliyunOssSign.callback,
            'signature': aliyunOssSign.signature,
        };

        for(var key in new_multipart_params){
            formdata.append(key, new_multipart_params[key]);
        }
        formdata.append('act','up_file_oss');
        formdata.append(name,file);


        return new Promise((resolve, reject) => {


            var xhr = new XMLHttpRequest();
            xhr.open("POST", aliyunOssSign.host, true);
            //监听进度事件
            xhr.upload.addEventListener("progress", function (evt) {
                console.log(evt)
                if (evt.lengthComputable) {
                    var percentComplete = parseInt(evt.loaded / evt.total*100*100)/100;
                    list[idx].percent = percentComplete
                    progress && progress()
                }else{
                    progress && progress()
                }
            });

            xhr.onload = function () {
                // 请求结束后,在此处写处理代码

                resolve('');

            };
            xhr.send(formdata);

        })


    }

    //上传到服务器
    const upFileFnByLocal = async ({file={},current_path,name='image',idx,list=[],progress,extParam={}})=>{


        return new Promise((resolve, reject) => {


            let formdata = new FormData();

            let act = 'uploadFile';//this.type==='video'?'upload_video':'upload_image'
            let param = {
                Users_ID: get_Users_ID(),
                act: act,
                env : 'wx_mp',
                access_token:GET_ACCESS_TOKEN(),
                'full_path':current_path,
                ...extParam
            };
            let ajaxData = createToken(param);


            let new_multipart_params = {
                ...ajaxData
            };

            for(var key in new_multipart_params){
                formdata.append(key, new_multipart_params[key]);
            }

            formdata.append(name,file);

            let reader = new FileReader();
            reader.addEventListener("load", ()=>{

                //上传到服务器上
                Vue.http.post('/api/little_program/shopconfig.php',formdata,{
                    progress:function(event) {

                        let percent = parseInt(event.loaded / event.total * 100)
                        console.log(`upload task upload :${idx}==>${percent}`);
                        if(percent<100){
                            list[idx].percent = percent
                            progress && progress()
                        }else{
                            list[idx].percent = percent
                            // list.splice(idx,1);//去掉
                            progress && progress()
                        }

                    }
                }).then(res=>{

                    resolve(true)
                }).catch(e=>{})


            },false)
            reader.readAsDataURL(file)

        })


    }

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }


    function blobToDataURL(blob, callback) {
        let a = new FileReader();
        a.onload = function (e) { callback(e.target.result); }
        a.readAsDataURL(blob);
    }


    @Component({
        computed:{
            acceptStr(){
                if(_.isArray(this.accept)){
                    return this.accept.join(',')
                }else{
                    return this.accept
                }

            }
        }
    })
    export default class WzwFileButton extends Vue {


        previews = [] //预览的，加载快Bolb
        file_list = [] //线上地址

        @Prop({
            type:String,
            default:''
        })
        current_path
        @Prop({
            type:Boolean,
            default:false
        })
        multiple

        @Prop({
            type:Number,
            default:1
        })
        limit

        @Prop({
            type:String,
            default:'input-comp-file'
        })
        elIdName

        @Prop({
            type:[Array,String],
            default:()=>defaultAllowFileType
        })
        accept //默认上传图片

        @Prop({
            type:String,
            default:'local'
        })
        storage_type //储存模式，可以是aliyun || local 不要用oss，万一后面有其他的呢

        @Prop({
            type:Number,
            default:1024*8 //默认8m
        })
        maxSize //上传文件限制，只有local模式才有

        @Prop({
            type:Object,
            default:()=>{}
        })
        extParam //额外参数，无脑直接和放在服务器上传模式下，参数拼接

        validFileType = (file,fileTypes)=>fileTypes.includes(file)

        selectFile(){
            document.getElementById(this.elIdName).click()
        }

        fileFn(e){
            console.log('native upload event',e)
            let _self = this
            while(this.previews.length>0) {
                this.previews = []

            }
            let curFiles = e.target.files;
            if(curFiles.length === 0) {
                console.log('No files currently selected for upload')
                return;
            }

            if(curFiles.length>this.limit){
                fun.error({msg:`限制一次性最多上传${this.limit}个`})
                return;
            }

            let promiseList = []



            const storage_type = this.storage_type
            const maxSize = this.maxSize


            for(var i = 0; i < curFiles.length; i++){
                let curFileSize = parseInt(curFiles[i].size/1024*100)/100

                //1.服务器模式 2.不是视频类型 才限制大小
                if(storage_type=='local' && this.acceptStr.indexOf('mp4')===-1 && curFileSize>maxSize){
                    fun.error({msg:`文件${curFiles[i].name}大小${curFileSize}kb超出上传限制${maxSize}kb`})
                    continue;
                }
                this.previews.push({
                    size:returnFileSize(curFiles[i].size),
                    name:curFiles[i].name,
                    url:window.URL.createObjectURL(curFiles[i]),
                    percent:0
                })

                if(storage_type=='aliyun'){
                    promiseList.push(upFileFnByAliyunOss({
                        file:curFiles[i],
                        current_path:this.current_path,
                        idx:i,
                        list:this.previews,
                        progress:()=>{
                            this.progress(this.previews)
                        }
                    }))
                }else{
                    promiseList.push(upFileFnByLocal({
                        file:curFiles[i],
                        current_path:this.current_path,
                        name:'image',
                        idx:i,
                        list:this.previews,
                        extParam:this.extParam,
                        progress:()=>{
                          this.progress(this.previews)
                        }
                    }
                    ))

                }

            }

            //input无法点击多次
            document.getElementById(this.elIdName).value = null
            //this.progress(curFiles)

            this.preview(this.previews)

            Promise.all(promiseList).then(urls=>{
                // this.file_list = urls
                //
                this.previews = []
                this.preview([])
                this.success()
            })

        }



        progress(files){
            this.$emit('progress',files)
        }

        preview(arr){

            this.$emit('preview',arr)
        }

        success(){
            this.$emit('done',this.file_list)
        }

    }


</script>

<style lang="less" scoped>
  .input-comp-file{
    position: absolute;z-index: -999;left: -999px;visibility: hidden
  }
</style>
