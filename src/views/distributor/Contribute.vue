<template>
  <div class="">
    <div class="padding10">
      <el-button  size="small" class="" type="primary" @click="addDialogOpen">新建奖项</el-button>

    </div>
<!--    <fun-table-->
<!--      :columns="dataTableOpt.columns"-->
<!--      :dataList="dataTableOpt.dataList"-->
<!--      :totalCount="dataTableOpt.totalCount"-->
<!--      :pageSize="dataTableOpt.pageSize"-->
<!--      :is_paginate="dataTableOpt.is_paginate"-->
<!--      :formSize="'small'"-->
<!--      :isRow="true"-->
<!--      @handleSizeChange="handleSizeChange"-->
<!--      @currentChange="currentChange"-->
<!--      @selectVal="selectVal"-->
<!--      @submit="submit"-->
<!--      @reset="reset"-->
<!--    >-->
<!--      <template slot="Products_Name-column" slot-scope="props" >-->
<!--        <div style="display: flex;align-items: center;">-->
<!--          <img :class="'item'+props.idx" width="90px" height="100px" :src="props.row.img_url">-->
<!--          <span style="margin-left: 10px">{{props.row.Products_Name}}</span>-->
<!--        </div>-->
<!--      </template>-->
<!--      <template slot="Products_Qrcode-column" slot-scope="props">-->
<!--        <img height="70px" width="70px" :src="props.row.Products_Qrcode">-->
<!--      </template>-->
<!--      <template slot="attr-column"  slot-scope="props">-->
<!--        <div v-for="(item,index) of props.row.oattrs" >-->
<!--          <el-tag style="width:80px;margin:0 auto;margin-bottom: 5px;display: block;">{{item}}</el-tag>-->
<!--        </div>-->
<!--      </template>-->
<!--      <template slot="Products_Sales-column" slot-scope="props">-->
<!--        <span>{{props.row.Products_Sales}}/{{props.row.Products_Count}}</span>-->
<!--        <div class="skuClass" @click="lookSku(props.row.Products_ID)" v-if="props.row.Products_Type!=0">规格库存</div>-->
<!--      </template>-->
<!--      <template slot="operate-column" slot-scope="props">-->
<!--        <span v-if="cartsDialogInstance.footVisible" class="spans" @click="openDialog(props.row,props.idx)">退货</span>-->
<!--      </template>-->
<!--    </fun-table>-->
    <el-dialog
      :visible.sync="addDialogInstance.innerVisible"
      title="新建奖项"
      width="500px"
      center
      :close-on-click-modal="false"
      @close="addDialogCancel"
      append-to-body
    >
      <div class="container-wrap">
        <el-form label-width="100px" class="form" :model="addForm" :rules="addRules" ref="addForm">

          <el-form-item label="奖项名称" prop="title">
            <el-input  v-model="addForm.title" placeholder="请输入奖项名称" type="text" ></el-input>
          </el-form-item>
          <el-form-item label="统计区间" prop="scope">
            <div class="flex">
              <el-input  v-model="addForm.scopeMin" placeholder="最小值" type="number" ></el-input>
              <div class="w10"></div>
              <el-input  v-model="addForm.scopeMax" placeholder="最大值" type="number" ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="统计规则" prop="rules">
            <div class="rule-row flex line10" style="align-items: center" v-for="(row,idx) in addForm.rules" :key="idx">
              <el-input  v-model="row.min" placeholder="最小值" type="number" ></el-input>
              <div class="w10"></div>
              <el-input  v-model="row.max" placeholder="最大值" type="number" ></el-input>
              <div class="w10">

              </div>
              <i @click="removeRow(idx)" class="el-icon-delete font18" style="cursor: pointer"></i>
            </div>
            <div style="text-align: right">
              <el-button @click="addRulesRow" type="primary" size="mini">添加</el-button>
            </div>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button type="primary" :loading="addDialogInstance.loading"  @click="addFn">{{addDialogInstance.loading?'保存中':'添加奖项'}}</el-button>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class'
    import {fun} from '../../common';

    @Component({
        mixins:[],
        components: {}
    })



    export default class Contribute extends Vue {

        addDialogInstance = {
            innerVisible:false,
            loading:false
        }

        addDialogCancel(){
            this.addForm = {
                title:'',
                scopeMin:null,
                scopeMax:null,
                rules:[]
            };
            this.addDialogInstance.innerVisible = false
        }

        addDialogOpen(){
            this.addRulesRow()
            this.addDialogInstance.innerVisible = true
        }

        addFn(){

        }

        dataTableOpt = {
            act : 'get_self_store_prod',
            dataList:[],
            page:1,
            totalCount:0,
            pageSize:10,
            is_paginate:true,//是否显示分页 默认显示
            columns : [
                {
                    prop: "Products_ID",
                    label: "奖项名称",
                    search: false
                },
                {
                    prop: "Products_ID",
                    label: "统计时间",
                    search: false
                },
                {
                    prop: "Products_ID",
                    label: "区间营业额",
                    search: false
                },
                {
                    prop: "Products_ID",
                    label: "统计规划",
                    search: false
                },
                {
                    prop: "Products_ID",
                    label: "统计级别",
                    search: false
                },
                {
                    prop: "Products_ID",
                    label: "发放状态",
                    search: false
                },
                {
                    prop: "operate",
                    label: "操作",
                    align:'center',
                    width:150,
                    search: false
                }
            ]
        }

        removeRow(idx){
            if(this.addForm.rules.length ==1){
                fun.error({msg:'最少设置1个'})
                return
            }
            this.addForm.rules.splice(idx,1)
        }

        addRulesRow(){
            if(this.addForm.rules.length>5){
                fun.error({msg:'最多允许设置6个'})
                return
            }
            this.addForm.rules.push({max:'',min:''})
        }
        addForm =  {
            title:'',
            scopeMin:null,
            scopeMax:null,
            rules:[]
        }

        validateFn = {

            scopeFn:(rule, value, callback) => {
                if (!this.addForm.scopeMin || !this.addForm.scopeMax){
                    callback(new Error('统计区间两项均必填'));
                }else{
                    callback();
                }
            },
            rulesFn:(rule, value, callback) => {

                if(this.addForm.rules.length<1){
                    callback(new Error('请至少设置一个统计规则'));
                    return;
                }

                let check = true
                for(var rule of this.addForm.rules){

                    if(rule.min>=0 && rule.max>=0){
                        if(rule.min<rule.max){
                            check = false
                            callback(new Error('左侧阈值应该小于右侧阈值'));
                            break;
                        }
                    }else{
                        check = false
                        callback(new Error('每行阈值至少填写一个'));
                        break;
                    }
                }
                check && callback();
            },

        }

        addRules = {
            title: [
                {required: true,message: '请输入奖品名称', trigger: 'blur' }
            ],
            scope:[
                {required: true,validator:this.validateFn.scopeFn, trigger: 'blur' }
            ],
            rules:[
                {required: true,validator:this.validateFn.rulesFn, trigger: 'blur' }
            ],

        }



    }

</script>

<style scoped lang="less">
.el-icon-delete{
  &:hover{
    color: #F43131;
  }
}
</style>
