<template>
  <div class="logisticsInfo">
    <el-dialog
      :visible.sync="innerVisible"
      title="物流跟踪"
      width="70%"
      center
      top="10vh"
      @close="cancel"
      class="innerDislog"
    >
      <div class="filter flex">

<!--        -->
        <el-input v-model="out_order_no" placeholder="请输入单号" >
          <el-select  style="width: 120px" slot="prepend" v-model="express" placeholder="物流公司">
            <el-option
              v-for="item in express_list"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-input>
        <div class="padding4-c"></div>
        <el-button @click="search" type="primary">搜索</el-button>
      </div>
      <div class="container" v-loading="ajax">
        <el-timeline :reverse="true" >
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.AcceptTime">
            {{activity.AcceptStation}}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { getOrderExpress,getShippingList } from '../../common/fetch';
  import { fun } from '../../common';


  function noop() {}

  export default {
    name: 'LogisticsInfo',
    props: {
      //store_id_list,只包含id
      order_no:{
        type:String,
        default:''
      },
      // show: {
      //   type: Boolean,
      //   default: false
      // },
    },
    data() {
      return {
        loading: true,
        finish:false,
        innerVisible: false,
        activities: [],
        ajax:false,
        out_order_no:'',
        express:'',
        express_list:['顺丰','申通','中通','韵达']
      };
    },
    watch: {
      // show: {
      //   immediate: true,
      //   handler(val) {
      //     this.innerVisible = val;
      //   }
      // },
    },
    created() {
      if(this.order_no){
        this.out_order_no = this.order_no
      }

      // getShippingList().then(res=>{
      //   this.express_list = res.data
      // })

      this.activities = []

    },
    methods: {
      cancel() {

      },
      async search(){
        if(!this.out_order_no){
          fun.error({msg:'物流单号需要填写'})
          return
        }
        if(!this.express){
          fun.error({msg:'请选择物流公司'})
          return
        }

        this.ajax = true;
        this.activities = []
        await getOrderExpress({shipping_id:this.out_order_no,express:this.express}).then(res=>{
          this.activities = res.data.list
        },err=>{
          this.activities = []
          fun.error({msg:'未查询到信息'})
        })
        this.ajax = false
      },
      setOutOrderNo(val){
        this.out_order_no = val
      },
      setExpress(val){
        this.express = val
      },
      show(){
        this.innerVisible = true
      }
    }
  };
</script>
<style lang="less" scoped>
.filter{
  /*margin-bottom: 10px;*/
}
.container{
  margin-top: 20px;
  min-height: 200px;
}
</style>
