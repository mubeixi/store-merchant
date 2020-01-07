import Vue from 'vue';
import Vuex from 'vuex';
import state from './store/state';
import * as actions from './store/actions';
import * as mutations from './store/mutations';
import system from './store/modules/system'

Vue.use(Vuex);

export default new Vuex.Store({
  modules:{
    system
  },
  state,
  mutations,
  actions,
});
