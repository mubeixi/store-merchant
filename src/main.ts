import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

import VueResource from 'vue-resource';
Vue.use(VueResource);

// @ts-ignore
Vue.http.options.emulateJSON = true;
// @ts-ignore
Vue.http.options.emulateHTTP = true;

import Common from './common/index';
Vue.use(Common);



Vue.config.productionTip = false;

//各种方法?
import {doLoginMixin} from "@/common/mixin";

new Vue({
  mixins: [doLoginMixin],
  router,
  store,
  render: h => h(App),
}).$mount('#app');
