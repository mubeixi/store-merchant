<template>
  <div class="mainVip">
    <div class="firstChart marginB">
      <div class="firstTitle">
        <div class="titleFont">会员增长情况</div>
        <div class="titleButton">
            <el-button type="primary" @click="firstMethod('out')" size="small">导出数据</el-button>

            <el-select @change="firstMethod('firstDay')" v-model="firstDay" placeholder="按月统计" size="small" class="selectClass">
              <el-option
                label="按日统计"
                value="day">
              </el-option>
              <el-option
                label="按月统计"
                value="month">
              </el-option>
              <el-option
                label="按年统计"
                value="year">
              </el-option>
            </el-select>

            <el-date-picker
              @change="firstMethod"
              v-if="firstDay=='day'"
              v-model="firstTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              class="selectDate"
              size="small"
              >
            </el-date-picker>
            <el-date-picker
              @change="firstMethod"
              v-if="firstDay=='month'"
              v-model="firstTime"
              type="month"
              size="small"
              class="selectDate"
              value-format="yyyy-MM-dd"
              placeholder="选择月">
            </el-date-picker>
            <el-date-picker
              @change="firstMethod"
              v-if="firstDay=='year'"
              v-model="firstTime"
              class="selectDate"
              type="year"
              size="small"
              value-format="yyyy-MM-dd"
              placeholder="选择年">
            </el-date-picker>
        </div>
      </div>
      <div ref="firstChart" :loading="firstLoading" style="width: 100%;height: 580px"></div>
    </div>

    <div class="firstChart marginB">
      <div class="firstTitle">
        <div class="titleFont">会员端口来源</div>
        <div class="titleButton">
          <el-button type="primary" @click="secondMethod('out')" size="small">导出数据</el-button>

          <el-select @change="secondMethod('secondDay')" v-model="secondDay" placeholder="按月统计" size="small" class="selectClass">
            <el-option
              label="按日统计"
              value="day">
            </el-option>
            <el-option
              label="按月统计"
              value="month">
            </el-option>
            <el-option
              label="按年统计"
              value="year">
            </el-option>
          </el-select>

          <el-date-picker
            @change="secondMethod"
            v-if="secondDay=='day'"
            v-model="secondTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            class="selectDate"
            size="small"
          >
          </el-date-picker>
          <el-date-picker
            @change="secondMethod"
            v-if="secondDay=='month'"
            v-model="secondTime"
            type="month"
            size="small"
            class="selectDate"
            value-format="yyyy-MM-dd"
            placeholder="选择月">
          </el-date-picker>
          <el-date-picker
            @change="secondMethod"
            v-if="secondDay=='year'"
            v-model="secondTime"
            class="selectDate"
            type="year"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="选择年">
          </el-date-picker>
        </div>
      </div>
      <div ref="secondChart" style="width: 100%;height: 480px;padding-bottom: 100px"></div>
    </div>

    <div class="firstChart marginB">
      <div class="firstTitle">
        <div class="titleFont">会员消费金额</div>
        <div class="titleButton">
          <el-button type="primary" @click="threeMethod('out')" size="small">导出数据</el-button>

          <el-select @change="threeMethod('secondDay')" v-model="threeDay" placeholder="按月统计" size="small" class="selectClass">
            <el-option
              label="按日统计"
              value="day">
            </el-option>
            <el-option
              label="按月统计"
              value="month">
            </el-option>
            <el-option
              label="按年统计"
              value="year">
            </el-option>
          </el-select>

          <el-date-picker
            @change="threeMethod"
            v-if="threeDay=='day'"
            v-model="threeTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            class="selectDate"
            size="small"
          >
          </el-date-picker>
          <el-date-picker
            @change="threeMethod"
            v-if="threeDay=='month'"
            v-model="threeTime"
            type="month"
            size="small"
            class="selectDate"
            value-format="yyyy-MM-dd"
            placeholder="选择月">
          </el-date-picker>
          <el-date-picker
            @change="threeMethod"
            v-if="threeDay=='year'"
            v-model="threeTime"
            class="selectDate"
            type="year"
            size="small"
            value-format="yyyy-MM-dd"
            placeholder="选择年">
          </el-date-picker>
        </div>
      </div>
      <div ref="threeChart" style="width: 100%;height: 580px"></div>
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
    import  {systemUserGroupStatistic,systemUserFromStatistic,systemUserBuyStatistic} from '@/common/fetch'
    @Component({
        mixins:[],
        components: {

        }
    })

    export default class VipStatistics extends Vue {



        firstOpttion={
            color:['#9AC0F3'],
            xAxis: {
                type: 'category',
                data: []
            },
            yAxis: {
                type: 'value',
                name:'人数'
            },
            series: [{
                data: [],
                type: 'line',
                itemStyle : { normal: {label : {show: true}}},
                smooth: true
            }]
        }
        firstDay='month'
        firstTime=''
        firstLoading=false
        firstMethod(item){
            if(this.firstLoading) return
            this.firstLoading=true
            if(item=='firstDay'){
                this.firstTime=''
            }
            let that=this
            let data={
                time:this.firstDay,
                search_time:this.firstTime
            }
            if(item=='out'){
                data.output=1
            }
            systemUserGroupStatistic(data).then(res=>{
                if(res.errorCode==0){
                    this.firstLoading=false
                    if(item=='out'){
                        res.data.file_path && window.open(res.data.file_path,'_self');
                    }else{
                        let firstChart = that.$echarts.init(this.$refs.firstChart)
                        that.firstOpttion.xAxis.data=res.data.time
                        that.firstOpttion.series[0].data=res.data.count
                        firstChart.setOption(that.firstOpttion);
                    }

                }
            })
            this.firstLoading=false
        }


        secondOpttion={
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x : 'center',
                y : 'bottom',
                data:[{
                }]
            },
            calculable : true,
            color:['#9AC0F3','#F1C087','#6E7788','#ED84B8','#8894A8'],
            series : [
                {
                    name:'会员端口来源',
                    type:'pie',
                    radius : [30, 110],
                    center : ['50%', '50%'],
                    //roseType : 'area', 突出饼状图
                    data:[
                    ]
                }]
        }
        secondDay='month'
        secondTime=''
        secondLoading=false
        secondMethod(item){
            if(this.secondLoading) return
            this.secondLoading=true
            if(item=='secondDay'){
                this.secondTime=''
            }
            let that=this
            let data={
                time:this.secondDay,
                search_time:this.secondTime
            }
            if(item=='out'){
                data.output=1
            }
            systemUserFromStatistic(data,{loading:true}).then(res=>{
                if(res.errorCode==0){
                    this.secondLoading=false
                    if(item=='out'){
                        res.data.file_path && window.open(res.data.file_path,'_self');
                    }else{
                        let secondOpttion = that.$echarts.init(this.$refs.secondChart)
                        that.secondOpttion.legend.data=res.data.User_From_desc
                        that.secondOpttion.series[0].data=res.data.from_count
                        secondOpttion.setOption(that.secondOpttion);
                    }

                }
            })
            this.secondLoading=false
        }

        threeOpttion={
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
        threeDay='month'
        threeTime=''
        threeLoading=false
        threeMethod(item){
            if(this.threeLoading) return
            this.threeLoading=true
            if(item=='secondDay'){
                this.threeTime=''
            }
            let that=this
            let data={
                time:this.threeDay,
                search_time:this.threeTime
            }
            if(item=='out'){
                data.output=1
            }
            systemUserBuyStatistic(data,{loading:true}).then(res=>{
                if(res.errorCode==0){
                    this.threeLoading=false
                    if(item=='out'){
                        res.data.file_path && window.open(res.data.file_path,'_self');
                    }else{
                        let threeOpttion = that.$echarts.init(this.$refs.threeChart)
                        that.threeOpttion.xAxis[0].data=res.data.money_range
                        that.threeOpttion.series[0].data=res.data.count
                        threeOpttion.setOption(that.threeOpttion);
                    }

                }
            })
            this.threeLoading=false
        }


        mounted(){
            this.firstMethod();
            this.secondMethod();
            this.threeMethod();
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
  }
}
  .marginB{
    margin-bottom: 30px;
  }
  //title


</style>
