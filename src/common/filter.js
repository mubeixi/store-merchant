import { PLUGINSLIST } from './data';

import { baseApiUrl,staticUrl } from './env';
// const staticUrl = process.env.VUE_APP_STATIC_URL

export default [
  {
    name: 'num2px',
    methods: (val) => {
      if (val.indexOf('px') == -1) return `${val}px`;
      return val;
    },
  },
  {
    name:'percent',
    methods: (val) => {
      return parseInt(val*100)/100
    },
  },
  {
    name:'cutstr',
    methods: (str,len,tip) => {
      if(!str)return '';
      console.log(str,len,tip)
      if(str.length<len)return str;
      return str.substring(0,len)+tip
    },
  },
  {
    name: 'domain',
    methods: (url) => {
      if (!url) return '';
      // if (url.indexOf('http') == -1) return process.env.VUE_APP_API_STATIC_URL + url;
      if (url.indexOf('http') == -1) return staticUrl + url;
      return url;
    }
  },
  {
    name: 'getTitleByTag',
    methods: (tag) => {

      for (const group of PLUGINSLIST) {
        for(const plugin of group.list){
          if (plugin.label === tag) {
            return plugin.value;
          }
        }

      }
      // throw '未知组件';
      return '未知组件';
    },
  },
];
