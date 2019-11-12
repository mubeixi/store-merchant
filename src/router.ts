import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Diy from './views/Diy.vue';
import AddProduct from './views/ProductAdd.vue';
import Empty from './views/Empty.vue';
import ProductAdd from "@/views/ProductAdd.vue";

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
      path: '/productAdd',
      name: 'product',
      component: ProductAdd,
    },
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
