<template>
  <div class="mainVip">
    <div class="wrap">
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
              v-model="start_time"
              type="date"
              value-format="yyyy-MM-dd"
              size="small"
              placeholder="请选择日期"
              style="width: 130px"
            ></el-date-picker>
          </div>
        </div>
        <div ref="chart" style="width: 100%;height: 580px"></div>
        <div class="fourTable">
              <div class="fourTableAll">
                  <div class="th">
                    <div class="td">分类名称</div>
                    <div class="td" @click="countToggleHandle">销售数量<span class="arrow">{{countToggle?'↑':'↓'}}</span></div>
                    <div class="td">数量比例</div>
                    <div class="td">销售金额</div>
                    <div class="td">金额比例</div>
                  </div>
                  <div class="tr" v-for="(item,index) of protypelist" :key="index">
                    <div class="td">{{item.Category_Name}}</div>
                    <div class="td">{{item.sales_count}}</div>
                    <div class="td">{{item.sales_count_prop}}%</div>
                    <div class="td">{{item.sales_money}}</div>
                    <div class="td">{{item.sales_money_prop}}%</div>
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
              v-model="sale_time"
              type="date"
              value-format="yyyy-MM-dd"
              size="small"
              placeholder="请选择日期"
              style="width: 130px"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </div>
        </div>
        <div class="fourTable fiveTable">
              <div class="fourTableAll">
                  <div class="th">
                    <div class="td">分类名称</div>
                    <div class="td" @click="moneyToggleHandle">浏览量<span class="arrow">{{moneyToggle?'↑':'↓'}}</span></div>
                    <div class="td">浏览人数</div>
                    <div class="td">付款人数</div>
                    <div class="td">单品转换率</div>
                    <div class="td">销售数量</div>
                    <div class="td">销售金额</div>
                  </div>
                  <div class="tr" v-for="(item,index) of proSalesList" :key="index">
                    <div class="td">{{item.Products_Name}}</div>
                    <div class="td">{{item.view_count}}</div>
                    <div class="td">{{item.view_user_count}}</div>
                    <div class="td">{{item.pay_user_count}}</div>
                    <div class="td">{{item.conversion_rate}}%</div>
                    <div class="td">{{item.sales_count}}</div>
                    <div class="td">￥{{item.sales_money}}</div>
                  </div>
                  
              </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="1000"
          style="width:100%;text-align:right;margin-top:40px;">
        </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import fa from "element-ui/src/locale/lang/fa";
