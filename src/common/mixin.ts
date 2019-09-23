import {login} from "@/common/fetch";
import {ls} from '@/common/tool/ls';

/**
 * 很多接口都需要user_id,先全局mixin下
 */
export const doLoginMixin = {
  async created() {
    if(ls.get('Users_ID')&&ls.get('Users_Account'))return;
    //先模拟登录一下
    await login({Account:'admin',Password:'123456'}).then(res=>{
      ls.set('Users_ID',res.data.Users_ID);
      ls.set('Users_Account',res.data.Users_Account)
    }).catch()
  }

}
