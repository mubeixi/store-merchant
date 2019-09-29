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
          break;

        //空数组
        case 2:
          console.log("请求数据为空数组")
          if (!response.body.data) {
            response.body.data = [];
          }

          break;
        case 20005:
          // if (window.location.href.indexOf('login') < 0) {
          //   sessionStorage.setItem('forward', window.location.href);
          // }
          //
          // setTimeout(function() {
          //   router.replace({ path: '/login' });
          // }, 1000);
          break;

        case 20006:
          // if (window.location.href.indexOf('login') < 0) {
          //   sessionStorage.setItem('forward', window.location.href);
          // }
          // vant.confirm('该操作需要绑定手机', '提示', '马上去', '算了').then(res => {
          //   router.replace({ path: '/bindphone' });
          // }).catch(e => {
          //
          // });

          break;
        case 20007:
          // if (window.location.href.indexOf('login') < 0) {
          //   sessionStorage.setItem('forward', window.location.href);
          // }
          //
          // vant.confirm('该操作需要绑定微信号', '提示', '马上去', '算了').then(res => {
          //   // 如果是微信，就跳转获取微信
          //   if (isWx()) {
          //     vant.loading('需要微信登录', true);
          //     getAuthUrl({ channel: 'wechat_pub_pay' })
          //       .then(response => {
          //         vant.close();
          //         const body = response.body;
          //         if (body.code === 1) {
          //           window.location.replace(body.data);
          //         }
          //       });
          //   }
          //
          //   // 如果是app就微信登陆
          //   if (isPlus()) {
          //     getAuthUrl({ channel: isPlus() ? 'app_all' : 'wap_all' })
          //       .then(res => {
          //         const body = res.body;
          //         if (body.code === 1) {
          //           const authObj = body.data;
          //           unifyAuthFun('wechat_app', authObj.wechat_app).then(res => {
          //             // promise返回的信息，正确则为1
          //             console.log('获取到的信息为' + JSON.stringify(res));
          //             if (res.code === 1) {
          //               var post = res.userInfo;
          //               post.channel = 'wechat_app_bind';
          //               post.state = authObj.wechat_app.state;// 这个参数也必须
          //               getToken(post);
          //             }
          //           }).catch(res => {
          //             console.log('获取信息失败' + res.msg);
          //           });
          //         }
          //       });
          //   }
          // }).catch(e => {
          //
          // });
          //
          // if (!isWx() && !isPlus()) {
          //   vant.alertMsg('请微信或者app中打开');
          //   setTimeout(function() {
          //     router.push({ path: '/index' });
          //   }, 1500);
          // }

          break;
        default:
          fun.error({msg: response.body.msg || '服务器去旅行了'})
        // vant.showMsg(response.body.msg || '请求数据为空或者有误');
      }
    }
  });
}
