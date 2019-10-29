/**
 * http interceptors
 *
 * @export
 * @param {any} request
 * @param {any} next
 */


import {fun} from "@/common/index";

export default function (request, next) {
  next((response) => {

    if (response.status !== 200) {
      // vant.showMsg('服务器出去旅行了');
    } else {

      window.funLoading && window.funLoading.close();

      switch (+response.body.errorCode) {
        case 0:
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
