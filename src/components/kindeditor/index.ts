
import KindEditor from './kindeditor.vue';

const install = function (Vue) {
  // @ts-ignore
  if (install.installed) return
  // @ts-ignore
  install.installed = true
  Vue.component('wzwEditor', KindEditor)
}

export default install
