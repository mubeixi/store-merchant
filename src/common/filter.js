import { PLUGINSLIST } from './data';
import {baseApiUrl} from '@/common/env';

export default [
  {
    name: 'num2px',
    methods: (val) => {
      if (val.indexOf('px') == -1) return `${val}px`;
      return val;
    },
  },
  {
    name:'domain',
    methods:(url) => {
      if(!url)return '';
      if (url.indexOf('http') == -1) return baseApiUrl+url;
      return url;
    }
  },
  {
    name: 'getTitleByTag',
    methods: (tag) => {
      for (const plugin of PLUGINSLIST) {
        if (plugin.label === tag) {
          return plugin.value;
        }
      }
      // throw '未知组件';
      return '未知组件';
    },
  },
];