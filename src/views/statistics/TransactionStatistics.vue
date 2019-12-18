<template>
  <div class="mainVip">
    <div class="firstChart marginB">
      <div class="firstTitle">
        <div class="titleFont">交易数据</div>
        <div class="titleButton">
          <el-button type="primary" size="small">导出数据</el-button>

          <div class="buttonRadio">
            <div class="radioDiv">昨天</div>
            <div class="radioDiv">最近7天</div>
            <div class="radioDiv">最近30天</div>
          </div>

          <el-date-picker
            v-model="value"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            size="small"
            style="width: 280px"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>

        </div>
      </div>
      <div id="firstChart" style="width: 100%;height: 580px"></div>
    </div>



  </div>
</template>

<script lang="ts">
    import {
        Component,
        Vue,
        Watch
    } from 'vue-property-decorator';
    import {
        Action,
        State
    } from 'vuex-class'
    import fa from "element-ui/src/locale/lang/fa";
    import  {getCrowds,addBatch,getGivingCoupons} from '@/common/fetch'
    @Component({
        mixins:[],
        components: {

        }
    })

    export default class TransactionStatistics extends Vue {
        value=''


        show(){
            // 基于准备好的dom，初始化echarts实例
            let firstChart = this.$echarts.init(document.getElementById('firstChart'))
            // 绘制图表
            firstChart.setOption({
                color:['#9AC0F3'],
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    itemStyle : { normal: {label : {show: true}}},
                    smooth: true
                }]
            });


        }
        mounted(){
            this.show()
        }


    }




</script>

<style scoped lang="less">
  .mainVip{
    width: 100%;
    padding: 39px 14% 54px 16%;
    box-sizing: border-box;
  }

  .firstChart{
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #E4E4E4;
  }

  //title
  .firstTitle{
    background-color: #f3f3f3;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    .titleFont{
      font-size: 14px;
      color: #666666;
      height: 50px;
      line-height: 50px;
      padding-left: 21px;
    }
    .titleButton{
      display: flex;
      align-items: center;
      height: 50px;
      padding-right: 30px;
      .selectClass{
        width: 100px;margin-left: 15px;
      }
      .selectDate{
        margin-left: 15px;width: 128px;
      }
      .buttonRadio{
        height: 30px;
        width: 260px;
        border: 1px solid #DCDCDC;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        background-color: #ffffff;
        margin-left: 15px;
        margin-right: 9px;
        .radioDiv{
          width: 86px;
          height: 30px;
          cursor: pointer;
          line-height: 30px;
          text-align: center;
          border-right: 1px solid #DCDCDC;
          font-size: 12px;
          color: #666666;
        }
      }
    }
  }
  .marginB{
    margin-bottom: 30px;
  }
  //title


</style>
