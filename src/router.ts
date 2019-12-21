import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

import Page from '@/views/PageTmpl.vue';

import Home from './views/Home';
import Diy from './views/Diy';
import Empty from './views/Empty';
import ProductForm from "@/views/ProductForm.vue";
import UserList from '@/views/UserList.vue';
import Marketing from '@/views/Marketing.vue';
import DayMark from '@/views/DayMark.vue';
import LabelManagement from '@/views/LabelManagement.vue'
import LabelAdd from '@/views/LabelAdd.vue'
import CrowdName from '@/views/CrowdName.vue'
import CrowdClient from '@/views/CrowdClient.vue'
import DayMarkDetail from '@/views/DayMarkDetail.vue';
import StoreChannel from '@/views/StoreChannel.vue';
import StorePurchase from '@/views/StorePurchase.vue';
import SystemNotice from '@/views/SystemNotice.vue';
import StorePurchaseApply from './views/StorePurchaseApply.vue';
import StorePurchaseBack from './views/StorePurchaseBack.vue';

import MessageSend from '@/views/MessageSend.vue';
import MessageStationSend from '@/views/MessageStationSend.vue';
import CouponGift from '@/views/CouponGift.vue';
import GiftsGift from '@/views/GiftsGift.vue';
import NotFound from '@/views/NotFound.vue';
import ProductList from '@/views/ProductList.vue';
import StoreProductList from '@/views/StoreProductList.vue';
import DistributorLevel from '@/views/DistributorLevel.vue';
import Rotate from '@/views/Rotate.vue';
import RotateList from '@/views/RotateList.vue';
import ProductStatistics from '@/views/statistics/ProductStatistics.vue'
import VipStatistics from '@/views/statistics/VipStatistics.vue'
import TransactionStatistics from '@/views/statistics/TransactionStatistics.vue'

import Contribute from '@/views/distributor/Contribute.vue';
import ContributeDetail from '@/views/distributor/ContributeDetail.vue';


const routerInstance = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },

    {
      path:'/StorePurchaseApply',
      name:'StorePurchaseApply',
      component: StorePurchaseApply,
      meta:{
        title:'进货记录'
      }
    },
    {
      path:'/StorePurchaseBack',
      name:'StorePurchaseBack',
      component: StorePurchaseBack,
      meta:{
        title:'退货记录'
      }
    },
    {
      path:'/StoreChannel',
      name:'StoreChannel',
      component: StoreChannel,
      meta:{
        title:'选择进货渠道'
      }
    },
    {
      path:'/SystemNotice/:id',
      name:'SystemNotice',
      component: SystemNotice,
      meta:{
        title:'系统公告'
      }
    },
    {
      path:'/StorePurchase',
      name:'StorePurchase',
      component: StorePurchase,
      meta:{
        title:'进货'
      }
    },
    {
      path: '/diy',
      name: 'DIY',
      component: Diy,
    },
    {
      path: '/empty',
      name: 'empty',
      component: Empty,
    },
    {
      path: '/ProductForm',
      name: 'product',
      component: ProductForm,
      meta:{
        title:'发布商品'
      }
    }
    ,
    {
      path: '/userList',
      name: 'userlist',
      component: UserList,
    },
    {
      path: '/Marketing',
      name: 'Marketing',
      component: Marketing,
    },
    {
      path: '/DayMark',
      name: 'DayMark',
      component: DayMark
    },
    {
      path: '/LabelManagement',
      name: 'LabelManagement',
      component: LabelManagement,
      meta:{
        title:'标签列表'
      }

    },
    {
      path: '/LabelAdd',
      name: 'LabelAdd',
      component: LabelAdd,
      meta:{
        title:'添加标签'
      }
    },
    {
      path: '/CrowdName',
      name: 'CrowdName',
      component: CrowdName,
      meta:{
        title:'添加人群'
      }
    },
    {
      path: '/CrowdClient',
      name: 'CrowdClient',
      component: CrowdClient,
      meta:{
        title:'人群列表'
      }
    },
    {
      path: '/DayMarkDetail',
      name: 'DayMarkDetail',
      component: DayMarkDetail
    },
    {
      path: '/MessageSend',
      name: 'MessageSend',
      component: MessageSend,
      meta:{
        title:'群发短信'
      }
    },
    {
      path: '/MessageStationSend',
      name: 'MessageStationSend',
      component: MessageStationSend,
      meta:{
        title:'群发站内信'
      }
    },
    {
      path: '/CouponGift',
      name: 'CouponGift',
      component: CouponGift,
      meta:{
        title:'赠送优惠券'
      }
    },
    {
      path: '/GiftsGift',
      name: 'GiftsGift',
      component: GiftsGift,
      meta:{
        title:'赠送赠品'
      }
    },
    {
      path: '/NotFound',
      name: 'NotFound',
      component: NotFound,
      meta:{
        title:'NotFound'
      }
    },
    {
      path: '/ProductList',
      name: 'ProductList',
      component: ProductList,
      meta:{
        title:'商品列表'
      }
    },
    {
      path: '/StoreProductList',
      name: 'StoreProductList',
      component: StoreProductList,
      meta:{
        title:'门店商品列表'
      }
    },
    {
      path:'/distributor',
      component:Page,
      meta:{
        title:'分销'
      },
      children:[
        {
          path:'contributeList',
          component:Contribute,
          meta:{
            title:'分销贡献'
          }
        },
        {
          path:'contributeDeatil',
          name:'DistributorContribute',
          component:ContributeDetail,
          meta:{
            title:'分销贡献详情'
          }
        }
      ]
    },
    {
      path: '/DistributorLevel',
      name: 'DistributorLevel',
      component: DistributorLevel,
      meta:{
        title:'分销商级别设置'
      }
    },
    {
      path: '/Rotate',
      name: 'Rotate',
      component: Rotate,
      meta:{
        title:'幸运大抽奖'
      }
    },
    {
      path: '/RotateList',
      name: 'RotateList',
      component: RotateList,
      meta:{
        title:'幸运大抽奖列表'
      }
    },
    {
      path: '/ProductStatistics',
      name: 'ProductStatistics',
      component: ProductStatistics,
      meta:{
        title:'商品统计'
      }
    },
    {
      path: '/VipStatistics',
      name: 'VipStatistics',
      component: VipStatistics,
      meta:{
        title:'会员统计'
      }
    },
    {
      path: '/TransactionStatistics',
      name: 'TransactionStatistics',
      component: TransactionStatistics,
      meta:{
        title:'交易统计'
      }
    },
    {
      path: '*',
      redirect:'/NotFound'
    }



    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    // },
  ],
});
routerInstance.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export default routerInstance
