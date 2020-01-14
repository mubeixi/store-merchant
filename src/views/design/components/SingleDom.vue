<template>
    <div class="single-dom js-single-dom"
         :class="classStr"
         :style="styleStr"
    >
      <template v-if="node.tag == 'img'">
        <img
            class="single-dom-img"
           :src="node.attr.src"
        />
      </template>
      <template v-else-if="node.tag == 'headimg'">
        <!--占位图-->
        <img
          class="single-dom-img"
          style="border-radius: 50%;"
          src="https://iph.href.lu/100x100?text=头像"
        />
      </template>
      <template v-else-if="node.tag == 'text'">
        <span
          class="single-dom-text"
        >
          {{node.attr.text}}
        </span>
      </template>
      <template v-else-if="node.tag == 'nickname'">
        <span
          class="single-dom-text"
        >
          用户昵称
        </span>
      </template>
      <template v-else-if="node.tag == 'time'">
        <span
          class="single-dom-text"
        >
          当前时间
        </span>
      </template>

      <template v-else><span class="text-center graytext2 font14 padding15">组件渲染错误</span></template>
    </div>
</template>

<script lang="ts">
    import {
      Vue,
      Prop,
      Component
    } from 'vue-property-decorator';

    @Component({
      computed:{
        classStr(){
          return ''
        },
        styleStr(){
          const classObj = Object.assign({},this.node.style,this.node.position)
          let str = ''
          //遍历属性
          for(let key in classObj){
            if(classObj[key] || classObj[key]===0 || classObj[key]==='0')str += `${key}:${classObj[key]};`
          }
          return str;
        }
      }
    })

    export default class SingleDom extends Vue{
      @Prop({
        type: Object,
        default:()=>{
          return {style:{},position:{}}
        }
      })
      node

    }
</script>

<style lang="less" scoped>
.single-dom{
  position: absolute;
  .single-dom-img{
    max-width: 100%;
  }
  .single-dom-text{

  }
}
</style>
