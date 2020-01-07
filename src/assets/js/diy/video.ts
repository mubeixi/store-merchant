import Vue from 'vue';
import Common from './commonClass';

function setValue() {
  // let value = {}
  // Vue.set(this, 'value', value)
}

function setConfig() {
  // 如果新对象，那么可以考虑用默认值替换掉。
  if (JSON.stringify(this.style) === JSON.stringify({
    bgColor: '',
    height: '',
  })) {
    Vue.set(this, 'style', JSON.parse(JSON.stringify(this.styleDefault)));
  }
  // let config = {}
}

function setAttrData() {
  const data = {
    title: '视频设置',
    content: [
      {
        type: 'input',
        text: '视频地址',
        is_video:true,
        inputType: 'text',
        patternFunc(val) {
          const reg = /(http|https):\/\/([\w.]+\/?)\S*/;
          return reg.test(val);
        },
        parrern_tip: '请填写正确的视频地址',
        editType: 'config',
        editKey: 'src',
        model: this.config.src,
      },
      {
        type: 'uploadImg',
        text: '封面图',
        tip: '建议上传尺寸16:9的图片',
        uploadType: 'avatar',
        model: this.config.cover,
        editType: 'config',
        editKey: 'cover',
        editCB: item => item.model,
      },
    ],
  };


  Vue.set(this, 'attrData', data);
}

function attrData(options = {}) {
  // @ts-ignore
  const {value, config, attrData} = options;
  // console.log(value, config, attrData);
  if (value !== false) setValue.call(this);
  if (config !== false) setConfig.call(this);
  if (attrData !== false) setAttrData.call(this);
}

//
class Video extends Common {
  tag = 'video';
  // activeIndex = 0;

  style = {
    //bgColor: '',
    height: '',
  }

  styleDefault = {
    //bgColor: '#fff',
    height: '0',
  }

  config = {
    cover: '',
    src: '',
  }


  constructor() {
    super();

    // 统一这样来初始化
    attrData.call(this);
  }

  // value = []


  setIndex(index: number, options: object) {
    this.activeIndex = index;
    attrData.call(this, options);
  }
}

export default Video;
