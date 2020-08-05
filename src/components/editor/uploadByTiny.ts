
import {
  createToken,
  GET_ACCESS_TOKEN,
  get_Stores_ID,
  get_User_ID,
  get_Users_ID, serves,
  uploadImgByBase64
} from "../../common/fetch";

import {domain} from "../../common/utils";
import {baseApiUrl, isDev} from "../../common/env";
import store from "../../store";
import {fun} from "../../common";
import Vue from "vue";

const act = 'upload_image'

// this.accept = upload_rule['image'].exts
// this.maxSize = upload_rule['image'].size
// this.seconds = upload_rule['media'].seconds

// 上传适配插件所有的操作都在这里面完成
export class uploadByTiny {

  static upload(blobInfo, success, failure, progress) {

    // console.log(blobInfo,arguments)
    var file:any = blobInfo.blob();//转化为易于理解的file对象
    // console.log(file)
    const initData = store.state.initData
    const upload_rule = initData.upload_rule.image



    let curFileSize = Number(file.size/1024*100)/100
    // console.log(curFileSize,upload_rule)
    //1.服务器模式 2.不是视频类型 才限制大小
    if(curFileSize>upload_rule.size){
      const errMsg = `文件${file.name}大小${curFileSize}kb超出上传限制${upload_rule.size}kb`
      fun.error({msg:errMsg})
      failure(errMsg)
      return;
    }

    let reader = new FileReader();
    reader.addEventListener("load", ()=>{
      const param:any = {}

      // console.log(param)
      if (!act) fun.warning({msg:'获取信息失败'});

      var url = `/api/v1/${act}.html` // 替换url

      // @ts-ignore
      param.act = act;
      param.env = 'system';
      // param.Users_Account = get_Users_Account();

      // console.log('生效了')
      // console.log(param.hasOwnProperty('access_token'),'dddddddddddddd')
      if(!param.hasOwnProperty('access_token')){
        // @ts-ignore
        param.access_token = GET_ACCESS_TOKEN()
      }


      if(!param.Users_ID){
        param.Users_ID = get_Users_ID();
      }
      // @ts-ignore
      if(!param.hasOwnProperty('User_ID')){
        param.User_ID = get_User_ID();
      }
      // @ts-ignore
      if(!param.hasOwnProperty('store_id')){
        param.store_id = get_Stores_ID();
      }

      param.image = reader.result

      // console.log(param)
      // 数据加密
      let data = createToken(param);

      //保持签名通过，同时支持传空字符串
      Object.assign(data,param)
      url = (process.env.NODE_ENV === 'production' ? baseApiUrl : '') + url;

      Vue.http.post(
        url,
        data,{
        progress:function(event) {
          // console.log(event)
          let percent = parseInt(event.loaded / event.total * 100)
          console.log(`upload task upload :0==>${percent}`);
          progress(percent)
        },
      }).then(res=>{
        return Promise.resolve(res.data)
      }).then(res=>{
        console.log(res.data.path)
        const path = isDev?domain(res.data.path):res.data.path
        success(path)

      }).catch((err)=>{
        console.log(err)
        failure(err.msg)
      })


    },false)
    reader.readAsDataURL(file)

  }
  abort() {}
}
