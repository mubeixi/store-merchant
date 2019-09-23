import { PLUGINSLIST } from './data';

export default [
  {
    name: 'num2px',
    methods: (val) => {
      if (val.indexOf('px') == -1) return `${val}px`;
      return val;
    },
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
