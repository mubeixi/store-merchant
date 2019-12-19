<template>
  <div class="RotateAll">
    <div class="condition">
      <el-select class="select2" v-model="state" placeholder="请选择活动状态">
        <template  v-for="(it,ind) of statuss">
          <el-option
            :label="it"
            :value="ind">
          </el-option>
        </template>
      </el-select>
      <el-input class="input-name" v-model="active_name" placeholder="请输入活动名称"></el-input>
      <el-button type="primary" @click="searchLists">查询</el-button>

      <el-button type="primary" style="margin-left: 300px;width: 150px" @click="goRotate">新增抽奖活动</el-button>
    </div>
    <!-- 筛选end -->
    <!-- 列表start -->
    <div class="list">
      <el-table
        :data="scenesList"
        style="width: 80%">
        <el-table-column
          type="index"
          label="序号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="title"
          label="活动名称"
          >
        </el-table-column>
        <el-table-column
          prop="act_time"
          label="活动时间"
          width="300">
        </el-table-column>
        <el-table-column
          prop="status_txt"
          label="活动状态"
          width="145">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          width="145">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="二维码"
          width="100">
          <template slot-scope="scope">
            <el-image
              @click="changeImg(scenesList[scope.$index].qrcode)"
              style="width: 70px; height: 70px;cursor: pointer"
              :src="scenesList[scope.$index].qrcode"
              :preview-src-list="imgPro">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="handle"
          label="操作"
          width="250">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.$index)" type="text" size="small" >查看编辑</el-button>
            <el-button @click="stopScenes(scope.$index)" type="text" size="small" v-if="scenesList[scope.$index].status!=2">终止</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 列表end -->
    <!-- 分页start -->
    <div class="fenye">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="currentChange"
        :page-size="pageSize"
        :total="totalCount">
      </el-pagination>
    </div>
    <!-- 分页end -->
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
    import {
        getTurns,stopTurn
    } from '@/common/fetch';
    import {findArrayIdx, plainArray, createTmplArray, objTranslate} from '@/common/utils';
    @Component({
        mixins:[],
        components: {

        }
    })

    export default class RotateList extends Vue {

        imgPro=[]
        changeImg(url){
            this.imgPro=[]
            this.imgPro.push(url)
        }


        goRotate(){
            this.$router.push({
                name:'Rotate'
            })
        }

        active_name=''
        statuss=[]
        scenesList=[];//列表数据
        totalCount=0;//数量
        state='';//活动状态值
        pageSize=10;
        page=1;


        currentChange(val){
            this.page=val;
            this.searchList();
        }
        //详情
        handleClick(index){
            let id= this.scenesList[index].id;
            this.$router.push({
                name: 'Rotate',
                query: {
                    id: id
                }
            })
        }
        stopScenes(index){
            let id= this.scenesList[index].id;
            let that=this
            this.$confirm('你确定要终止这个活动吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                stopTurn({id:id}).then(res=>{
                      if(res.errorCode==0){
                          this.$message({
                              message: '终止成功',
                              type: 'success'
                          });
                          setTimeout(function () {
                              that.searchList();
                          },1000)
                      }
                })
            }).catch(() => {

            });

        }
        searchLists(){
            this.page=1
            this.searchList()
        }
        searchList(){
            let data={
                page:this.page,
                pageSize:this.pageSize,
                title:this.active_name,
                status:this.state
            }
            getTurns(data).then(res=>{
                this.scenesList=res.data;
                this.totalCount=res.totalCount;
                this.statuss=res.statuss
            })
        }
        created(){
            this.searchList()
        }
    }

</script>

<style scoped lang="less">
  html,body {
    height: 100%;
  }
  .page-wrap {
    height:100%;
    background: #f6f6f6;
    padding: 20px 0 0 20px;
  }

    .tabs {
      width: 1240px;
      display: flex;
      justify-content: space-between;
      .tab {
        position: relative;
        .tab-item {
          position: absolute;
        }
        .item1 {
          top: 70px;
          left: 58px;
        }
        .item2 {
          top: 73px;
          left: 125px;
          font-size:22px;
          color: #fff;
          font-weight: 700;
        }
        .item3 {
          top: 126px;
          left: 125px;
          width:90px;
          height:35px;
          color: #fff;
          line-height: 35px;
          text-align: center;
          border:1px solid rgba(255,255,255,1);
          border-radius:5px;
          cursor: pointer;
        }
      }
    }
    .condition {
      display: flex;
      align-items: center;
      padding-left: 6px;
      margin-top: 47px;
      margin-bottom: 20px;
      .el-input {
        width: 175px;
        height: 35px !important;
        line-height: 35px !important;
      }
      /deep/ .el-input__inner {
        height: 35px ;
        line-height: 35px;
      }
      .input-name {
        margin: 0 20px 0 10px;
      }
      .select2 {
        margin-left: 20px;
      }
      /deep/ .el-button  {
        width: 60px;
        height: 30px;
        line-height: 30px;
        padding: 0;
      }
    }
    .list {
      margin-left: 26px;
      /deep/ .el-table {
        .el-table--scrollable-x .el-table__body-wrapper {
          overflow: hidden !important;
        }
        th {
          text-align: center;
          border-bottom: 0;
          border-left: 1px solid #eaeaea;
          border-top: 1px solid #eaeaea;
          background-color: #F9FAFC;
          color: #333;
        }
        & th:nth-last-child(2) {
          border-right: 1px solid #eaeaea;
        }
      }
      /deep/ .el-table {
        td {
          color: #666;
          text-align: center;
          border-left: 1px solid #eaeaea;
          border-top: 1px solid #eaeaea;
          border-bottom: 0;
        }
        & td:last-child {
          border-right: 1px solid #eaeaea;
        }
        .el-table__body {
          border-bottom: 1px solid #eaeaea;
        }
      }
      /deep/ .el-table::before {
        width: 0;
      }
    }
    .fenye {
      margin-top: 48px;
      width: 1240px;
      margin-left: 26px;
      text-align: center;
      padding-bottom: 76px;
    }

</style>
