import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Diy from './views/Diy.vue';

import Empty from './views/Empty.vue';
import ProductForm from "@/views/ProductForm.vue";
import UserList from '@/views/UserList.vue';
import Marketing from '@/views/Marketing.vue';
import DayMark from '@/views/DayMark.vue';
import LabelManagement from '@/views/LabelManagement.vue'
import LabelAdd from '@/views/LabelAdd.vue'
import CrowdName from '@/views/CrowdName.vue'
import CrowdClient from '@/views/CrowdClient.vue'
import DayMarkDetail from '@/views/DayMarkDetail.vue';
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
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
    }
    ,
    {
      path: '/userList',
      name: 'userlist',
      component: UserList,
    },
    {
      path: '/marketing',
      name: 'marketing',
      component: Marketing,
    },
    {
      path: '/daymark',
      name: 'daymark',
      component: DayMark
    },
    {
      path: '/LabelManagement',
      name: 'LabelManagement',
      component: LabelManagement
    },
    {
      path: '/LabelAdd',
      name: 'LabelAdd',
      component: LabelAdd
    },
    {
      path: '/CrowdName',
      name: 'CrowdName',
      component: CrowdName
    },
    {
      path: '/CrowdClient',
      name: 'CrowdClient',
      component: CrowdClient
    },
    {
      path: '/DayMarkDetail',
      name: 'DayMarkDetail',
      component: DayMarkDetail
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
