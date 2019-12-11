<template>
  <div class="labelManagement">
    <div class="labelMain">
      <el-form size="small">
        <el-form-item  label="级别名称：" class="marginLR">
          <el-input style="width: 350px" v-model="Level_Name"></el-input>
        </el-form-item>

        <el-form-item  label="级别描述：" class="marginLR">
          <el-input
            style="width: 480px"
            type="textarea"
            resize="none"
            :autosize="{ minRows: 3, maxRows: 10}"
            placeholder="请输入内容"
            v-model="Level_Description">
          </el-input>
        </el-form-item>

        <el-form-item label="级别标识："  class="marginLR labelCenter">
          <div class="divFlex">
            <upload-components
              size="mini"
              ref="thumb"
              :limit="1"
              tip="上传标识图片"
              :onSuccess="upThumbSuccessCall"
            />
            <div class="labelDiv">
              图片建议尺寸：30*30像素
            </div>
          </div>
        </el-form-item>

        <el-form-item  label="佣金人数限制：" class="marginLRS divFlex">
          <div class="divFlex">
            <div class="marginRight" v-if="level>=1">
              一级<el-input v-model="Level_PeopleLimit[0]"  class="inputMargin"></el-input>个
            </div>
            <div class="marginRight" v-if="level>=2">
              二级<el-input v-model="Level_PeopleLimit[1]" class="inputMargin"></el-input>个
            </div>
            <div  class="marginRight" v-if="level>=3">
              三级<el-input v-model="Level_PeopleLimit[2]"  class="inputMargin"></el-input>个
            </div>
          </div>
          <div class="fontSize">
            注：此级别的分销商获得佣金的人数限制。如：一级 3、二级 -1、三级 -1，说明此级别分销商只能获得3个下属的一级佣金，不能获得二级、三级佣金；
            0表示不限制，-1 表示禁止获得此级别佣金。此设置对于发展下级会员人数不起作用
          </div>
        </el-form-item>


        <el-form-item  label="达标方式选择：" class="marginLRS divFlex">
        <el-radio-group v-model="arrive_limit">
          <el-radio label="3" >满足任一条件</el-radio>
          <el-radio label="4" >满足全部条件</el-radio>
          <el-radio label="1" >不限制</el-radio>
          <el-radio label="2" >手动申请</el-radio>
        </el-radio-group>
        <block v-if="arrive_limit==3||arrive_limit==4">
          <div class="myCenter">
            <!--     消费额       -->
            <el-checkbox-group v-model="pay_money.checked">
              <el-checkbox label="lastTime" name="lastTime">消费额</el-checkbox>
            </el-checkbox-group>
            <div class="first">
              <el-form-item  label="消费类型：" class="divFlex">
                <el-radio-group v-model="pay_money.value.type"  :disabled="!pay_money.checked">
                  <el-radio label="1" >商城总消费</el-radio>
                  <el-radio label="2" >一次性消费</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item  label="消费金额：" class="divFlex">
                <el-input v-model="pay_money.value.money"  :disabled="!pay_money.checked" class="widthInput"></el-input> 元 <span class="spans">（注：用户需消费此额度才能成为该级别分销商）</span>
              </el-form-item>
              <el-form-item  label="生效状态：" class="divFlex">
                <el-radio-group v-model="pay_money.value.arrive_status" :disabled="!pay_money.checked">
                  <el-radio label="2" >订单付款后计入</el-radio>
                  <el-radio label="4" >订单确认收货后计入</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <!--     购买礼包       -->
            <el-checkbox-group v-model="buy_prod.checked">
              <el-checkbox label="lastTime" name="lastTime">购买礼包</el-checkbox>
              <el-radio-group v-model="buy_prod.value.type" class="productRadio" :disabled="!buy_prod.checked">
                <el-radio label="1" >任意商品</el-radio>
                <el-radio label="2" >特定商品</el-radio>
              </el-radio-group>
              <span class="selects" @click="showSetting">选择商品</span>
            </el-checkbox-group>
            <div class="first second" v-if="buy_prod.value.type=='2'">
              <div class="listLine">
                <img src="http://vod.q172.net/image/default/1FB2EA180FD04D689689880F40D1AD5A-6-2.png" class="lineImg">
                <div class="lineDiv">dsadasdasdasdasd</div>
              </div>
            </div>
            <!--    购买商品次数      -->
            <el-checkbox-group v-model="buy_times.checked" class="marginBo">
              <el-checkbox label="lastTime" name="lastTime">购买商品次数</el-checkbox>
              <el-input class="inputMy" v-model="buy_times.value" :disabled="!buy_times.checked"></el-input><span class="oneFont">次</span>
            </el-checkbox-group>
            <!--    团队销售额      -->
            <el-checkbox-group v-model="team_sales.checked" class="marginBo">
              <el-checkbox label="lastTime" name="lastTime">团队销售额</el-checkbox>
              <el-input class="inputMy"  v-model="team_sales.value" :disabled="!team_sales.checked" style="margin-left: 38px"></el-input><span class="oneFont">元</span>
            </el-checkbox-group>
            <!--    直接购买身份      -->
            <el-checkbox-group v-model="direct_buy.checked" class="marginBo">
              <el-checkbox label="lastTime" name="lastTime">直接购买身份</el-checkbox>
              <el-select lass="inputMy" v-model="direct_buy.value.type" :disabled="!direct_buy.checked" style="margin-left: 24px;width: 140px">
                <el-option label="直接购买" value="1" ></el-option>
                <el-option label="送产品" value="2" ></el-option>
                <el-option label="存入余额" value="3" ></el-option>
              </el-select>
              <block v-if="direct_buy.value.type==1">
                <el-input   v-model="direct_buy.value.money" class="inputMy inputT" placeholder="级别金额" :disabled="!direct_buy.checked"></el-input><span class="oneFont">元</span>
              </block>
              <block v-if="direct_buy.value.type==3">
                <el-input   v-model="direct_buy.value.present" class="inputMy inputT" placeholder="赠送金额" :disabled="!direct_buy.checked"></el-input><span class="oneFont">元</span>
              </block>
              <block v-if="direct_buy.value.type==2">
                <span class="selects">选择赠品</span>
              </block>
            </el-checkbox-group>
            <!--    直邀等级数量      -->
            <el-checkbox-group v-model="direct_sons.checked" class="marginBo" style="display: flex">
              <el-checkbox label="lastTime" name="lastTime">直邀等级数量</el-checkbox>
              <div >
                <div v-for="(item,index) of direct_sons.value" style="margin-bottom: 10px">
                  <el-input class="inputMy inputT" v-model="item.count" :disabled="!direct_sons.checked"></el-input><span class="oneFont">人</span>
                  <el-select v-model="item.level_id" lass="inputMy" :disabled="!direct_sons.checked" style="margin-left: 24px;width: 140px"  placeholder="请选择分销等级">
                    <block v-for="(mb,md) of disList" :key="md">
                      <el-option :label="mb.Level_Name" :value="mb.Level_ID" ></el-option>
                    </block>
                  </el-select>
                  <span class="addSpan" @click="addDirect" v-if="index==0">添加</span>
                  <span  class="addSpan" v-else @click="delDirect(index)">删除</span>
                </div>
              </div>
            </el-checkbox-group>
            <!--    团队等级数量      -->
            <el-checkbox-group v-model="team_sons.checked" class="marginBo" style="display: flex">
              <el-checkbox label="lastTime" name="lastTime">团队等级数量</el-checkbox>
              <div >
                <div v-for="(it,ind) of team_sons.value" style="margin-bottom: 10px">
                  <el-input v-model="it.count" class="inputMy inputT" :disabled="!team_sons.checked"></el-input><span class="oneFont">人</span>
                  <el-select v-model="it.level_id" lass="inputMy" :disabled="!team_sons.checked" style="margin-left: 24px;width: 140px"  placeholder="请选择等级">
                      <block v-for="(mb,md) of disList" :key="md">
                        <el-option :label="mb.Level_Name" :value="mb.Level_ID" ></el-option>
                      </block>
                  </el-select>
                  <span class="addSpan" @click="addTeam" v-if="ind==0">添加</span>
                  <span class="addSpan" v-else @click="delTeam(ind)">删除</span>
                </div>
              </div>
            </el-checkbox-group>
          </div>
        </block>

        <block v-if="arrive_limit==2">
          <div class="amu">
            <div class="th">
              <div class="td">字段类型</div>
              <div class="td">字段名称</div>
              <div class="td">初始内容</div>
              <div class="td" style="width: 125px">操作</div>
            </div>
            <div class="tr">
              <div class="td">
                <el-select class="widthmbx"></el-select>
              </div>
              <div class="td">
                <el-input class="widthmbx"></el-input>
              </div>
              <div class="td">
                <el-input class="widthmbx"></el-input>
              </div>
              <div class="td" style="width: 125px">
                <img src="@/assets/img/mydel.png" style="cursor:pointer;">
              </div>
            </div>
            <el-button type="primary"  style="margin-top: 20px" >确定</el-button>
          </div>
        </block>
      </el-form-item>

        <el-form-item  label="佣金发放限制：" class="marginLRS divFlex" v-if="direct_buy.checked&&(arrive_limit==3||arrive_limit==4)">
          <div class="divFlex">
            <div class="marginRight" v-if="level>=1">
              一级<el-input v-model="commi_rules[0]"  class="inputMargin"></el-input>元
            </div>
            <div class="marginRight" v-if="level>=2">
              二级<el-input v-model="commi_rules[1]" class="inputMargin"></el-input>元
            </div>
            <div  class="marginRight" v-if="level>=3">
              三级<el-input v-model="commi_rules[2]"  class="inputMargin"></el-input>元
            </div>
          </div>
          <div class="fontSize">
            注：会员购买此级别时，其上级获得的佣金
          </div>
        </el-form-item>

        <el-form-item class="submit">
          <el-button   class="close" >返回</el-button>
          <el-button type="primary"  class="submits" >确定</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog title="选择商品" :visible.sync="settingShow" width="80%" style="height: 900px;overflow: auto">
      <fun-table
        :columns="dataTableOpt.columns"
        :dataList="dataTableOpt.dataList"
        :act="dataTableOpt.act"
        :totalCount="dataTableOpt.totalCount"
        :pageSize="dataTableOpt.pageSize"
        :is_paginate="dataTableOpt.is_paginate"
        :formSize="'small'"
        :isRow="false"
        @handleSizeChange="handleSizeChange"
        @currentChange="currentChange"
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
    import UploadComponents from "@/components/comm/UploadComponents.vue";
    import {findArrayIdx, plainArray, createTmplArray, objTranslate} from '@/common/utils';
    import {
        Action,
        State
    } from 'vuex-class'
    import fa from "element-ui/src/locale/lang/fa";
    import {
        systemLevelList,getProducts,getProductCategory
    } from '@/common/fetch'
    const getParentsCount = (arr,key,pkey,val,tempArr)=>{
        var idx = false
        for(var i in arr){
            let item = arr[i]
            if(item[key] == val[pkey]){
                idx = i
                break;
            }
        }
        if(idx!==false){
            tempArr.push(1)
            //循环
            getParentsCount(arr,key,pkey,arr[idx],tempArr)
        }
    }
    const restArr = (arr,key)=>{
        let plainArr = []
        plainArray(arr,key,plainArr)
        for(var i in plainArr){
            let item = plainArr[i]
            item.parent_count = 0;
            let tempArr = []
            if(item['Category_ParentID']){
                getParentsCount(plainArr,'Category_ID','Category_ParentID',item,tempArr)
                item.parent_count = objTranslate(tempArr).length
            }
            item.new_name = createTmplArray('　├　',item.parent_count).join('')+item.Category_Name
        }
        return plainArr
    }
    @Component({
        mixins:[],
        components: {
            UploadComponents
        }
    })

    export default class DistributorLevel extends Vue {
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
                    prop: "Products_ID",
                    label: "产品ID",
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
                },
                {
                    prop: "Products_PriceX",
                    label: "商品价格",
                    width:120,
                    align:'center',
                    search: false
                },
                {
                    prop: "Product_Cate",
                    label: "商品分类",
                    align:'center',
                    showIf:(row)=>false,
                    value:'',
                    search: {
                        type: 'select',
                        operate: 'like',
                        option:[]
                    }
                },
                {
                    prop: "Products_CreateTime",
                    label: "发布时间",
                    align:'center',
                    width:150,
                    search: false
                },
                {
                    prop: "Products_Sales",
                    label: "销量/库存",
                    align:'center',
                    width:150,
                    search: false
                },
            ]
        }

        selectValue=[]
        //获取选中数据
        selectVal(val,vals){
            console.log(val,vals,"sssss")
            this.selectValue=[]
            for(let item of val){
                this.selectValue.push(item.Products_ID)
            }
        }
        //重置
        reset(){
            for(let it in this.dataTableOpt.columns){
                this.dataTableOpt.columns[it].value=''
            }
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
        currentChange(val){
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
                pro_name:this.dataTableOpt.columns[nameIdx].value,
                sel_cate:this.dataTableOpt.columns[cateIdx].value,
                store_id:''
            }

            getProducts(data).then(res=>{
                if(res.errorCode==0){
                    this.dataTableOpt.dataList=res.data
                    this.dataTableOpt.totalCount=res.totalCount
                    this.dataTableOpt.columns[oattrIdx].search.option=res.oattrs
                }
            })
        }


        showSetting(){
            this.getProduct()
            this.settingShow=true
        }

        Level_Name=''//级别名称
        Level_Description=''//等级描述
        Level_Icon=''//级别标识
        level=3 //级别等级
        //佣金人数限制
        Level_PeopleLimit=['','','']
        //发放佣金设置
        commi_rules=['','','']
        arrive_limit='3' //达标方式

        //消费额
        pay_money={
            checked: false,
            value:{
                type:'1',
                arrive_status:'2',
                money:''
            }
        }
        //直接购买
        direct_buy={
            checked:false,
            value:{
                type:'1',
                money: '',
                present:'',
                gift_id:''
            }
        }
        //购买商品
        buy_prod={
            checked:false,
            value:{
                type:'1',
                prod:''
            }
        }
        //购买商品次数
        buy_times={
            checked:false,
            value:''
        }
        //团队销售额
        team_sales={
            checked:false,
            value:''
        }

        //直接邀请
        direct_sons={
            checked:false,
            value:[
                {
                    level_id:'',
                    count:''
                }
            ]
        }
        //团队等级数量
        team_sons={
            checked:false,
            value:[
                {
                    level_id:'',
                    count:''
                }
            ]
        }
        //添加直接邀请
        addDirect(){
            if(!this.direct_sons.checked)return
            this.direct_sons.value.push({level_id:'', count:''})
        }
        delDirect(index){
            this.direct_sons.value.splice(index, 1);
        }
        //团队等级数量
        addTeam(){
            if(!this.team_sons.checked)return
            this.team_sons.value.push({level_id:'', count:''})
        }
        delTeam(index){
            this.team_sons.value.splice(index, 1);
        }

        upThumbSuccessCall(url_list){
           this.Level_Icon=url_list[0].url
        }

        disList=[]
        async created(){
              this.level=this.$route.query.level

            systemLevelList().then(res=>{
                if(res.errorCode==0){
                    this.disList=res.data
                }
            })
            getProductCategory().then(res=>{
                let cates = res.data
                // arr2table(newArr,'Category_ID','Category_ParentID')
                this.cates = restArr(cates,'child')
                //修改
                let idx = findArrayIdx(this.dataTableOpt.columns,{prop:'Product_Cate',label:'商品分类'})
                console.log(idx)
                if(idx!==false){
                    this.dataTableOpt.columns[idx].search.option = this.cates.map(item=>{
                        return {label:item.new_name,value:item.Category_ID}
                    })
                }
            })

        }




    }

