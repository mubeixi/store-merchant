<template>
  <div class="left-template-box">
    <div v-for="(group,idx) in plugins">
      <div class="dt">{{group.groupTitle}}</div>
      <ul>
        <li :data-label="item.label" draggable="true" :title="item.tip" @dragstart="sourceDrag"
            v-for="(item,key) in group.list">
          <div class="center">
            <img draggable="false" class="icon" :src="item.icon" />
            <img draggable="false" class="icona" :src="item.icona" />
            <div class="text">{{item.value}}</div>
          </div>
        </li>

      </ul>
    </div>
    <div style="height: 70px;"></div>

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
            // console.log(e.target);
            const templateName = e.target.getAttribute('data-label');
            // console.log(templateName);
            e.dataTransfer.setData('text/plain', templateName);
        }
    }
</script>

<style scoped lang="less">
  .dl{

    .dt{

    }
    .dd{

    }
  }

  .dt{
    padding: 15px 0;
    width: 162px;
  }
  .left-template-box::-webkit-scrollbar{
    display: none;
    width: 0;
  }
  .left-template-box {
    /*width: 162px;*/
    padding: 0;
    background-color:white;
    height: 100vh;//calc(100% - 70px);
    /*overflow :hidden;*/
    /*margin-bottom: 70px;*/
    overflow-y: auto;
    //box-shadow 0 0 10px rgba(0, 0, 0, 0.12);

    h5 {
      padding: 10px 0;
    }

    ul {
      padding : 0;

      display: block;
      margin :0px;
      width :162px;


      li {
        /*cursor pointer*/
        width :50%;
        height :90px;
        /*border-right 1px solid #f1f1f1
        border-bottom 1px solid #f1f1f1*/

        box-sizing :border-box;
        position :relative;
        display :inline-block;
        /*float left*/
        cursor :move;
        &:hover{

          background: #409EFF;


          .text{
            color:white;
            //color: #333;
          }

          .center{
            /*background: green;*/
            .icon{
              display: none
            }
            .icona{
              display: block;
            }
          }


        }




        .center {
          position: absolute;
          left: 0;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          width: 100%;
          .icona{
            display: none;
            width: 26px;
            height: 26px;
            /*opacity: 0.8;*/
            margin: 0 auto 8px;
            text-align: center;
            font-size: 25px;

          }
        }



        .icon {
          width: 26px;
          height: 26px;
          /*opacity: 0.8;*/
          margin: 0 auto 8px;
          display: block;
          text-align: center;
          font-size: 25px;
          //color: #999;


        }

        /*i.iconfont {*/
        /*  width: 36px;*/
        /*  line-height: 36px;*/
        /*  margin: 0 auto;*/
        /*  display: block;*/
        /*  text-align: center;*/
        /*  font-size: 25px;*/

        /*  cursor: pointer;*/

        /*  &:hover {*/

        /*  }*/
        /*}*/

        .text {
          text-align: center;
          font-size: 14px;
          color: #777;
          margin-top: 6px;
          line-height: 1;
        }
      }
    }
  }
</style>
