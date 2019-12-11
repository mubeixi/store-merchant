import {getUsersInfo} from "@/common/fetch";
import {ls,ss} from '@/common/tool/ls';
import {GetQueryByString} from "@/common/utils";
import Cookies from 'js-cookie';
import {isDev} from "./env";

/**
 * 很多接口都需要user_id,先全局mixin下
 */
export const doLoginMixin = {

  async created() {

    if (isDev) {
      Cookies.set('Users_ID', '25l2nt4kk4')//wkbq6nc2kc
      Cookies.set('Stores_Bind_User_ID', '213')//为了区分其他的user_id，所以弄了这个代表店铺的user_id
      Cookies.set('Stores_ID', '24')
    }

    if(!Cookies.get('Users_ID')){
      this.$fun.error({msg:'需要登录'});
      // setTimeout(function () {
      //   location.href = '/member/login.php';
      // },1000)
    }

  }

}


export const tmplDiyMixin = {

  created: async function () {


    //保存一下两个可能存在的参数
    console.log('设置Skin_ID和Home_ID')
    ss.set('Skin_ID', GetQueryByString(location.href, 'Skin_ID'), true)
    if (GetQueryByString(location.href, 'Skin_ID')) {

    }

    //强制覆盖
    ss.set('Home_ID', GetQueryByString(location.href, 'Home_ID'), true)
    if (GetQueryByString(location.href, 'Home_ID')) {
    }




    //走ss这样会每次重新打开页面，就会获取数据
    if (!ss.get('Shop_Info')) {

      await getUsersInfo({}, {}).then((res:{data:any}) => {
        ss.set('Shop_Info', {
          ShopName: res.data.ShopName,
          ShopLogo: res.data.ShopLogo,
          description: res.data.description,
          prod_total: res.data.prod_total,
          prod_isnew_total: res.data.prod_isnew_total
        })
      }).catch()

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
