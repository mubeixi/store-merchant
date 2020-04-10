<template>
  <div class="mainVip">
    <div class="wrap">
      <div class="firstChart marginB">
        <div class="firstTitle">
          <div class="titleFont">商品类目销售分析</div>
          <div class="titleButton">
            <el-button type="primary" size="small" @click="proOutput">导出数据</el-button>

            <div class="buttonRadio">
              <div class="radioDiv" :class="f_current == 1 ? 'selected' : ''"  @click="getLastday(1,'stat',1)">昨天</div>
              <div class="radioDiv" :class="f_current == 2 ? 'selected' : ''"  @click="getLastday(7,'stat',1)">最近7天</div>
              <div class="radioDiv" :class="f_current == 3 ? 'selected' : ''"  @click="getLastday(30,'stat',1)">最近30天</div>
            </div>

            <el-date-picker
              v-model="start_time"
              type="date"
              value-format="yyyy-MM-dd"
              size="small"
              placeholder="请选择日期"
              style="width: 130px"
              @change="statHandle"
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
          <div class="titleFont">商品销售情况</div>
          <div class="titleButton">
            <el-button type="primary" size="small" @click="outputHandle">导出数据</el-button>

            <div class="buttonRadio">
              <div class="radioDiv" :class="s_current == 1 ? 'selected' : ''"   @click="getLastday(1,'sale',2)">昨天</div>
              <div class="radioDiv" :class="s_current == 2 ? 'selected' : ''"   @click="getLastday(7,'sale',2)">最近7天</div>
              <div class="radioDiv" :class="s_current == 3 ? 'selected' : ''"   @click="getLastday(30,'sale',2)">最近30天</div>
            </div>

            <el-date-picker
              v-model="sale_time"
              type="date"
              value-format="yyyy-MM-dd"
              size="small"
              placeholder="请选择日期"
              style="width: 130px"
              @change="salesTimeHandle"
            ></el-date-picker>
          </div>
        </div>
        <div class="fourTable fiveTable">
              <div class="fourTableAll">
                  <div class="th">
                    <div class="td" style="width: 28% !important;">商品名称</div>
                    <div class="td tq" @click="moneyToggleHandle">浏览量<span class="arrow">{{moneyToggle?'↓':'↑'}}</span></div>
                    <div class="td tq">浏览人数</div>
                    <div class="td tq">付款人数</div>
                    <div class="td tq">单品转换率</div>
                    <div class="td tq">销售数量</div>
                    <div class="td tq">销售金额</div>
                  </div>
                  <div class="tr" v-for="(item,index) of proSalesList" :key="index">
                    <div class="td tds" @click="goDetail(item.Products_ID)" style="width: 28% !important;">{{item.Products_Name}}</div>
                    <div class="td tq">{{item.view_count}}</div>
                    <div class="td tq">{{item.view_user_count}}</div>
                    <div class="td tq">{{item.pay_user_count}}</div>
                    <div class="td tq">{{item.conversion_rate}}%</div>
                    <div class="td tq">{{item.sales_count}}</div>
                    <div class="td tq">￥{{item.sales_money}}</div>
                  </div>

              </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="sale_total"
          :current-page="page"
          @current-change="getCurrent"
          @prev-click="getPrev"
          @next-click="getNext"
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
    s_current=0
    f_current=0

  value = ""
  start_time = ''
  protypelist = []
  sales_money = []
  sales_count = []
  countToggle:Boolean = false
  moneyToggle:Boolean = true
  proSalesList = []
  sale_time = ''
  sale_total = 0
  page = 1
  pageSize = 10
  lastTime = ''
  option = {
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        x: "center",
        y: "bottom",
        data: [

        ]
      },
      calculable: true,
      series: [
        {
          name: "类目消费比例",
          type: "pie",
          radius: "45%",
          center: ["25%", "40%"],
          data: [

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
          name: "类目消费比例",
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
  add0(num){
    if(num<10) {
      return '0'+num
    }else {
      return num
    }
  }
  /**
   * 获取前number天
   */
  getLastday(number=1,type='stat',num){
      if(num==1){
          if(number==1) this.f_current=1
          if(number==7) this.f_current=2
          if(number==30) this.f_current=3
      }else if(num==2){
          if(number==1) this.s_current=1
          if(number==7) this.s_current=2
          if(number==30) this.s_current=3
      }

    let date = new Date();
    let yestdayTime = date.getTime() - number * 24 * 3600 * 1000
    let year = new Date(yestdayTime).getFullYear();
    let month = new Date(yestdayTime).getMonth() + 1;
    let day = new Date(yestdayTime).getDate();
    let lastTime = year + '-' + this.add0(month) + '-' + this.add0(day)
    if(type=='stat') {
      this.start_time = lastTime;
      this.systemProdCateSales();
    }else if(type == 'sale') {
      this.sale_time = lastTime
      this.systemProdSales();
    }
  }
  // 销售数据导出
  outputHandle(){
    this.systemProdSales('output');
  }
  // 总数据导出
  proOutput(){
    this.systemProdCateSales('output');
  }
  getCurrent(e){
    this.page = e;
    this.systemProdSales();
  }
  getPrev(e){
    this.page = e;
    this.systemProdSales();
  }
  getNext(e){
    this.page = e;
    this.systemProdSales();
  }
  statHandle(){
      this.f_current=0
    this.systemProdCateSales();
  }
  salesTimeHandle(){
      this.s_current=0
    this.page = 1;
    this.systemProdSales();
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
  goDetail(id){
      this.$router.push({
          name: 'product',
          query: {
              prod_id:id
          }
      })
  }
  moneyToggleHandle(){
    this.moneyToggle = !this.moneyToggle;
    this.page = 1;
    this.systemProdSales();
  }
  initEcharts(){
        this.option.legend.data = this.names
        this.option.series[0].data = this.sales_count;
        this.option.series[1].data = this.sales_money;
        let  myChart = this.$echarts.init(this.$refs.chart);
        myChart.setOption(this.option);
  }
  systemProdCateSales(arg=""){
    let postData = {
      start_time: this.start_time,
      output: arg === 'output' ? 1 : 0
    }
    if(arg==='output') {
      console.log('output')
      systemProdCateSales(postData,{loading: true}).then(res=>{
          res.data.file_path && window.open(res.data.file_path,'_self');
        })
        return;
    }else {
      systemProdCateSales(postData,{loading: true}).then(res=>{
      this.protypelist = res.data.list;
      this.names = res.data.name;
      this.sales_count = res.data.sales_count;
      this.sales_money = res.data.sales_money;
      this.initEcharts();
      },err=>{
      })
    }

  }
  systemProdSales(arg=''){
    let postData = {
      order: this.moneyToggle ? 'desc' : 'asc',
      start_time: this.sale_time,
      page: this.page,
      pageSize: this.pageSize,
      output: arg === 'output' ? 1 : 0
    }
    if(arg === 'output') {
        systemProdSales(postData,{loading: true}).then(res=>{
          res.data.file_path && window.open(res.data.file_path,'_self');
        })
        return;
    }else {
      systemProdSales(postData,{loading: true}).then(res=>{
        this.proSalesList = res.data.list;
        this.sale_total = res.totalCount
      })
    }
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
        display: flex;
        width: 20%;
        height: 50px;
        justify-content: center;
        align-items: center;
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
.selected {
  background: #409eff !important;
  color: #fff !important;
}

  .tds{
    box-sizing: border-box !important;
    line-height: 50px !important;
    height: 50px !important;
    overflow: hidden !important;
    text-align: left !important;
    display: block !important;
    padding-left: 5px !important;
    padding-right: 5px !important;
    cursor: pointer;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .tq{
    width: 12% !important;
  }
</style>
