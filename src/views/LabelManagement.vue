<template>
  <div class="labelManagement">
      <div class="labelMain">
            <div style="margin-bottom: 15px">
              <el-select v-model="types" placeholder="请选择标签类型" size="small" style="width: 175px;margin-right: 10px;">
                <el-option
                  v-for="(it,ind) in typesList"
                  :label="it"
                  :value="ind">
                </el-option>
              </el-select>
              <el-input size="small" placeholder="请输入标签名称" v-model="labelName" style="width: 175px"></el-input>
              <el-button size="small" class="el-button"  style="margin-left: 23px" @click="searchList">搜索</el-button>
<!--              <el-button size="mini" class="el-button">导出标签</el-button>-->
              <el-button size="small" class="el-button floatRight" @click="goAddLabel">新建标签</el-button>
            </div>
            <el-table
              class="wzw-tableS"
              :data="tableData"
              border
              style="width: 80%">
              <el-table-column
                prop="name"
                label="标签名"
                align="center"
                width="230">
              </el-table-column>
              <el-table-column
                prop="tag_num"
                label="客户"
                align="center"
                width="180">
              </el-table-column>
              <el-table-column
                prop="type_txt"
                width="140"
                align="center"
                label="标签类型">
              </el-table-column>
              <el-table-column
                prop="label_rule"
                align="center"
                label="打标条件">
                <template slot-scope="scope">
                  <template v-for="(item,index) of tableData[scope.$index].conditions" >
                    <div class="divLeft" v-if="index==0">{{item}}</div>
                  </template>
                  <div v-if="tableData[scope.$index].conditions"  class="divLeft curr" @click="lookDetail(scope.$index)">查看详情</div>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="180"
              >
                <template slot-scope="scope">
                  <span class="spans" @click="ediT(tableData[scope.$index].id)">编辑</span><span class="spans">|</span><span class="spans" @click="delList(tableData[scope.$index].id)">删除</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              class="pagination"
              @current-change="currentChange"
              layout="prev, pager, next"
              :page-size="pageSize"
              :total="totalCount">
            </el-pagination>
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
  import  {getTags,delTag} from '@/common/fetch'

    @Component({
        mixins:[],
        components: {

        }
    })

    export default class AddProduct extends Vue {

        tableData=[]
        typesList=[]
        types=''
        labelName=''
        page=1
        pageSize=10
        totalCount=0

        lookDetail(index){
            let msg=this.tableData[index].condition;
            let arr=`<div style="height: 24px;font-size: 14px;color: #333333;line-height: 24px;margin-top: 5px !important;margin-bottom: 5px !important;font-weight: bold;">${msg}</div>`;
            for(let item of this.tableData[index].conditions){
                arr+=`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${item}</br>`
            }
            this.$alert(arr, '打标条件', {
                dangerouslyUseHTMLString: true
            });
        }

        //编辑
        ediT(index){
            this.$router.push({
                name: 'LabelAdd',
                params:{
                    id:index
                }
            })
        }

        //新建标签
        goAddLabel(){
            this.$router.push({
                name: 'LabelAdd'
            })
        }
        //删除标签
        delList(id){
            this.$confirm('你确定要删除这个标签吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delTag({id:id}).then(res=>{
                    if(res.errorCode==0){
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.searchList();
                    }else{
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        });
                    }
                })
            }).catch(() => {

            })
        }
        //切页数
        currentChange(val){
            this.page=val;
            this.searchList();
        }
        searchList(){
            let search={
                name:this.labelName,
                type:this.types,
                page:this.page,
                pageSize:this.pageSize
            }
            getTags(search).then(res=>{
                if(res.errorCode==0){
                    this.tableData=res.data;
                    this.typesList=res.types;
                    this.totalCount=res.totalCount;
                }
            })
        }

        async created(){
            this.searchList();
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

  .spans{
    color: @bgColor;
    margin-left: 2px;
    margin-right: 2px;
    cursor: pointer;
  }
  .el-button{
    background-color: @bgColor;
    color: #FFFFFF;
  }
  .wzw-tableS th {
    color: #333 !important;
    background-color: #F9FAFC !important;
    border: none !important;
    border-top: 1px solid #EAEAEA !important;
    border-left: 1px solid #EAEAEA !important;
  }
  .pagination{
    padding-top: 73px;
    margin-left: 30%;
  }
  .floatRight{
    margin-right: 20%;
    float: right;
  }
  .divLeft{
    line-height: 20px;
    text-align: left;
    margin-left: 30px;
  }
  .curr{
    color: #428CF7;
    cursor: pointer;
  }
</style>
