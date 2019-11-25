<template>
  <div class="labelManagement">
    <div class="labelMain">
      <div class="crowdName" style="margin-bottom: 10px;">
        我的人群
      </div>
      <el-tabs  v-model="tabs">
        <el-tab-pane label="自定义人群" name="first">
          <div class="crowdAdd">新建人群</div>
          <el-table
            class="wzw-tableS"
            :data="tableData"
            border
            style="width: 80%">
            <el-table-column
              prop="name"
              label="人群名称"
              align="center"
              width="230">
            </el-table-column>
            <el-table-column
              prop="name"
              label="人群定义"
              align="center"
              >
              <template slot-scope="scope">
                <template v-for="(item,index) of tableData[scope.$index].conditions" >
                  <div class="divLeft" v-if="index==0">{{item}}</div>
                </template>
                <div v-if="tableData[scope.$index].conditions"  class="divLeft curr" @click="lookDetail(scope.$index)">查看详情</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="group_num"
              width="140"
              align="center"
              label="人群数量">
            </el-table-column>
            <el-table-column
              prop="updated_at"
              align="center"
              width="170"
              label="更新时间">
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="250"
            >
              <template slot-scope="scope">
                <span class="spans">短信群发</span><span class="spans">|</span><span class="spans">编辑</span><span class="spans">|</span><span class="spans">删除</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            class="pagination"
            layout="prev, pager, next"
            :total="100">
          </el-pagination>

        </el-tab-pane>
        <el-tab-pane label="推荐人群" name="second">
          <el-table
            class="wzw-tableS"
            :data="tableData"
            border
            style="width: 80%">
            <el-table-column
              prop="date"
              label="人群名称"
              align="center"
              width="230">
            </el-table-column>
            <el-table-column
              prop="name"
              label="人群定义"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="address"
              align="center"
              label="推荐理由">
            </el-table-column>
            <el-table-column
              prop="time"
              align="center"
              width="140"
              label="人群数量">
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="140"
            >
              <template slot-scope="scope">
                <span class="spans">短信群发</span></template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            class="pagination"
            layout="prev, pager, next"
            :total="totalCount">
          </el-pagination>

        </el-tab-pane>
      </el-tabs>



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
    import  {getCrowds,delCrowd} from  '@/common/fetch'

    @Component({
        mixins:[],
        components: {

        }
    })

    export default class AddProduct extends Vue {
        //tab选项的值
        tabs='first'

        tableData=[]

        page=1
        totalCount=0
        pageSize=10

        getList(){
            let data={
                page:this.page,
                pageSize:this.pageSize
            }
            getCrowds(data).then(res=>{
                if(res.errorCode==0){
                    this.totalCount=res.totalCount
                    this.tableData=res.data
                }
            })
        }

        async created(){

            this.getList()
        }




    }

</script>

<style scoped lang="less">
  @bgColor:#428CF7;
  .labelManagement{
    background-color: #f6f6f6;
    padding-top: 18px;
    padding-left: 19px;
    width: 100%;
    box-sizing: border-box;
    .labelMain{
      background-color: #FFFFFF;
      width: 100%;
      box-sizing: border-box;
      padding-top: 30px;
      padding-left: 24px;
    }
  }

  .crowdName{
    font-size: 16px;
    color: #333333;
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    background-color: #F8F8F8;
    margin-right: 100px;
  }
  .crowdAdd{
    margin-bottom: 15px;
    width:80px;
    height:34px;
    background:rgba(66,140,247,1);
    font-size: 14px;
    color: #F3F3F3;
    text-align: center;
    line-height: 34px;
    margin-top: 24px;
  }
  .pagination{
    padding-top: 73px;
    margin-left: 30%;
  }
  .spans{
    color: @bgColor;
    margin-left: 2px;
    margin-right: 2px;
  }
  .el-button{
    background-color: @bgColor;
    color: #FFFFFF;
  }
  .wzw-tableS th {
    color: #333333 !important;
    background-color: #F9FAFC !important;
    border: none !important;
    border-top: 1px solid #EAEAEA !important;
    border-left: 1px solid #EAEAEA !important;
  }

</style>
