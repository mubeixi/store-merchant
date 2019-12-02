<template>
  <div class="home-wrap">

    <el-dialog
      :title="elName"
      :width="widthDialog"
      @close="cardCancel"
      append-to-body
      :visible.sync="isShow"
      class="setting"
    >
      <div class="cardTitle" style="margin-bottom: 10px" >
        <block v-for="(item,index) of searchList" :key="index">
          <div class="cardTitle" style="margin-right: 10px" v-if="item.type=='input'">
            {{item.name}}： <el-input    class="sortInput" style="width: 100px" v-model="item.value"></el-input>
          </div>
          <el-select  :placeholder="item.name"  v-model="item.value" style="width: 150px;margin-right: 10px"  v-if="item.type=='select'">
            <!--          <template v-for="(shop,shopIn) in crowdList">-->
            <!--            <el-option :label="shop.name" :value="shop.id"></el-option>-->
            <!--          </template>-->
          </el-select>
        </block>
        <el-button  type="primary" @click="searchList">搜索</el-button>
      </div>
<!--      <el-table-->
<!--        ref="multipleTable"-->
<!--        :data="GivingGifts"-->
<!--        tooltip-effect="dark"-->
<!--        style="width: 100%"-->
<!--        highlight-current-row-->
<!--        @current-change="handleSelectionChange"-->
<!--      >-->
<!--        <el-table-column-->
<!--          type="index"-->
<!--          label="#"-->
<!--          width="55">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          label="赠品名称"-->
<!--          prop="gift_name"-->
<!--          width="120">-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          prop="Products_Name"-->
<!--          label="产品名称"-->
<!--          width="300px"-->
<!--        >-->
<!--          <template slot-scope="scope">-->
<!--            <div class="fixDisplay">-->
<!--              <div style="width: 100px;height: 100px">-->
<!--                <img :src="GivingGifts[scope.$index].img_url" style="width: 100%;height: 100%">-->
<!--              </div>-->
<!--              <div style="width: 200px;margin-left: 10px;">{{GivingGifts[scope.$index].Products_Name}}</div>-->
<!--            </div>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          prop="valid_days"-->
<!--          label="领取有效天数"-->
<!--          show-overflow-tooltip>-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          prop="limit_times"-->
<!--          label="限制领取次数"-->
<!--          show-overflow-tooltip>-->
<!--        </el-table-column>-->
<!--        <el-table-column-->
<!--          prop="Products_Count"-->
<!--          label="剩余库存"-->
<!--          show-overflow-tooltip>-->
<!--        </el-table-column>-->
<!--      </el-table>-->
<!--      <el-pagination-->
<!--        style="margin-top: 20px;text-align: center;"-->
<!--        @current-change="currentChange"-->
<!--        background-->
<!--        :page-size="pageSize"-->
<!--        layout="prev, pager, next"-->
<!--        :total="totalCount">-->
<!--      </el-pagination>-->
    </el-dialog>

  </div>
</template>

<script lang="ts">

    import {
        Component,
        Vue,
        Prop
    } from 'vue-property-decorator';
    import {
        Action,
        State
    } from 'vuex-class'


    @Component({
        mixins:[],
        components: {

        }
    })


    export default class Empty extends Vue {
        @Prop({
            type:String,
            default:'标题'
        })
        elName:string

        @Prop({
            type:String,
            default:'60%'
        })
        widthDialog:string

        @Prop({
            type:Boolean,
            default:true
        })
        isShow:boolean

        @Prop({
            type:Array,
            default:[
                {name:'名称',value:'',type:'input'},
                {name:'请选择',value:'',type:'select',option:[{name:'上海',value:'1'},{name:'北京',value:'2'}]}
                ]
        })
        searchList

        //关闭弹窗
        cardCancel(){
            this.isShow=false
        }

    }
</script>
<style lang="less" scoped>


  /*赠品*/
  .cardTitle{
    display: flex;
    align-items: center;
  }
  .current{
    cursor: pointer;
    color: #79B0FF;
    margin-left: 10px;
  }
  .fixDisplay{
    display: flex;
    align-items: center;
  }
  .lst{
    margin-left: 10px;
    width: 100px;
    overflow: hidden;
    height: 17px;
    line-height: 23px;
    display: inline-block;
  }
</style>

