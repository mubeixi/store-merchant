import { PLUGINSLIST } from './data';
import { baseApiUrl } from '@/common/env';

export default [
  {
    name: 'num2px',
    methods: (val) => {
      if (val.indexOf('px') == -1) return `${val}px`;
      return val;
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
      if (url.indexOf('http') == -1) return baseApiUrl + url;
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
