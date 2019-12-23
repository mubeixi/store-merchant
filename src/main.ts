/* eslint-disable no-console */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// import './registerServiceWorker';


import VueResource from 'vue-resource';
import Common from './common/index';

//各种方法?
import {doLoginMixin} from "@/common/mixin";
Vue.use(VueResource);

import FunTable from "@/components/widget/FunTable.vue";
Vue.component('fun-table',FunTable);

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// @ts-ignore
Vue.http.options.emulateJSON = true;
// @ts-ignore
Vue.http.options.emulateHTTP = true;

Vue.use(Common);

//symbol icon
require('./assets/js/icon');



Vue.config.productionTip = false;

new Vue({
  mixins: [doLoginMixin],
  router,
  store,
  render: h => h(App),
}).$mount('#app');