</script>

<style scoped lang="less">
.labelMain{
  padding: 20px 0px;
  .marginLR{
    margin-left: 22px;
  }
  .marginLRS{
    margin-left: 7px;
  }
}
.divFlex{
  display: flex;
}
.labelCenter{
  display: flex;
  .labelDiv{
    font-size: 7px;
    color: #BCBCBC;
    margin-top: 25px;
    margin-left: 12px;
  }
}
 .labelCenter /deep/ .el-form-item__label{
   margin-top: 25px;
 }
  .marginRight{
    margin-right: 20px;
    font-size: 8px;
    color: #777777;
  }
  .inputMargin{
    margin-left: 10px;
    margin-right: 6px;
    width: 85px;
  }
  .widthInput{
    width: 85px;
  }
  .fontSize{
    color: #BCBCBC;
    font-size: 12px;
    width: 630px;
    margin-top: 10px;
  }
  .myCenter{
    margin-top: 10px;
    background-color: #F8F8F8;
    padding: 11px 152px 21px 17px;
    .first{
      margin-left: 18px;
      margin-bottom: 15px;
      background-color: #ffffff;
      padding: 10px 50px 20px 16px;
      .spans{
        font-size: 12px;
        color: #BCBCBC;
        margin-left: 17px;
      }
    }
    .productRadio{
      display: inline-block;
      height: 32px;
      line-height: 32px;
      margin-left: 20px;
    }
  }
  .selects{
    color: #428CF7;
    font-size: 12px;
    margin-left: 10px;
    cursor: pointer;
  }

  .second{
    padding: 5px 22px 12px 16px !important;
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

  .oneFont{
    font-size: 14px;margin-left: 8px;color: #777777
  }
  .inputMy{
    width: 75px;margin-left: 24px
  }
  .inputT{
    margin-left: 20px;
    & /deep/ .el-input__inner{
      padding-right: 0px;
    }
  }
  .marginBo{
    margin-bottom: 20px;
  }
  .addSpan{
    color: #428CF7;
    font-size: 12px;
    margin-left: 12px;
    cursor: pointer;
  }
  .submit{
    margin-left: 380px;
    margin-top: 84px;
    .close{
      margin-right: 20px;
    }
  }

  .amu{
    background-color: #F8F8F8;
    width: 925px;
    padding: 24px 95px 38px 42px;
    box-sizing: border-box;
    border: 1px solid #EEEEEE;
    margin-top: 10px;
    .th{
      background-color: #F2F7FF;
      display: flex;
      align-items: center;
      height: 48px;
      .td{
        text-align: center;
        width: 220px;
        border-right: 1px solid #EEEEEE;
        &:last-child{
           border: 0px;
         }
      }
    }
    .widthmbx{
      width: 120px;
    }
    .tr{
      height: 60px;
      display: flex;
      align-items: center;
      background-color: #ffffff;
      border-top:1px solid #EEEEEE;
      .td{
        width: 220px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        border-right: 1px solid #EEEEEE;
        &:last-child{
          border: 0px;
        }
      }
    }
  }
</style>
