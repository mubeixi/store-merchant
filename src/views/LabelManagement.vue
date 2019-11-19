<template>
  <div class="labelManagement">
      <div class="labelMain">
            <div style="margin-bottom: 15px">
              <el-select v-model="value" placeholder="请选择标签类型" size="mini" style="width: 175px;margin-right: 10px;">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input size="mini" placeholder="请输入标签名称" style="width: 175px"></el-input>
              <el-button size="mini" class="el-button"  style="margin-left: 23px">搜索</el-button>
              <el-button size="mini" class="el-button">导出标签</el-button>
              <el-button size="mini" class="el-button floatRight">新建标签</el-button>
            </div>
            <el-table
              class="wzw-tableS"
              :data="tableData"
              border
              style="width: 80%">
              <el-table-column
                prop="date"
                label="标签名"
                align="center"
                width="230">
              </el-table-column>
              <el-table-column
                prop="name"
                label="客户"
                align="center"
                width="180">
              </el-table-column>
              <el-table-column
                prop="address"
                width="140"
                align="center"
                label="标签类型">
              </el-table-column>
              <el-table-column
                prop="address"
                align="center"
                label="打标条件">
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="180"
              >
                <template slot-scope="scope">
                  <span class="spans">编辑</span><span class="spans">|</span><span class="spans">删除</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              class="pagination"
              layout="prev, pager, next"
              :total="100">
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

    @Component({
        mixins:[],
        components: {

        }
    })

    export default class AddProduct extends Vue {

        async created(){

        }
        tableData=[{
            date: '2016-05-02',
            name: '王小虎',
            address: '自动标签'
        }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '自动标签'
        }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '自动标签'
        }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '自动标签'
        }]



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
</style>
