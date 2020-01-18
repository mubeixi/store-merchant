/* eslint-disable no-console */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';


import VueResource from 'vue-resource';
import Common from './common/index';

//各种方法?
import {doLoginMixin} from "@/common/mixin";
Vue.use(VueResource);

import FunTable from "@/components/widget/FunTable.vue";
Vue.component('fun-table',FunTable);

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import vuescroll from 'vuescroll/dist/vuescroll-native';
import 'vuescroll/dist/vuescroll.css';
Vue.use(vuescroll);


// @ts-ignore
Vue.http.options.emulateJSON = true;
// @ts-ignore
Vue.http.options.emulateHTTP = true;

Vue.use(Common);

//symbol icon
require('./assets/js/icon');

//懒加载
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  loading: require('@/assets/img/img-lazy.png'),//加载中图片，一定要有，不然会一直重复加载占位图
  error: require('@/assets/img/goods-lazy.png')  //加载失败图片
});


Vue.config.productionTip = false

// Vue.config.keyCodes = {
//   up: [38],
//   down:[40],
//   left:[37],
//   right:[39]
// }

new Vue({
  mixins: [doLoginMixin],
  router,
  store,
  render: h => h(App),
}).$mount('#app');
