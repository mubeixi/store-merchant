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
      <div class="firstCenter">
        <div class="firstTable">
            <div class="th">
              <div class="td">
                浏览人数
              </div>
              <div class="td">
                下单人数
              </div>
              <div class="td">
                订单数
              </div>
              <div class="td">
                下单件数
              </div>
              <div class="td">
                有效订单数
              </div>
              <div class="td">
                下单金额
              </div>
            </div>
            <div class="tr">
              <div class="td">
                22
              </div>
              <div class="td">
                22
              </div>
              <div class="td">
                222
              </div>
              <div class="td">
                22
              </div>
              <div class="td">
                22
              </div>
              <div class="td">
                ¥222
              </div>
            </div>
            <div class="th">
              <div class="td">
                退款金额
              </div>
              <div class="td">
                付款人数
              </div>
              <div class="td">
                付款订单数
              </div>
              <div class="td">
                付款件数
              </div>
              <div class="td">
                付款金额
              </div>
              <div class="td">
                客单价
              </div>
            </div>
            <div class="tr" style="border-bottom: 0px">
              <div class="td">
                ¥222
              </div>
              <div class="td">
                22
              </div>
              <div class="td">
                222
              </div>
              <div class="td">
                22
              </div>
              <div class="td">
                ¥222
              </div>
              <div class="td">
                ¥222
              </div>
            </div>
        </div>
        <div class="firstDiv">
            <div class="firstDiv-top">
                <div>
                  下单转化率 3.69%
                </div>
                <div>
                  付款转化率 79.33%
                </div>
            </div>
            <div class="firstDiv-center">
              <img src="@/assets/img/orderMbx.png" >
              <span class="firstDiv-spanq">浏览</span>
              <span class="firstDiv-spanw">下单</span>
              <span class="firstDiv-spane">付款</span>
            </div>
            <div class="firstDiv-bottom">
              成交转化率 5.20%
            </div>
        </div>
      </div>
      <div id="firstChart" style="width: 100%;height: 580px"></div>
    </div>


    <div class="firstChart marginB">
      <div class="firstTitle">
        <div class="titleFont">新老客户交易构成</div>
        <div class="titleButton">
          <el-button type="primary" size="small">导出数据</el-button>

          <div class="buttonRadio">
            <div class="radioDiv">本月</div>
            <div class="radioDiv">上月</div>
          </div>

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
      <div class="secondChart">
        <div id="secondChart" style="width: 400px;height: 326px"></div>
        <div class="secondTable">
            <div class="th">
              <div class="td"></div>
              <div class="td" style="width: 160px">付款金额</div>
              <div class="td">较前一个月</div>
              <div class="td">付款人数</div>
              <div class="td">较前一个月</div>
            </div>
            <div class="tr">
              <div class="td">新客户</div>
              <div class="td" style="width: 160px">￥56892.49</div>
              <div class="td">↑ 3.28%</div>
              <div class="td">456</div>
              <div class="td">↑ 3.28%</div>
            </div>
            <div class="tr" style="border-bottom: 0px">
              <div class="td">老客户</div>
              <div class="td" style="width: 160px">￥56892.49</div>
              <div class="td">↑ 3.28%</div>
              <div class="td">456</div>
              <div class="td">↑ 3.28%</div>
            </div>
        </div>
      </div>

    </div>

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
      <div id="threeChart" style="width: 100%;height: 520px"></div>
    </div>


    <div class="firstChart marginB">
      <div class="firstTitle">
        <div class="titleFont">订单来源构成</div>
        <div class="titleButton">
          <el-button type="primary" size="small">导出数据</el-button>

          <div class="buttonRadio">
            <div class="radioDiv">本月</div>
            <div class="radioDiv">上月</div>
          </div>

          <el-date-picker
            @change="fourMehtod"
            v-model="fourTime"
            type="month"
            size="small"
            class="selectDate"
            value-format="yyyy-MM-dd"
            placeholder="选择月">
          </el-date-picker>

        </div>
      </div>
      <div ref="fourChart" style="width: 100%;height: 460px"></div>

      <div class="fourTable">
            <div class="fourTableAll">
                <div class="th">
                  <div class="td"></div>
                  <div class="td">付款金额</div>
                  <div class="td">较前一月</div>
                  <div class="td">付款人数</div>
                  <div class="td">较前一月</div>
                </div>
                <div class="tr">
                  <div class="td">APP端</div>
                  <div class="td">￥56892.49</div>
                  <div class="td">↑ 3.28%</div>
                  <div class="td">55</div>
                  <div class="td">↑ 3.28%</div>
                </div>
                <div class="tr">
                  <div class="td">微信</div>
                  <div class="td">￥56892.49</div>
                  <div class="td">↑ 3.28%</div>
                  <div class="td">55</div>
                  <div class="td">↑ 3.28%</div>
                </div>
            </div>
      </div>

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
    import  {systemOrderFromStatistic} from '@/common/fetch'
    @Component({
        mixins:[],
        components: {

        }
    })

    export default class TransactionStatistics extends Vue {
        value=''


        fourTime=''
        fourOpttion={
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x : 'center',
                y : 'bottom',
                data:[]
            },
            calculable : true,
            series : [
                {
                    name:'付款人数',
                    type:'pie',
                    radius : [20, 110],
                    center : ['25%', '50%'],
                    data:[
                    ]
                },
                {
                    name:'付款金额',
                    type:'pie',
                    radius : [30, 110],
                    center : ['75%', '50%'],
                    data:[]
                }
            ]
        }
        fourMehtod(item){
            let that=this
            let data={
                fourTime:that.fourTime
            }
            systemOrderFromStatistic(data).then(res=>{
                if(res.errorCode==0){
                    let fourChart = that.$echarts.init(this.$refs.fourChart)
                    that.fourOpttion.legend.data=res.data.env
                    that.fourOpttion.series[0].data=res.data.pay_count
                    that.fourOpttion.series[1].data=res.data.pay_money
                    fourChart.setOption(that.fourOpttion);
                }
            })
        }

        show(){
            // 基于准备好的dom，初始化echarts实例
            let firstChart = this.$echarts.init(document.getElementById('firstChart'))
            let secondChart = this.$echarts.init(document.getElementById('secondChart'))
            let threeChart = this.$echarts.init(document.getElementById('threeChart'))
            let fourChart = this.$echarts.init(document.getElementById('fourChart'))
            // 绘制图表
            firstChart.setOption({
                color:['#9AC0F3'],
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一','周二','周三','周四','周五','周六','周日']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'邮件营销',
                        type:'line',
                        stack: '总量',
                        data:[120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name:'联盟广告',
                        type:'line',
                        stack: '总量',
                        data:[220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name:'视频广告',
                        type:'line',
                        stack: '总量',
                        data:[150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name:'直接访问',
                        type:'line',
                        stack: '总量',
                        data:[320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name:'搜索引擎',
                        type:'line',
                        stack: '总量',
                        data:[820, 932, 901, 934, 1290, 1330, 1320]
                    }
                ]
            });

            secondChart.setOption({
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:335, name:'直接访问'},
                            {value:310, name:'邮件营销'},
                            {value:234, name:'联盟广告'},
                            {value:135, name:'视频广告'},
                            {value:1548, name:'搜索引擎'}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
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

        created(){
            this.fourMehtod();
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
        //width: 260px;
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

  .firstCenter{
    width: 100%;
    padding: 31px 69px 31px 41px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 60px;
    .firstTable{
      width: 690px;
      height: 200px;
      font-size: 14px;
      color: #666666;
      border: 1px solid #E4E4E4;
      .th{
        background-color: #F9FAFC;
        height: 50px;
        font-weight: bold;
        display: flex;
        border-bottom: 1px solid #E4E4E4;
      }
      .tr{
        height: 50px;
        display: flex;
        border-bottom: 1px solid #E4E4E4;
      }
      .td{
        width: 115px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-right: 1px solid #E4E4E4;
        &:last-child{
          border-right: 0px;
        }
      }

    }

    .firstDiv{
      width: 344px;
      height: 200px;
      .firstDiv-top{
        width: 344px;
        display: flex;
        align-items: center;
        height: 30px;
        color: #888888;
        font-size: 12px;
        padding-left: 62px;
        padding-right: 54px;
        justify-content: space-between;
        box-sizing: border-box;
        margin-bottom: 5px;
      }
      .firstDiv-center{
        width: 344px;
        height: 143px;
        position: relative;
        font-size: 14px;
        color: #ffffff;
      }
      .firstDiv-spanq{
        position: absolute;
        top: 60px;
        left: 48px;
      }
      .firstDiv-spanw{
        position: absolute;
        top: 60px;
        left: 155px;
      }
      .firstDiv-spane{
        position: absolute;
        top: 60px;
        left: 269px;
      }
      .firstDiv-bottom{
        width: 344px;
        margin-top: 14px;
        height: 11px;
        line-height: 11px;
        text-align: center;
        color: #888888;
        font-size: 12px;
      }
    }
  }

  .secondChart{
    width: 100%;
    height: 326px;
    display: flex;
    justify-content: space-between;
    padding-right: 57px;
    box-sizing: border-box;
    .secondTable{
      border: 1px solid #E4E4E4;
      box-sizing: border-box;
      font-size: 14px;
      color: #666666;
      margin-top: 92px;
      height: 153px;
      .th{
        display: flex;
        font-weight: bold;
        align-items: center;
        background-color: #F9FAFC;
        border-bottom: 1px solid #e4e4e4;
      }
      .tr{
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e4e4e4;
      }
      .td{
        width: 120px;
        height: 50px;
        line-height: 50px;
        border-right: 1px solid #e4e4e4;
        text-align: center;
        &:last-child{
          border-right: 0px;
        }
      }
    }
  }

  .fourTable{
    padding: 50px 84px 69px 84px ;
    width: 100%;
    box-sizing: border-box;
    .fourTableAll{
      width: 100%;
      border: 1px solid #e4e4e4;
      font-size: 14px;
      color: #666666;
      .th{
        height: 50px;
        font-weight: bold;
        background-color: #F9FAFC;
        display: flex;
      }
      .tr{
        height: 50px;
        display: flex;
        border-top: 1px solid #e4e4e4;
      }
      .td{
        width: 20%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-right: 1px solid #e4e4e4;
        &:last-child{
          border-right: 0px;
        }
      }
    }

  }

</style>
