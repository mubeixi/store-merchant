<template>
  <div class="RotateAll">
    <el-form size="small">
      <div class="rotateName line15">
        <el-form-item label="活动名称：" prop="name">
          <el-input v-model="name" style="width: 350px"></el-input>
        </el-form-item>
      </div>

      <div class="rotateName line15">
        <el-form-item label="活动时间：" prop="name">
          <el-date-picker
            v-model="value2"
            type="datetimerange"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']">
          </el-date-picker>
        </el-form-item>
      </div>

      <div class="rotateName line15 " style="padding-left: 24px">
        <el-form-item label="每人参与总次数：" prop="name">
          <el-input v-model="name" style="width: 75px"></el-input>
          <span class="paddingL10">次</span>
        </el-form-item>
      </div>
      <div class="rotateName line15 paddingL10"  >
        <el-form-item label="每人每天参与总次数：" prop="name">
          <el-input v-model="name" style="width: 75px"></el-input>
          <span class="paddingL10">次</span>
        </el-form-item>
      </div>

      <div class="rotateLast line10">
          <div class="rotateList">
              <div class="rotateDiv">
                <el-form-item label="奖品设置：" prop="name">
                  <el-select v-model="tyep" placeholder="请选择奖品" style="width: 130px">
                    <el-option label="赠品" value="shanghai"></el-option>
                    <el-option label="优惠券" value="beijing"></el-option>
                    <el-option label="积分" value="hah"></el-option>
                  </el-select>
                  <block>
<!--                    <el-input placeholder="请输入积分数量" style="width: 130px;margin-left: 15px"></el-input>-->
                  </block>
                  <block>
                    <span class="spans" @click="showSetting">选择赠品</span>
                  </block>
                  <block>
                    <span class="spans" >选择优惠券</span>
                  </block>
                </el-form-item>
                <div class="first second" >
                  <div class="listLine" v-for="(item,index) of productData">
                    <img :src="item.img_url||item.ImgPath" class="lineImg">
                    <div class="lineDiv">{{item.Products_Name}}</div>
                  </div>
                </div>
<!--                <div class="first second" >-->
<!--                  <div class="listLine" style="height: 37px">-->
<!--                    <div class="lineDiv" style="margin-left: 0px">产品哈哈哈哈</div>-->
<!--                  </div>-->
<!--                </div>-->
                <el-form-item label="奖品数量：" prop="name">
                  <el-input v-model="name" style="width: 75px"></el-input>
                  <span class="paddingL10">个</span>
                </el-form-item>
                <el-form-item label="奖品概率：" prop="name">
                  <el-input v-model="name" style="width: 75px"></el-input>
                  <span class="paddingL10">%</span>
                </el-form-item>
              </div>
              <div class="rotateImg">
