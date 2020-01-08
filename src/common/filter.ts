import { PLUGINSLIST } from './data';
import Vue from 'vue';
import { staticUrl } from './env';

Vue.filter('getTitleByTag',(tag) => {

  for (const group of PLUGINSLIST) {
    for(const plugin of group.list){
      if (plugin.label === tag) {
        return plugin.value;
      }
    }
  }
  return '未知组件';
})

Vue.filter('domain',(url) => {
  if (!url) return '';
  if (url.indexOf('http') == -1) return staticUrl + url;
  return url;
})

Vue.filter('cutstr',(str,len,tip) => {
  if(!str)return '';
  console.log(str,len,tip)
  if(str.length<len)return str;
  return str.substring(0,len)+tip
})

Vue.filter('percent',(val) => parseInt(val*100)/100)

Vue.filter('num2px',(val) => {
  if (val.indexOf('px') == -1) return `${val}px`;
  return val;
})

