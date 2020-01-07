<template>
  <div class="mainVip">
    <div class="firstChart marginB">
      <div class="firstTitle">
        <div class="titleFont">交易数据</div>
        <div class="titleButton">
          <el-button type="primary" size="small" @click="firstMethod('output')">导出数据</el-button>

          <div class="buttonRadio">
            <div class="radioDiv" :class="f_current == 1 ? 'selected' : ''" @click="firstDayChange(1)">昨天</div>
            <div class="radioDiv" :class="f_current == 2 ? 'selected' : ''" @click="firstDayChange(7)">最近7天</div>
            <div class="radioDiv" :class="f_current == 3 ? 'selected' : ''" @click="firstDayChange(30)">最近30天</div>
          </div>

          <el-date-picker
            v-model="first_time"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            size="small"
            @change="firstMethod('time_change')"
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
                {{firstData.view_person_count && firstData.view_person_count.value || 0}}
              </div>
              <div class="td">
                {{firstData.order_person_count && firstData.order_person_count.value || 0}}
              </div>
              <div class="td">
                {{firstData.order_count && firstData.order_count.value || 0}}
              </div>
              <div class="td">
                {{firstData.order_pro_count && firstData.order_pro_count.value || 0}}
              </div>
              <div class="td">
                {{firstData.order_valid_count && firstData.order_valid_count.value || 0}}
              </div>
              <div class="td">
                ￥{{firstData.order_money && firstData.order_money.value || 0}}
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
                ¥{{firstData.order_back_money && firstData.order_back_money.value || 0}}
              </div>
              <div class="td">
                {{firstData.order_pay_person_count && firstData.order_pay_person_count.value || 0}}
              </div>
              <div class="td">
                {{firstData.order_pay_count && firstData.order_pay_count.value || 0}}
              </div>
              <div class="td">
                {{firstData.order_pay_pro_count && firstData.order_pay_pro_count.value || 0}}
              </div>
              <div class="td">
                ¥{{firstData.order_pay_money && firstData.order_pay_money.value || 0}}
              </div>
              <div class="td">
                ¥{{firstData.order_avg_money && firstData.order_avg_money.value || 0}}
              </div>
            </div>
        </div>
        <div class="firstDiv">
            <div class="firstDiv-top">
                <div>
                  下单转化率 {{firstData.order_rate && firstData.order_rate.value || 0}}%
                </div>
                <div>
                  付款转化率 {{firstData.order_pay_rate && firstData.order_pay_rate.value || 0}}%
                </div>
            </div>
            <div class="firstDiv-center">
              <img src="@/assets/img/orderMbx.png" >
              <span class="firstDiv-spanq">浏览</span>
              <span class="firstDiv-spanw">下单</span>
              <span class="firstDiv-spane">付款</span>
            </div>
            <div class="firstDiv-bottom">
              成交转化率 {{firstData.order_clinch_rate && firstData.order_clinch_rate.value || 0}}%
            </div>
        </div>
      </div>
      <div ref="firstChartRef" style="width: 100%;height: 580px"></div>
    </div>


    <div class="firstChart marginB">
      <div class="firstTitle">
        <div class="titleFont">新老客户交易构成</div>
        <div class="titleButton">
          <el-button type="primary" size="small" @click="secondMethod('output')">导出数据</el-button>

          <div class="buttonRadio">
            <div class="radioDiv" :class="s_current == 1 ? 'selected' : ''" @click="momentMonth('second')">本月</div>
            <div class="radioDiv" :class="s_current == 2 ? 'selected' : ''" @click="prevMonth('second')">上月</div>
          </div>

          <el-date-picker
            v-model="second_time"
            type="month"
            @change="s_current=3"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            class="selectDate"
            size="small"
          >
          </el-date-picker>

        </div>
      </div>
      <div class="secondChart">
        <div ref="secondChart" style="width: 400px;height: 326px"></div>
        <div class="secondTable">
            <div class="th">
              <div class="td"></div>
              <div class="td" style="width: 160px">付款金额</div>
              <div class="td">较前一个月</div>
              <div class="td">付款人数</div>
              <div class="td">较前一个月</div>
            </div>
            <div class="tr" v-for="(item,index) in secondList" :key="index">
              <div class="td">{{item.title}}</div>
              <div class="td" style="width: 160px">￥{{item.pay_money}}</div>
              <div class="td">{{item.pay_money_compare > 0 ? '↑':(item.pay_money_compare ==0?'': '↓')}} {{item.pay_money_compare}}%</div>
              <div class="td">{{item.pay_count}}</div>
              <div class="td">{{item.pay_count_compare > 0 ? '↑': (item.pay_money_compare ==0?'': '↓')}} {{item.pay_count_compare}}%</div>
            </div>
        </div>
      </div>

    </div>

    <div class="firstChart marginB">
      <div class="firstTitle">
        <div class="titleFont">交易数据</div>
        <div class="titleButton">
          <el-button type="primary" size="small" @click="threeMethod('output')">导出数据</el-button>

          <div class="buttonRadio">
            <div class="radioDiv" :class="q_current == 1 ? 'selected' : ''" @click="threeDayChange(1)">昨天</div>
            <div class="radioDiv" :class="q_current == 2 ? 'selected' : ''" @click="threeDayChange(7)">最近7天</div>
            <div class="radioDiv" :class="q_current == 3 ? 'selected' : ''" @click="threeDayChange(30)">最近30天</div>
          </div>

          <el-date-picker
            v-model="three_time"
            type="daterange"
            @change="threeMethod('time')"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            size="small"
            style="width: 280px"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>

        </div>
      </div>
      <div ref="threeChart" style="width: 100%;height: 520px"></div>
    </div>


    <div class="firstChart marginB">
      <div class="firstTitle">
        <div class="titleFont">订单来源构成</div>
        <div class="titleButton">
          <el-button type="primary" size="small" @click="fourMehtod('output')">导出数据</el-button>

          <div class="buttonRadio">
            <div class="radioDiv" :class="w_current == 1 ? 'selected' : ''"  @click="momentMonth">本月</div>
            <div class="radioDiv" :class="w_current == 2 ? 'selected' : ''"  @click="prevMonth">上月</div>
          </div>

          <el-date-picker
            @change="fourMehtod('time')"
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
                <div class="tr" v-for="(item,index) in fourlist" :key="index">
                  <div class="td">{{item.env_desc}}</div>
                  <div class="td">￥{{item.pay_money}}</div>
                  <div class="td">{{item.pay_money_compare > 0 ? '↑' : '↓'}} {{item.pay_money_compare}}%</div>
                  <div class="td">{{item.pay_count}}</div>
                  <div class="td">{{item.pay_count_compare > 0 ? '↑' : '↓'}} {{item.pay_count_compare}}%</div>
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
    import  {systemOrderFromStatistic,systemSalesStatistic,getNewOldTradeStatistic,getTradeStatistic} from '@/common/fetch'
    @Component({
        mixins:[],
        components: {

        }
    })

    export default class TransactionStatistics extends Vue {
        f_current = 0
        s_current = 1
        q_current=0
        w_current=1
        first_time = []
        firstData = {}
        // 绘制图表
        firstChart = {
            color:['#ED84B8','#F1C087','#AB7CED','#89C98C','#787D88','#9AC0F3','#A4ADBD','#A3B1C9','#ED8493','#85E8E8','#6E7788'],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 'center',
                y: '540px;',
                data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
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
            yAxis: [{
              type: 'value',
              min: 0,
              max: 100
            }, {
              type: 'value',
              name: '转化率(%)',
              min: 0,
              max: 10000,
            }],
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
        };
        // 时间调整
        firstDayChange(number) {
          if(number == 1) {
            this.f_current = 1;
          }else if(number == 7) {
            this.f_current = 2
          }else {
            this.f_current = 3
          }
          let date = new Date();
          let yestdayTime = date.getTime() - number * 24 * 3600 * 1000
          let year = new Date(yestdayTime).getFullYear();
          let month = new Date(yestdayTime).getMonth() + 1;
          let day = new Date(yestdayTime).getDate();
          let lastTime = year + '-' + this.add0(month) + '-' + this.add0(day)
          this.first_time = [];
          this.first_time[0] = lastTime;
          this.first_time[1] = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
          this.firstMethod('');
        }
        firstMethod(arg){
          let that = this;
          let data = {
            start_time: this.first_time[0] || '',
            end_time: this.first_time[1] || '',
            output: arg == 'output' ? 1 : 0
          }
          if(arg == 'time_change') {
            this.f_current = 0;
          }
          getTradeStatistic(data).then(res=>{
            if(arg == 'output') {
              res.data.file_path && window.open(res.data.file_path,'_self');
            }else {
              let first_chart = that.$echarts.init(that.$refs.firstChartRef)
              that.firstChart.legend.data = res.data.titles;
              that.firstChart.xAxis.data = res.data.time_list;
              that.firstChart.series = res.data.charts;
              that.firstData = res.data.data;
              that.firstChart.yAxis[1].max = res.data.max_rate;
              that.firstChart.yAxis[1].interval = parseInt(res.data.max_rate ) / 5;
              that.firstChart.yAxis[0].max = res.data.max_num;
              that.firstChart.yAxis[0].interval = parseInt(res.data.max_num ) / 5;

              first_chart.setOption(that.firstChart);
            }
          })
        }
        secondChart = {
          color: ['#9AC0F3','#F1C087'],
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            x: "right",
            y: "60px",
            data: [
              "彩妆",
              "留学",
              "派遣",
              "玉缘轩",
            ]
          },
          series: [
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
        }
        second_time = ''
        secondList = []
        secondMethod(arg=""){
          var that = this;
          let data = {
            search_time: this.second_time,
            output: arg == 'output' ? 1 : 0
          }
          getNewOldTradeStatistic(data).then(res=>{
            if(arg == 'output') {
              res.data.file_path && window.open(res.data.file_path,'_self');
            }else {
              let second_chart = that.$echarts.init(that.$refs.secondChart)
              this.secondChart.series[0].data = res.data.circles;
              this.secondList = res.data.lists;
              this.secondChart.legend.data = res.data.titles;
              second_chart.setOption(this.secondChart)
            }
          })
        }
        threeChartOption = {
                color: ['#9AC0F3'],
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
                        name:'元',
                        type : 'category',
                        data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name:'人数'
                    }
                ],
                series : [
                    {
                        type:'bar',
                        barWidth: '40',
                        data:[10, 52, 200, 334, 390, 330, 220]
                    }
                ]
            }
        three_time = []
        threeMethod(arg){
            if(arg=='time') this.q_current=0
          let that = this;
          let data = {
            start_time: this.three_time[0],
            end_time: this.three_time[1],
            output: arg == 'output' ? 1 : 0
          }
          systemSalesStatistic(data).then(res=>{
            console.log(res)
            if(arg == 'output') {
              res.data.file_path && window.open(res.data.file_path,'_self');
            }else {
              let three_chart = that.$echarts.init(that.$refs.threeChart)
              that.threeChartOption.xAxis[0].data = res.data.money_range
              that.threeChartOption.series[0].data = res.data.count
              three_chart.setOption(that.threeChartOption)
            }
          })
        }
        add0(num){
          if(num<10) {
            return '0'+num
          }else {
            return num
          }
        }
        // 时间调整
        threeDayChange(number) {
            if(number==1) this.q_current=1
            if(number==7) this.q_current=2
            if(number==30) this.q_current=3
          let date = new Date();
          let yestdayTime = date.getTime() - number * 24 * 3600 * 1000
          let year = new Date(yestdayTime).getFullYear();
          let month = new Date(yestdayTime).getMonth() + 1;
          let day = new Date(yestdayTime).getDate();
          let lastTime = year + '-' + this.add0(month) + '-' + this.add0(day)
          if(number == 1) {
            // 昨天，start_time和end_time 传同一个
              this.three_time=[]
            this.three_time[0] = lastTime;
            this.three_time[1] = lastTime;
          }else {
              this.three_time=[]
            this.three_time[0] = lastTime;
            this.three_time[1] = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
          }
          console.log(this.three_time)
          this.threeMethod();
        }

        fourlist = []
        fourTime=''
        fourOpttion={
          color: ['#9AC0F3','#F1C087','#6E7788','#ED84B8','#8894A8','#F9F45B','#ED84B8','#A3B1C9','#ED8493','#85E8E8','#6E7788'],
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

        fourMehtod(arg){
            if(arg=='time'){
                this.w_current=3
            }
            let that=this
            let data={
                search_time:that.fourTime,
                output: arg == 'output' ? 1 : 0
            }
            systemOrderFromStatistic(data).then(res=>{
                if(arg == 'output') {
                  res.data.file_path && window.open(res.data.file_path,'_self');
                }else {
                  let fourChart = that.$echarts.init(this.$refs.fourChart)
                  let env_desc = [];
                  that.fourOpttion.legend.data= res.data.pay_count.forEach(item=>env_desc.push(item.name));
                  that.fourOpttion.series[0].data=res.data.pay_count
                  that.fourOpttion.series[1].data=res.data.pay_money
                  that.fourlist = res.data.list
                  fourChart.setOption(that.fourOpttion);
                }

            })
        }
        // 本月
        momentMonth(arg){

          let year = new Date().getFullYear();
          let month = new Date().getMonth()+1;
          if(arg == 'second') {
            this.second_time = year + '-' + month;
            this.secondMethod();
              this.s_current=1
          }else {
              this.w_current=1
            this.fourTime = year + '-' + month;
            this.fourMehtod();
          }
        }
        // 上月
        prevMonth(arg){

          let year = new Date().getFullYear();
          let month = new Date().getMonth() + 1;
          if(arg == 'second') {
              this.s_current=2
            if(month == 1) {
              this.second_time = year - 1 + '-' + 12
            }else {
              this.second_time = year + '-' + (month - 1);
            }
            this.secondMethod();
          }else {
              this.w_current=2
            if(month == 1) {
              this.fourTime = year - 1 + '-' + 12
            }else {
              this.fourTime = year + '-' + (month - 1);
            }
            this.fourMehtod();
          }
        }

        show(){

        }
        mounted(){
            this.fourMehtod();
            this.threeMethod();
            this.secondMethod();
            this.firstMethod();
        }

        created(){

        }


    }




</script>

<style scoped lang="less">
  .mainVip{
    width: 100%;
    min-width: 1200px;
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
        .selected {
          background: #409eff;
          color: #fff;
        }
      }
    }
  }
  .marginB{
    margin-bottom: 30px;
    min-width: 1200px;
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
      border-bottom: 0;
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
