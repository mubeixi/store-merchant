<template>
  <div class="mainVip">
    <div class="firstChart marginB">
      <div class="firstTitle">
        <div class="titleFont">会员增长情况</div>
        <div class="titleButton">
            <el-button type="primary" size="small">导出数据</el-button>

            <el-select v-model="value" placeholder="按月统计" size="small" class="selectClass">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

            <el-date-picker
              v-model="value"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              class="selectDate"
              size="small"
              >
            </el-date-picker>
        </div>
      </div>
      <div id="firstChart" style="width: 100%;height: 580px"></div>
    </div>

    <div class="firstChart marginB">
      <div class="firstTitle">
        <div class="titleFont">会员端口来源</div>
        <div class="titleButton">
          <el-button type="primary" size="small">导出数据</el-button>

          <el-select v-model="value" placeholder="按月统计" size="small" class="selectClass">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <el-date-picker
            v-model="value"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            class="selectDate"
            size="small"
          >
          </el-date-picker>
        </div>
      </div>
      <div id="secondChart" style="width: 100%;height: 580px"></div>
    </div>

    <div class="firstChart marginB">
      <div class="firstTitle">
        <div class="titleFont">会员消费金额</div>
        <div class="titleButton">
          <el-button type="primary" size="small">导出数据</el-button>

          <el-select v-model="value" placeholder="按月统计" size="small" class="selectClass">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <el-date-picker
            v-model="value"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            class="selectDate"
            size="small"
          >
          </el-date-picker>
        </div>
      </div>
      <div id="threeChart" style="width: 100%;height: 580px"></div>
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

    export default class VipStatistics extends Vue {
        value=''


        show(){
            // 基于准备好的dom，初始化echarts实例
            let firstChart = this.$echarts.init(document.getElementById('firstChart'))
            let secondChart = this.$echarts.init(document.getElementById('secondChart'))
            let threeChart = this.$echarts.init(document.getElementById('threeChart'))
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

            secondChart.setOption({
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    x : 'center',
                    y : 'bottom',
                    data:['rose1','rose2','rose3','rose4','rose5','rose6','rose7','rose8']
                },
                calculable : true,
                series : [
                    {
                        name:'面积模式',
                        type:'pie',
                        radius : [30, 110],
                        center : ['50%', '50%'],
                        //roseType : 'area', 突出饼状图
                        data:[
                            {value:10, name:'rose1'},
                            {value:5, name:'rose2'},
                            {value:15, name:'rose3'},
                            {value:25, name:'rose4'},
                            {value:20, name:'rose5'},
                            {value:35, name:'rose6'},
                            {value:30, name:'rose7'},
                            {value:40, name:'rose8'}
                        ]
                    }
                ]
            })

            threeChart.setOption({
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'直接访问',
                        type:'bar',
                        barWidth: '60%',
                        data:[10, 52, 200, 334, 390, 330, 220]
                    }
                ]
            })
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
  background-color: #E4E4E4;
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
  }
}
  .marginB{
    margin-bottom: 30px;
  }
  //title


</style>
