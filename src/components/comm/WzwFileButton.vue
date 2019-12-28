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
    import ossImg from 'aliyun-oss-web'
    import {getAliyunOssSign} from '../../common/fetch';
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

    // function fetchProgress(url, opts:any, onProgress){
    //     return new Promise((resolve, reject)=>{
    //         var xhr = new XMLHttpRequest();
    //         xhr.open(opts.method || 'get', url);
    //         for(var key in opts.headers || {}){
    //             xhr.setRequestHeader(key, opts.headers[key]);
    //         }
    //
    //         xhr.onload = e => resolve(e.target.responseText)
    //         xhr.onerror = reject;
    //         if (xhr.upload && onProgress){
    //             xhr.upload.onprogress = onProgress; //上传
    //         }
    //         if ('onprogerss' in xhr && onProgress){
    //             xhr.onprogress = onProgress; //下载
    //         }
    //         xhr.send(opts.body)
    //     })
    // }
    //fetchProgress('/upload').then(console.log)

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

    const upFileFn = async ({file={},current_path,name='file',idx,list=[],progress})=>{

        let aliyunOssSign = null
        await getAliyunOssSign({full_path:current_path}).then(res=>{
            console.log(res)
            let {accessid,callback,dir,expire,host,policy,signature} = res.data

            aliyunOssSign = {accessid,callback,dir,expire,host,policy,signature}
            // accessid: "LTAI4FtENzL44TMGWMjVhxZ2"
            // callback: ""
            // dir: ""
            // expire: 1577432124
            // host: "http://wupengfei.oss-cn-beijing.aliyuncs.com/"
            // policy: "eyJleHBpcmF0aW9uIjoiMjAxOS0xMi0yN1QxNTozNToyNFoiLCJjb25kaXRpb25zIjpbWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMCwxMDQ4NTc2MDAwXSxbInN0YXJ0cy13aXRoIiwiZVAyaDNZN0ZRRUV0eDdlUEM4YkVwWDRCcHNWeDc3IiwiIl1dfQ=="
            // signature: "K4xc2WwaqzgCqO+FjP92opRMpbw="

        })


        console.log(file,name)

        let formdata = new FormData();


        let get_suffix_val = get_suffix(file.name)
        let new_multipart_params = {
            'key' : current_path+random_string(18)+get_suffix_val,
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
                    setTimeout(()=>{
                        list.splice(idx,1);//去掉
                        progress && progress()
                    },500)
                }
            });

            xhr.onload = function () {
                // 请求结束后,在此处写处理代码

                resolve('');

            };
            xhr.send(formdata);

            // await Vue.http.post(aliyunOssSign.host,formdata,{progress:function(event){
            //         //console.log(event);
            //         let percent = parseInt(event.loaded/event.total*100)
            //         file.percent = percent
            //         window.up_progress_list[idx] = percent
            //         ls.set('up_progress_list',window.up_progress_list)
            //
            //     }
            // }).then((res)=>{
            //     rt = true
            // }).catch(err=>{})




            // Vue.$http.post(upFIleUrl,formdata,{'Content-Type':'Multipart/form-data'}).then(response=>{
            //   // this.cancelAddProject()
            //   // this.allRefresh()
            //   if (response.json().status_code === 200) {
            //     this.$broadcast('addOriginal', response.json().data)
            //   }
            //
            // }).catch(res=>{
            //   // todo:AJAXError
            //   // this.processing = false
            //
            // })


            // fetch(upFIleUrl,{
            //     method:'post',
            //     body:formdata
            // })
            // .then(res => {
            //     return res.json()
            // })
            // .then(response=>{
            //     console.log(response)
            //     // 后端至少返回上传图片的URL
            //     let url = response.data.urls[0]
            //     resolve(url);
            // })
            // .catch(err=>{
            //     reject(err)
            // })
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
            type:Array | String,
            default:()=>defaultAllowFileType
        })
        accept //默认上传图片

        validFileType = (file,fileTypes)=>fileTypes.includes(file)

        selectFile(){
            document.getElementById(this.elIdName).click()
        }

        fileFn(e){
            let _self = this
            while(this.previews.length>0) {
                this.previews = []

            }
            let curFiles = e.target.files;
            if(curFiles.length === 0) {
                console.log('No files currently selected for upload')
                return;
            }

            let promiseList = []

            for(var i = 0; i < curFiles.length; i++){
                let url = ''

                this.previews.push({
                    size:returnFileSize(curFiles[i].size),
                    name:curFiles[i].name,
                    url:window.URL.createObjectURL(curFiles[i]),
                    percent:0
                })

                promiseList.push(upFileFn({file:curFiles[i],current_path:this.current_path,idx:i,list:this.previews,progress:()=>{this.preview(this.previews)}}))
            }

            //this.progress(curFiles)

            this.preview(this.previews)

            Promise.all(promiseList).then(urls=>{
                this.file_list = urls

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
