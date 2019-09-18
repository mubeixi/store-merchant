import Common from './commonClass'
import Vue from 'vue'


function setValue() {
  let value = {}
  Vue.set(this, 'value', value)
}

function setConfig() {
  let config = {}
  Vue.set(this, 'config', config)
}

function setAttrData() {

  let data = [
    {
      title: '文字设置',
      content: [
        {
          type: 'color',
          text: '背景颜色',
          model: this.style.color,
          editType: 'style',
          editKey: 'color',
          editCb: (item: { model: any; }) => {

            let val = item.model
            if (!val || val.indexOf(',')==-1) return
            let color = val.split(',')

            color[3] = this.style.transparent.backgroundTransparent / 100 + ')'

            //颜色要修改下，后面透明度会用到
            //this.style.classInput.default['background-color'] = color.join()
            return color.join()
          }
        },
        {
          type: 'radio',
          text: '样式',
          editType: 'config',
          editKey: 'type',
          model: this.config.type,
          value: [
            {
              label: 'solid',
              value: '实线'
            },
            {
              label: 'dashed',
              value: '虚线'
            },
          ]
        },

      ]
    }
  ]

  Vue.set(this, 'attrData', data)
}

function attrData(options = {}) {

  let {value, config, attrData} = options;
  if (value !== false) setValue.call(this);
  if (config !== false) setConfig.call(this);
  if (attrData !== false) setAttrData.call(this);

  if (this.attrData.content) {
    this.attrData.content.map(v => {
      for (let i in v) {
        if (i === 'attrData') {
          v[i].call(this, this, {label: 'classify'})
        }
      }
    })
  }

}

class tmpl extends Common {

  constructor(vm) {
    super()
  }

  tag = 'space';
  //activeIndex = 0;

  style={
    color: '#e7e7e7',
    margin:'4',
    height:'1'
  }

  config = {
    type: 'solid'
  }

  value = {}

  attrData.call(this)

  setIndex(index: Number, options: Object) {
    this.activeIndex = index;
    attrData.call(this, options)
  }
}

export default Hr
