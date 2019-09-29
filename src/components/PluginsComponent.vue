<template>
  <div class="left-template">
    <ul>
      <li :data-label="item.label" draggable="true" :title="item.tip" @dragstart="sourceDrag"
          v-for="(item,key) in plugins">
        <div class="center">
          <img draggable="false" class="icon" :src="item.icon"/>
          <!--          <i data-v-ecfd6a32="" class="iconfont" :class="item.icon"></i>-->
          <p class="text">{{item.value}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {PLUGINSLIST} from '@/common/data';

    @Component
    export default class PluginsComponent extends Vue {
        @Prop() private msg!: string;

        plugins = PLUGINSLIST

        sourceDrag(e: Object): Object {
            console.log(e.target);
            const templateName = e.target.getAttribute('data-label');
            console.log(templateName);
            e.dataTransfer.setData('text/plain', templateName);
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
        border-bottom: 1px solid #f1f1f1;
        box-sizing border-box;
        position: relative;
        float: left;
        cursor: move;

        &:nth-child(3n+3) {
          width: 90px;
          border-right: bottom;
        }

        .center {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
        }

        .icon {
          width: 26px;
          height: 26px;
          opacity: 0.8;
          margin: 0 auto 8px;
          display: block;
          text-align: center;
          font-size: 25px;
          color: #999;

          &:hover {
            opacity: 1;
          }
        }

        i.iconfont {
          width: 36px;
          line-height: 36px;
          margin: 0 auto;
          display: block;
          text-align: center;
          font-size: 25px;
          color: #999;
          cursor: pointer;

          &:hover {
            color: #333
          }
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
