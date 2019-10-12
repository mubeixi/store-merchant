import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Home2 from './views/Home2.vue';
import Hello from './views/Hello.vue';
import Empty from './views/Empty.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/style2',
      name: 'Home',
      component: Home2,
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello,
    },
    {
      path: '/empty',
      name: 'empty',
      component: Empty,
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
