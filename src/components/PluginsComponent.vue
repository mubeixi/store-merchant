<template>
  <div class="left-template">
    <ul>
      <li :data-label="item.label" draggable="true" @dragstart="sourceDrag" v-for="(item,key) in plugins">
        <div class="center">
          <i data-v-ecfd6a32="" class="iconfont" :class="item.icon"></i>
          <p class="text">{{item.value}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {PLUGINSLIST} from "@/common/data";

@Component
export default class PluginsComponent extends Vue {
  @Prop() private msg!: string;
  plugins = PLUGINSLIST

  sourceDrag(e: Object): Object{

      var templateName = e.target.getAttribute('data-label')
      //console.log(templateName)
      e.dataTransfer.setData('text/plain', templateName)

  }


}
</script>

<style scoped lang="stylus">
  .left-template {
    background-color: white;
    min-height: 100%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.12);
    h5 {
      padding: 10px 0;
    }
    ul {
      padding: 1px 0;
      overflow: hidden;
      li {
        /*cursor: pointer;*/
        width: 91px;
        height: 100px;
        border-right: 1px solid #f1f1f1;
        border-bottom :1px solid #f1f1f1;
        box-sizing border-box;
        position: relative;
        float: left;
        &:nth-child(3n+3){
          width: 90px;
          border-right:bottom;
        }
        .center {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
        }
        i.iconfont {
          width: 36px;
          line-height: 36px;
          margin: 0 auto;
          display: block;
          text-align: center;
          font-size: 25px;
        }
        p {
          text-align: center;
          font-size: 14px;
          color: #333;
          margin-top: 6px;
          line-height: 1;
        }
      }
    }
  }
</style>