import { systemProdCateSales,systemProdSales } from "@/common/fetch";
import {notSortBy, sortBy} from '@/common/utils';
@Component({
  mixins: [],
  components: {},
  watch: {
    
  }
})
export default class ProductStatistics extends Vue {
  value = ""
  start_time = ''
  protypelist = []
  sales_money = []
  sales_count = []
  countToggle:Boolean = false
  moneyToggle:Boolean = false
  proSalesList = []
  sale_time = ''
  option = {
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        x: "center",
        y: "bottom",
        data: [
          "彩妆",
          "留学",
          "派遣",
          "玉缘轩",
          "法律",
          "食品",
          "餐饮",
          "酒水",
          "汽车",
          "厨具",
          "家电",
          "男装",
          "口腔护理",
          "洗护",
          "学习"
        ]
      },
      calculable: true,
      series: [
        {
          name: "面积模式",
          type: "pie",
          radius: "45%",
          center: ["25%", "40%"],
          data: [
            { value: 335, name: "彩妆" },
            { value: 310, name: "留学" },
            { value: 234, name: "派遣" },
            { value: 135, name: "玉缘轩" },
            { value: 1548, name: "法律" },
            { value: 335, name: "食品" },
            { value: 310, name: "餐饮" },
            { value: 234, name: "酒水" },
            { value: 135, name: "汽车" },
            { value: 1548, name: "厨具" },
            { value: 335, name: "家电" },
            { value: 310, name: "男装" },
            { value: 234, name: "口腔护理" },
            { value: 135, name: "洗护" },
            { value: 1548, name: "学习" }
          ],
          itemStyle: {
              emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
              normal:{
                  color:function(params) {
                  //自定义颜色
                  var colorList = [          
                          '#F77A8C', '#6DD6D0', '#5E5D95', '#9AC0F3', '#6E7788', '#9AC0F3', '#F9F45B','#ED84B8','#A3B1C9','#ED8493','#85E8E8','#6E7788','#F8904A','#70CC8B','#F1C087',
                      ];
                      return colorList[params.dataIndex]
                  }
              }
          },
        },
        {
          name: "面积模式",
          type: "pie",
          radius: "45%",
          center: ["75%", "40%"],
          data: [
            { value: 335, name: "彩妆" },
            { value: 310, name: "留学" },
            { value: 234, name: "派遣" },
            { value: 135, name: "玉缘轩" },
            { value: 1548, name: "法律" },
            { value: 335, name: "食品" },
            { value: 310, name: "餐饮" },
            { value: 234, name: "酒水" },
            { value: 135, name: "汽车" },
            { value: 1548, name: "厨具" },
            { value: 335, name: "家电" },
            { value: 310, name: "男装" },
            { value: 234, name: "口腔护理" },
            { value: 135, name: "洗护" },
            { value: 1548, name: "学习" }
          ],
          itemStyle: {
              normal:{
                  color:function(params) {
                  //自定义颜色
                  var colorList = [          
                          '#F77A8C', '#6DD6D0', '#5E5D95', '#9AC0F3', '#6E7788', '#9AC0F3', '#F9F45B','#ED84B8','#A3B1C9','#ED8493','#85E8E8','#6E7788','#F8904A','#70CC8B','#F1C087',
                      ];
                      return colorList[params.dataIndex]
                  }
              }
          },
        }]
  }
  countToggleHandle(){
    this.countToggle = !this.countToggle;
    if(this.countToggle) {
      // 向下排序，销量从高到低
      this.protypelist.sort(sortBy('sales_count'))
    }else {
      // 向上排序，销量从低到高
      this.protypelist.sort(notSortBy('sales_count'))
    }
  }
  moneyToggleHandle(){
    this.moneyToggle = !this.moneyToggle;
    let postData = {
      order: this.moneyToggle ? 'desc' : 'asc',
      page: 1,
      pageSize: 10,
      start_time: this.sale_time,
    }
    systemProdSales(postData).then(res=>{
      this.proSalesList = res.data;
    });
  }
  initEcharts(){
        this.option.legend.data = this.names
        this.option.series[0].data = this.sales_count;
        this.option.series[1].data = this.sales_money;
        let  myChart = this.$echarts.init(this.$refs.chart);
        myChart.setOption(this.option);
  }
  systemProdCateSales(){
    systemProdCateSales({start_time:''}).then(res=>{
      console.log(res)
      this.protypelist = res.data.list;
      this.names = res.data.name;
      this.sales_count = res.data.sales_count;
      this.sales_money = res.data.sales_money;
      this.initEcharts();
    },err=>{

    })
  }
  systemProdSales(){
    systemProdSales({
      start_time: this.sale_time,
      page: 1,
      pageSize: 10,
    }).then(res=>{
      this.proSalesList = res.data;
    })
  }
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    let myChart = this.$echarts.init(this.$refs.chart);
    myChart.setOption(this.option);
    this.systemProdCateSales();
    this.systemProdSales();
  }
}
</script>

<style scoped lang="less">
.mainVip {
  width: 100%;
  box-sizing: border-box;
  padding: 39px 14% 54px 16%;
}
.wrap {
  min-width: 1200px;
}
.arrow {
  font-size: 18px;
  font-weight: 700;
  margin-left: 5px;
}
.arrow.up {
  transform: rotate(180deg);
}
.firstChart {
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #e4e4e4;
}

//title
.firstTitle {
  background-color: #f3f3f3;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  .titleFont {
    font-size: 14px;
    color: #666666;
    height: 50px;
    line-height: 50px;
    padding-left: 21px;
  }
  .titleButton {
    display: flex;
    align-items: center;
    height: 50px;
    padding-right: 30px;
    .selectClass {
      width: 100px;
      margin-left: 15px;
    }
    .selectDate {
      margin-left: 15px;
      width: 128px;
    }
    .buttonRadio {
      height: 30px;
      width: 260px;
      border: 1px solid #dcdcdc;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      background-color: #ffffff;
      margin-left: 15px;
      margin-right: 9px;
      .radioDiv {
        width: 86px;
        height: 30px;
        cursor: pointer;
        line-height: 30px;
        text-align: center;
        border-right: 1px solid #dcdcdc;
        font-size: 12px;
        color: #666666;
      }
    }
  }
}
.marginB {
  margin-bottom: 30px;
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
  .fiveTable {
    padding: 40px 50px 50px 50px;
    .fourTableAll{ 
      .td {
        width: 16%;
        &:first-child {
          width: 220px;
        }
      }
    }
  }
//title
</style>