<!--                <img class="imgWidth" src="@/assets/img/rotateAdd.png">-->
                <img class="imgWidth" src="@/assets/img/rotateDel.png">
              </div>
          </div>

      </div>

      <div class="rotateRule">
        <el-form-item label="活动规则：" prop="name">
          <el-input v-model="name" style="width: 500px" type="textarea"  :autosize="{ minRows: 3, maxRows: 10}" resize="none"></el-input>
        </el-form-item>
      </div>

      <div class="myButton">
        <el-button >返回</el-button>
        <el-button type="primary" style="margin-left: 20px">保存</el-button>
      </div>
    </el-form>


    <el-dialog class="myProduct" title="选择赠品" :visible.sync="settingShow" width="60%" style="height: 900px;overflow: auto">
      <fun-table
        ref="funTableComp"
        vkey="Products_ID"
        :has="selectValue"
        :columns="dataTableOpt.columns"
        :dataList="dataTableOpt.dataList"
        :act="dataTableOpt.act"
        :totalCount="dataTableOpt.totalCount"
        :pageSize="dataTableOpt.pageSize"
        :is_paginate="dataTableOpt.is_paginate"
        :formSize="'small'"
        :isRow="false"
        @closeDialog="closeDialog"
        @handleSizeChange="handleSizeChange"
        @currentChange="currentChanges"
        @selectVal="selectVal"
        @submit="submit"
        @reset="reset"
      >
        <template slot="Products_Name-column" slot-scope="props" >
          <div style="display: flex;align-items: center;margin-left: 10px">
            <img width="90px" height="100px" :src="props.row.img_url">
            <span style="margin-left: 10px">{{props.row.Products_Name}}</span>
          </div>
        </template>
        <template slot="Products_PriceX-column"  slot-scope="props">
          <span>¥ {{props.row.Products_PriceX}}</span>
        </template>
        <template slot="Products_Sales-column" slot-scope="props">
          <span>{{props.row.Products_Sales}}/{{props.row.Products_Count}}</span>
        </template>
      </fun-table>
    </el-dialog>
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
        getGivingGifts
    } from '@/common/fetch';
    import {findArrayIdx, plainArray, createTmplArray, objTranslate} from '@/common/utils';
    @Component({
        mixins:[],
        components: {

        }
    })

    export default class Rotate extends Vue {
        //静态页面使用
        name=''
        value2=''
        tyep=""

        //选择商品
        settingShow=false
        cate=[]
        dataTableOpt = {
            act : 'get_self_store_prod',
            dataList:[],
            page:1,
            totalCount:100,
            pageSize:10,
            is_paginate:true,//是否显示分页 默认显示
            columns : [
                {
                    prop: "id",
                    label: "赠品ID",
                    align:'center',
                    width:138,
                    // align: "center",
                    // sortable: true,
                    //后面这些是filter使用的
                    search: false //不需要搜索ID,所以都不需要了
                },
                {
                    prop: "gift_name",
                    label: "赠品名称",
                    align:'center',
                    width:138,
                    // align: "center",
                    // sortable: true,
                    //后面这些是filter使用的
                    search: false //不需要搜索ID,所以都不需要了
                },
                {
                    prop: "Products_Name",
                    label: "商品名称",
                    value:'',
                    align:'center',
                    field: "Products_Name",
                    // align: "center",
                    // sortable: true,
                    //后面这些是filter使用的
                    required: true,
                    search: {
                        type: 'input',
                        operate: 'like',
                    }
                }
            ]
        }

        selectValue=[]
        productData=[]
        closeDialog(){
            this.settingShow=false
        }
        //获取选中数据
        selectVal(val,vals){
            console.log(val,vals,"sssss")
            //this.selectValue=[]
            this.productData=[]

            for(let item of val){
                this.productData.push(item)
                if(this.selectValue.indexOf(item.Products_ID)==-1){
                    this.selectValue.push(item.Products_ID)
                    //this.productData.push(item)
                }
            }
            for(let it of  vals){
                for(let i=0;i<this.selectValue.length;i++){
                    if(this.selectValue[i]==it.Products_ID){
                        this.selectValue.splice(i,1)
                        //this.productData.splice(i,1)
                    }
                }
            }

        }
        //重置
        reset(){
            console.log("11111111")
            for(let it in this.dataTableOpt.columns){
                this.dataTableOpt.columns[it].value=''
            }
            this.selectValue=[]
            this.getProduct()
        }
        //搜索
        submit(){
            this.getProduct()
        }
        //一页多少行
        handleSizeChange(val){
            this.dataTableOpt.pageSize=val
            this.getProduct()
        }
        //当前页数
        currentChanges(val){
            this.dataTableOpt.page=val
            this.getProduct()
        }
        getProduct(){
            let nameIdx = findArrayIdx(this.dataTableOpt.columns,{prop:'Products_Name'})
            let oattrIdx = findArrayIdx(this.dataTableOpt.columns,{prop:'attr'})
            let cateIdx = findArrayIdx(this.dataTableOpt.columns,{prop:'Product_Cate'})
            let data={
                pageSize: this.dataTableOpt.pageSize,
                page:this.dataTableOpt.page,
                pro_name:this.dataTableOpt.columns[nameIdx].value
            }

            getGivingGifts(data).then(res=>{
                if(res.errorCode==0){
                    this.dataTableOpt.dataList=res.data
                    this.dataTableOpt.totalCount=res.totalCount
                }
            })
        }
        showSetting(){
            this.getProduct()
            this.settingShow=true
        }
        //选择商品结束



    }

</script>

<style scoped lang="less">

  .RotateAll{
    width: 100%;
    padding: 20px 24px 64px 44px;
    box-sizing: border-box;
    background-color: #ffffff;
  }

  .rotateName{
    width: 100%;
    height: 65px;
    line-height: 65px;
    background-color: #F8F8F8;
    padding-top: 16px;
    box-sizing: border-box;
    padding-left: 66px;
  }
  .paddingL10{
    padding-left: 10px !important;
  }

  .rotateLast{
    width: 100%;
    padding: 15px 0px 38px 30px;
    background-color: #F8F8F8;
    box-sizing: border-box;
  }

  .rotateList{
    width: 100%;
    display: flex;
    .rotateDiv{
      width: 450px;
      background-color: #fff;
      margin-right: 25px;
      padding: 15px 33px 15px 20px;
      box-sizing: border-box;
    }
  }
  .rotateImg{
    width: 30px;
    height: 30px;
    cursor: pointer;
    .imgWidth{width: 100%;height: 100%}
  }
  .spans{
    color: #428CF7;
    cursor: pointer;
    margin-left: 17px;
    font-size: 12px;
  }

  .second{
    width: 100%;
    padding: 5px 22px 12px 0px !important;
    .listLine{
      height: 46px;
      display: flex;
      align-items: center;
      border-bottom: 1px dotted #DBDBDB;
      .lineImg{
        width: 30px;
        height: 30px;
      }
      .lineDiv{
        color: #999999;
        font-size: 12px;
        margin-left: 14px;
      }
    }
  }

  .rotateRule{
    width: 100%;
    padding: 15px 0px 28px 66px;
    background-color: #F8F8F8;
    box-sizing: border-box;
  }

  .myButton{
    margin-top: 44px;
    margin-left: 275px;
  }
</style>
