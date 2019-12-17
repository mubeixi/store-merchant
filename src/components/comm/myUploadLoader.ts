// const url = 'http://dev.jingjin.site/api/tool/upload'
import {uploadFileFn,uploadImgByBase64} from "../../common/fetch";
import Vue from 'vue';
import {domain} from "../../common/utils";
import {isDev} from "../../common/env";

// 上传适配插件所有的操作都在这里面完成
export class myUploadLoader {
  loader:any
  constructor(loader:any) {
    this.loader = loader;
  }
  upload() {
    return this.loader.file.then((file:any) =>new Promise((resolve, reject) => {

        //方法一：
        let reader = new FileReader();
        reader.addEventListener("load", ()=>{
            uploadImgByBase64({image:reader.result}).then(res=>{
              console.log(res.data.path)
              resolve({
                default:isDev?domain(res.data.path):res.data.path
                // default:domain(res.data.path)
              })
            }).catch(e=>{})
          },false)
        reader.readAsDataURL(file)

        //方法二：
        // 这里面写的就是上传请求，只需要最终结果调用 resolve 方法
        // 并且返回一个至少包含 default : imgUrl 的对象,
        // 例如：{default:'http://abc.com/a/b.png'}
        // let formdata = new FormData();
        // formdata.append('image',file);


        // fetch(url,{
        //   method:'post',
        //   body:formdata
        // })

      // uploadFileFn(formdata,{headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }})
      // uploadFileFn({formdata:formdata}, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // }).then(response=>{
      //       console.log(response)
      //       // 后端至少返回上传图片的URL
      //       // let url = response.data.urls[0]
      //       // resolve({
      //       //   default: url
      //       // });
      //     })
      //     .catch(err=>{
      //       reject(err)
      //     })
      })
    );
  }
  abort() {}
}
