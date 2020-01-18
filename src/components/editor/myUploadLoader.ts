
import {uploadImgByBase64} from "../../common/fetch";
import {domain} from "../../common/utils";
import {isDev} from "../../common/env";
import store from "../../store";
import {fun} from "../../common";

// this.accept = upload_rule['image'].exts
// this.maxSize = upload_rule['image'].size
// this.seconds = upload_rule['media'].seconds

// 上传适配插件所有的操作都在这里面完成
export class myUploadLoader {
  loader:any
  constructor(loader:any) {
    this.loader = loader;
  }
  upload() {
    return this.loader.file.then((file:any) =>new Promise((resolve, reject) => {



      const initData = store.state.initData

      const upload_rule = initData.upload_rule.image

      let curFileSize = parseInt(file.size/1024*100)/100
      console.log(curFileSize,upload_rule)
      //1.服务器模式 2.不是视频类型 才限制大小
      if(curFileSize>upload_rule.size){
        fun.error({msg:`文件${file.name}大小${curFileSize}kb超出上传限制${upload_rule.size}kb`})
        reject(false)
        return;
      }
        //方法一：
        let reader = new FileReader();
        reader.addEventListener("load", ()=>{


          //阿里云
          uploadImgByBase64({image:reader.result}).then(res=>{
            console.log(res.data.path)
            resolve({
              default:isDev?domain(res.data.path):res.data.path
              // default:domain(res.data.path)
            })
          }).catch(e=>{})


          },false)
        reader.readAsDataURL(file)

      })
    );
  }
  abort() {}
}
