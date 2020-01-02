
import {uploadImgByBase64} from "../../common/fetch";
import {domain} from "../../common/utils";
import {isDev} from "../../common/env";
const initData = window.initData
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
