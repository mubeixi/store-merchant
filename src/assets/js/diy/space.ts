import Common from './commonClass'

function attrData(this: any) {
  return [
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
}

class Space extends Common {

  constructor() {
    super()
  }

  tag = 'space';

  //activeIndex = 0;

  style={
    color: ''
  }

  config = {
    type:null
  }

  //value = []

  attrData = attrData.call(this)

  // setIndex(index: Number) {
  //   this.activeIndex = index;
  //   this.attrData = attrData.call(this)
  // }
}

export default Input
