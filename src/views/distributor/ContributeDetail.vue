<template>
  <div class="">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(rule,idx) in rule_list" :label="getRuleText(rule.start,rule.end)" :name="''+idx"></el-tab-pane>
    </el-tabs>
    <div class="info">
      <div class="info-item">
        <span class="label">奖励名称:</span><span class="val">{{info.name}}</span>
      </div>
      <div class="info-item">
        <span class="label">统计时间:</span><span class="val">{{info.time}}</span>
      </div>
      <div class="info-item">
        <span class="label">区间业绩:</span><span class="danger-color">￥{{info.total_sales}}</span>
      </div>
      <div class="info-item flex1 text-right padding-right-10">
        <el-button @click="openDialog" size="small" type="success">发放奖励</el-button>
      </div>
    </div>
    <fun-table
      ref="dataTable"
      :columns="dataTableOpt.columns"
      :isSelect="dataTableOpt.isSelect"
      :dataList="dataTableOpt.dataList"
      :totalCount="dataTableOpt.totalCount"
      :pageSize="dataTableOpt.pageSize"
      :is_paginate="dataTableOpt.is_paginate"
      :formSize="'small'"
      :isRow="true"
    >

      <template slot="send_status-column"  slot-scope="props">

        <template v-if="props.row.send_status == 1"><span class="color-green">已发放</span></template>
        <template v-if="props.row.send_status == 0"><span class="graytext">未发放</span></template>

      </template>

    </fun-table>

    <el-dialog
      :visible.sync="dialogInstance.innerVisible"
      title="发放奖励"
      center
      @close="addDialogCancel"
      append-to-body
    >
      <div class="container-wrap">
        <el-form label-width="100px" status-icon class="form" :model="formData" :rules="addRules" ref="refForm">
          <el-form-item label="区间销售总额">
            <el-input  v-model="'￥'+info.total_sales" readonly disabled ></el-input>
          </el-form-item>
          <el-form-item label="发放奖励" prop="total_money">
            <el-input  v-model="formData.total_money" placeholder="请输入奖励金额" type="text" ></el-input>
          </el-form-item>
          <el-form-item label="统计规则" prop="rule_list" style="position:relative;padding-bottom: 36px">
            <div class="rule-row flex line10" style="align-items: center" v-for="(row,idx) in formData.rule_list" :key="idx">
              <el-input max="percent" min="0"  v-model="row.val"  type="number" >
                <template slot="prepend"><div style="width: 140px;overflow: hidden;font-size: 14px">{{getRuleText(rule_list[idx].start,rule_list[idx].end)}}</div></template>
                <template slot="append">%</template>
              </el-input>
            </div>
            <div  class="text-right graytext2">最多剩余{{percent}}%可以分配</div>
          </el-form-item>

        </el-form>
        <div style="text-align: center">
          <el-button type="primary" :loading="dialogInstance.loading"  @click="subFn">提交</el-button>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {Action, State} from 'vuex-class'
    import {fun} from '../../common';
    import {emptyObject, objTranslate} from '../../common/utils';
    import _ from 'underscore'
    import {
        getDistributorContributeDetail,
        beginDistributorStatistics,
        sendDistributorContributeMoney
    } from '../../common/fetch';

    @Component({
        mixins:[],
        components: {},
        watch:{
            'addForm.time':{
                deep:true,
                immediate:true,
                handler(val){
                    if(_.isArray(val)){
                        this.addForm.statistics_start = val[0]
                        this.addForm.statistics_end = val[1]
                    }

                }
            }
        },
        computed:{
            percent(){
                if(this.formData.rule_list.length==0){
                    return 0
                }
                let isHas = 0
                for(var rule of this.formData.rule_list){
                    isHas += parseFloat(rule.val)
                }
                if(isHas>100)return 0


                return 100 - isHas
            }
        },
        filters:{
            statusFilter(val){
                //0为待统计，1为统计中，2为待发放，3为已发放 <number>
                let arr = ['待统计','统计中','待发放','已发放']
                return arr[val]?arr[val]:''
            }
        }
    })


    export default class ContributeDetail extends Vue {

        getRuleText(start,end){
            if(start && end){
                return start+'-'+end;
            }
            if(start && !end)return '>'+start;
            if(!start && end)return '<'+end;
            return ''
        }
        getStyleFn(status){
            let arr = ['color-gray','color-blue','color-red','color-green']
            return arr[status]
        }
        inArray(val,arr){
            return arr.indexOf(val)!=-1
        }

        handleRowId = -1
        async startFn(row){

            this.handleRowId = row.id
            await beginDistributorStatistics({rule_id:row.id}).then(res=>{
                if(res.data.hasOwnProperty('status')){
                    setTimeout(()=>{
                        fun.success({msg:res.msg})

                        row.status = res.data.status;
                    },500)
                }
            }).catch()
            this.handleRowId = -1;

        }

        dialogInstance = {
            innerVisible:false,
            loading:false
        }

        addDialogCancel(){
            this.formData = {
                total_money:'',
                rule_list:[]
            }
            this.dialogInstance.innerVisible = false
        }

        openDialog(){
            //同样长度的
            this.formData.rule_list = this.rule_list.map(item=>{
                return {val:0}
            })

            this.dialogInstance.innerVisible = true
        }

        activeName = ''
        handleClick(e){
            console.log(this.activeName)
            this.loadFnc({index :this.activeName})
        }
        rule_list = []
        info = {}
        dataTableOpt = {
            dataList:[],
            page:1,
            isSelect:false,
            totalCount:0,
            pageSize:10,
            is_paginate:false,//是否显示分页 默认显示
            columns : [
                {
                    prop: "user_id",
                    label: "会员id",
                    search: false
                },
                {
                    prop: "User_NickName",
                    label: "会员昵称",
                    search: false
                },
                {
                    prop: "User_Mobile",
                    label: "手机号",
                    search: false
                },
                {
                    prop: "total_sales",
                    label: "团队业绩",
                    search: false
                },
                {
                    prop: "send_money",
                    label: "发放金额",
                    search: false
                },
                {
                    prop: "send_status",
                    label: "发放状态",
                    search: false
                },
                // {
                //     prop: "operate",
                //     label: "操作",
                //     align:'center',
                //     width:300,
                //     search: false
                // }
            ]
        }



        formData =  {
            total_money:'',
            rule_list:[]
        }

        validateFn = {

            rulesFn:(rule, value, callback) => {
                console.log(this.formData)
                if(this.formData.rule_list.length<1){
                    callback(new Error('请至少设置一个统计规则'));
                    return;
                }

                let percent = 0
                for(var rule of this.formData.rule_list){
                    console.log(rule.val)
                   // if(!rule.val){
                   //     callback(new Error('每行都需要填写'));
                   //     return ;
                   // }
                    percent+= parseFloat(rule.val)
                }
                console.log(percent)
                if(percent>100){
                    callback(new Error('各行总和应该小于等于100%'));
                    return ;
                }
                callback();
            },
        }

        addRules = {
            total_money: [
                {required: true,message: '请输入总金额', trigger: 'blur' }
            ],
            rule_list:[
                {required: true,validator:this.validateFn.rulesFn}
            ]
        }

        async subFn() {
            if(this.dialogInstance.loading){
                fun.error({msg:'请求太快'})
                return;
            }
            let formName = 'refForm'
            let formValidata = false
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    formValidata = true
                } else {
                    console.log('error submit!!');
                    formValidata =  false;
                }
            });
            if(!formValidata){
                fun.error({msg:'表单信息不符'})
                return;
            }


            let rules = this.formData.rule_list.map(item=>item.val)
            let postData = {rule_id:this.$route.query.id,total_money:this.formData.total_money,param:JSON.stringify(rules)};

            if(!emptyObject(postData,1)){
                fun.error({msg:'请正确填写信息'})
                return;
            }

            this.dialogInstance.loading = true
            let that=this
            await sendDistributorContributeMoney(postData).then(res=>{
                setTimeout(()=>{
                    fun.success({msg:'发放成功'})
                },500)
                that.loadFnc()
            }).catch(e=>{
                setTimeout(()=>{

                },500)
            })
            this.dialogInstance.loading = false


            this.addDialogCancel()

        }

        // resetFormFn() {
        //     let formName = 'addForm'
        //     this.$refs[formName].resetFields();
        // }

        loadFnc({index = 0}={}){
            getDistributorContributeDetail({rule_id:this.$route.query.id,index}).then(res=>{
                this.dataTableOpt.dataList = res.data.record
                let {name,total_sales,rule_arr,time} = res.data
                this.rule_list = rule_arr
                this.info = {name,total_sales,time}
            })
        }

        created(){
            this.loadFnc()
        }



    }

</script>

<style scoped lang="less">
.info{
  display: flex;
  align-items: center;
  padding: 5px 0 20px 0;
  .info-item{
    margin-right: 20px;
    .label{
      color: #888;
      margin-right: 3px;
    }
    .val{
      color: #444;
    }

  }
}
.el-icon-delete{
  &:hover{
    color: #F43131;
  }
}
</style>
