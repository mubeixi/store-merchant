import {login} from "@/common/fetch";
import {ls} from '@/common/tool/ls';
import Cookies from 'js-cookie';
import {isDev} from "./env";

/**
 * 很多接口都需要user_id,先全局mixin下
 */
export const doLoginMixin = {
  async created() {

    if(isDev){
      Cookies.set('Users_ID','wkbq6nc2kc')
      return;
    }
    if(!Cookies.get('Users_ID')){
      this.$fun.error({msg:'需要登录'});
      setTimeout(function () {
        location.href = '/member/login.php';
      },1000)
    }

    // if (ls.get('Users_ID') && ls.get('Users_Account')) return;

      // ls.set('Users_ID', Cookies.get('Users_ID'));
      // ls.set('Users_Account', Cookies.get('Users_Account'));

    //先模拟登录一下
    // await login({Account: 'admin', Password: '123456'}).then(res => {
    //   ls.set('Users_ID', res.data.Users_ID);
    //   // ls.set('Users_Account', res.data.Users_Account)
    //
    //   ls.set('Shop_Info', {
    //     ShopName: res.data.ShopName,
    //     ShopLogo: res.data.ShopLogo,
    //     description: res.data.description
    //   })
    // }).catch()
  }

}
