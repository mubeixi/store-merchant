/**
 * http interceptors
 *
 * @export
 * @param {any} request
 * @param {any} next
 */


import {fun} from "./index";
import Cookies from 'js-cookie';
import {isDev} from "./env";
export default function (request, next) {

  let {body} = request;
  // console.log(request)
  // if(body.act==='getVaildSign' && new_multipart_params){
  //   for(var key in new_multipart_params)
  //   request.headers.set(key, new_multipart_params[key]);
  // }
  //request.headers.set('token', token); //setting request.headers
  next((response) => {
    if (response.status !== 200) {
      // vant.showMsg('服务器出去旅行了');
    } else {

      window.funLoading && window.funLoading.close();

      //为了阿里云上传不报错，累死了
      //操碎了心
      if(!response.hasOwnProperty('body') || !response.body){
        response.body = {}
        response.body.errorCode = 0
      }
      switch (+response.body.errorCode) {
        case 66001:
          fun.error({msg:response.body.msg})

          if(!isDev){
            //清空cookies
            Cookies.set('Users_ID', '')
            Cookies.set('Stores_Bind_User_ID', '')//为了区分其他的user_id，所以弄了这个代表店铺的user_id
            Cookies.set('Stores_ID', '')
            Cookies.set('access_token', '')

            setTimeout(() => {
              location.href = '/member/login.php';
            },1000)
          }

        break;
        case 0:
        case 100:
          //
          //response = response.body
          break;

        //空数组
        case 2:
          console.log("请求数据为空数组")
          if (!response.body.data) {
            response.body.data = [];
          }

          break;
        case 20005:

          break;

        case 20006:


          break;
        case 20007:

          break;
        default:
          fun.error({msg: response.body.msg || '服务器去旅行了'})
        // vant.showMsg(response.body.msg || '请求数据为空或者有误');
      }

      //console.log(response)
      //return response;

    }
  });
}
