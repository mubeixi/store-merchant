<template>
  <div class="same-city">
      <div class="same-main">
            <div class="same-top flex" >
<!--              v-if="!stores_id"-->
                <div class="flex1">
                  <div class="same-top-top">同城配送功能</div>
                  <div class="same-top-bottom">该服务开通后，订单发货时可以选择以下服务商帮您配送，产生的配送费用将从您的店铺余额中扣除，当余额不足以支付配送费时，发货会失败，请保证店铺余额充足。</div>
                </div>
                <div class="el-switchs">
                  <el-switch v-model="open"  @change="changeSwitch"></el-switch>
                </div>
            </div>
        <el-form size="small"  ref="ruleForm" :inline-message="true" label-width="130px"   class="ruleForm"  v-if="show||stores_id">
            <el-form-item label="取货地址：" prop="Products_Index" class="padding-tb-30 line12">
              {{contact_info.address}}     联系电话：{{contact_info.mobile}}   <span class="update-address" @click="goUpdata">修改</span>
            </el-form-item>

            <el-form-item label="业务类型：" prop="Products_Index" class="line12"   v-if="!stores_id">
                <template v-if="business_show==1">
                  <div class="radio-same">
                    <el-radio-group v-model="business_type">
                      <template v-for="(item,index) in business_type_list" >
                        <el-radio :label="index" class="radio-wid">{{index}}</el-radio>
                      </template>
                    </el-radio-group>
                  </div>
                  <el-button type="primary" size="mini"   @click="saveRadio"  :loading="loading">保存</el-button>
                </template>
                <template v-else>
                   {{business_type}}<span class="update-address" style="margin-left: 20px" @click="business_show=1">修改</span>
                </template>
            </el-form-item>

            <el-form-item label="服务商：" prop="Products_Index" style="margin-top: 30px"  class="line12">
                <div class="fuwushang">
                    <div class="item-fuwushang" v-if="provider.dada==1">
                          <div class="item-name">
                              达达
                          </div>
                          <div class="item-right">
                                <div class="kaitong" v-if="dada.provider_status==2">
                                  已开通
                                </div>
                                <div class="kaitong" v-else-if="dada.provider_status==1">
                                  审核中
                                </div>
                                <div class="kaitong" v-else-if="dada.provider_status==-1">
                                  <div class="kaitong-6">
                                    已驳回
                                  </div>
                                  <div class="kaitong-9">
                                    {{dada.reject_reason}}
                                  </div>
                                </div>
                                <div class="kaitong color-6" v-else >
                                    未开通
                                </div>
<!--                                <div class="flex item-right-last">-->
<!--                                    <div>-->
<!--                                      配费说明-->
<!--                                      <img src="@/assets/img/wenhao.png">-->
<!--                                    </div>-->
<!--                                </div>-->
                                <div class="flex item-right-last" style="margin-left: 30px">
                                  <div @click="application('dada')" v-if="dada.status==1"  style="color: #ff0000"  v-loading="dada_loading">
                                    关闭服务
                                  </div>
                                  <div @click="application('dada')" v-else   v-loading="dada_loading">
                                    开启服务
                                  </div>

                                </div>
<!--                                <div class="flex item-right-last" style="margin-left: 30px;color: #428CF7">-->
<!--                                  <div>-->
<!--                                    查询余额-->
<!--                                  </div>-->
<!--                                </div>-->
                          </div>
                    </div>
                    <div class="item-fuwushang"  v-if="provider.meituan==1">
                      <div class="item-name">
                        美团
                      </div>
                      <div class="item-right">
                        <div class="kaitong" v-if="meituan.provider_status==2">
                          已开通
                        </div>
                        <div class="kaitong" v-else-if="meituan.provider_status==1">
                          审核中
                        </div>
                        <div class="kaitong" v-else-if="meituan.provider_status==-1">
                          <div class="kaitong-6">
                            已驳回
                          </div>
                          <div class="kaitong-9">
                            {{meituan.reject_reason}}
                          </div>
                        </div>
                        <div class="kaitong color-6" v-else  >
                            未开通
                        </div>

<!--                        <div class="flex item-right-last">-->
<!--                          <div>-->
<!--                            配费说明-->
<!--                            <img src="@/assets/img/wenhao.png">-->
<!--                          </div>-->
<!--                        </div>-->
                        <div class="flex item-right-last" style="margin-left: 30px">
                          <div @click="application('meituan')" v-if="meituan.status==1"   style="color: #ff0000"  v-loading="meituan_loading">
                            关闭服务
                          </div>
                          <div @click="application('meituan')" v-else     v-loading="meituan_loading">
                            开启服务
                          </div>

                        </div>
                        <!--                                <div class="flex item-right-last" style="margin-left: 30px;color: #428CF7">-->
                        <!--                                  <div>-->
                        <!--                                    查询余额-->
                        <!--                                  </div>-->
                        <!--                                </div>-->
                      </div>
                    </div>
                    <div class="item-fuwushang"  v-if="provider.fengniao==1">
                      <div class="item-name">
                        蜂鸟
                      </div>
                      <div class="item-right">
                        <div class="kaitong" v-if="fengniao.provider_status==2">
                          已开通
                        </div>
                        <div class="kaitong" v-else-if="fengniao.provider_status==1">
                          审核中
                        </div>
                        <div class="kaitong" v-else-if="fengniao.provider_status==-1">
                          <div class="kaitong-6">
                            已驳回
                          </div>
                          <div class="kaitong-9">
                            {{fengniao.reject_reason}}
                          </div>
                        </div>
                        <div class="kaitong color-6" v-else   >
                            未开通
                        </div>
<!--                        <div class="flex item-right-last">-->
<!--                          <div>-->
<!--                            配费说明-->
<!--                            <img src="@/assets/img/wenhao.png">-->
<!--                          </div>-->
<!--                        </div>-->
                        <div class="flex item-right-last" style="margin-left: 30px">
                          <div @click="application('fengniao')" v-if="fengniao.status==1"   style="color: #ff0000"  v-loading="fengniao_loading">
                            关闭服务
                          </div>
                          <div @click="application('fengniao')" v-else  v-loading="fengniao_loading">
                            开启服务
                          </div>

                        </div>
                        <!--                                <div class="flex item-right-last" style="margin-left: 30px;color: #428CF7">-->
                        <!--                                  <div>-->
                        <!--                                    查询余额-->
                        <!--                                  </div>-->
                        <!--                                </div>-->
                      </div>
                    </div>

                </div>
            </el-form-item>


            <el-form-item label="免运费权益：" prop="Products_Index" style="margin-top: 40px"  class="line12"  v-if="!stores_id">
              <el-radio-group v-model="free_shipping">
                <el-radio label="1">适用</el-radio>
                <el-radio label="2">不适用</el-radio>
              </el-radio-group>
              <div class="shuoming">
                平台设置的各种免运费权益是否适用于同城配送
              </div>
            </el-form-item>
            <el-form-item label="配送限制：" prop="Products_Index" style="color: #666666;margin-bottom: 40px !important;margin-top: 40px">
              配送距离限制
              <el-input class="input-width margin-input" v-model="limit_config.send_distance" oninput ="value=value.replace(/[^0-9.]/g,'')"></el-input>km
              <span style="margin-left: 20px">起送价</span>
              <el-input class="input-width margin-input" v-model="limit_config.start_send_money" oninput ="value=value.replace(/[^0-9.]/g,'')"></el-input>元
            </el-form-item>
            <el-form-item label="费用配置：" prop="Products_Index" style="color: #666666">
                <el-input class="input-width" v-model="distance_money_config.start_distance" oninput ="value=value.replace(/[^0-9.]/g,'')"></el-input>
                km内按
                <el-input class="input-width margin-input" v-model="distance_money_config.start_money" oninput ="value=value.replace(/[^0-9.]/g,'')"></el-input>
                元收取配送费，每超出
                <el-input class="input-width margin-input" v-model="distance_money_config.plus_distance" oninput ="value=value.replace(/[^0-9.]/g,'')"></el-input>
                km费用增加
                <el-input class="input-width margin-input" v-model="distance_money_config.plus_money" oninput ="value=value.replace(/[^0-9.]/g,'')"></el-input>
                元
            </el-form-item>

            <el-form-item label="续重收费：" prop="Products_Index" style="color: #666666;margin-top: 40px;">
              商品重量
              <el-input class="input-width margin-input" v-model="weight_money_config.free_weight" oninput ="value=value.replace(/[^0-9.]/g,'')"></el-input>
              kg内不额外收费，每超出
              <el-input class="input-width margin-input" v-model="weight_money_config.plus_weight" oninput ="value=value.replace(/[^0-9.]/g,'')"></el-input>
              kg费用增加
              <el-input class="input-width margin-input" v-model="weight_money_config.plus_money" oninput ="value=value.replace(/[^0-9.]/g,'')"></el-input>
              元
              <div class="include">
                <div>
                  说明：最终费用=费用配置+续重收费
                </div>
<!--                <div style="margin-left: 42px">-->
<!--                  2. 需要对续重收费的商品开启该功能，并设置商品重量-->
<!--                </div>-->
              </div>
            </el-form-item>
            <el-button type="primary" class="last-button" size="small" @click="saveAll" :loading="loadings">保存</el-button>
        </el-form>

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
    import  {getCityExpressConfig,opCityExpressConfig,cityExpressProvider,get_Stores_ID} from '../common/fetch'

    @Component({
        mixins:[],
        components: {

        }
    })

    export default class SameCityDelivery extends Vue {
        loading=false
        loadings=false
        //是否开启
        open=false
        //开启智能配送
        free_shipping='1'
        //配送限制
        limit_config={
            start_send_money:'',//起送价
            send_distance:''//配送距离
        }
        //费用配置
        distance_money_config={
            //多少距离内多少钱，每加多少距离，另外再加多少钱
            start_distance:"",
            start_money:"",
            plus_distance:"",
            plus_money:""
        }
        //续重收费
        weight_money_config={
            //多少kg内不额外收费，每超出多少kg，另外增收多少钱
            free_weight:"",
            plus_weight:"",
            plus_money:""
        }

        //配送商服务列表
        express_info=[]
        //业务类型
        business_type_list={}
        business_type=''
        business_show=1

        //是否显示服务商
        provider={}
        dada={}
        meituan={}
        fengniao={}

        //地址
        contact_info={

        }

        //修改
        goUpdata(){
            if(this.stores_id){
                window.location.href=window.parent.location.origin+'/stores/prefile_edit.php'
            }else{
                window.location.href=window.parent.location.origin+'/member/wechat/recieve.php'
            }

        }
        dada_loading=false
        meituan_loading=false
        fengniao_loading=false

        //开启关闭服务商
        application(item){
                switch(item){
                    case 'dada':
                        this.dada_loading=true
                        break;
                    case 'meituan':
                        this.meituan_loading=true
                        break;
                    case 'fengniao':
                        this.fengniao_loading=true
                        break;
                }

                cityExpressProvider({type:item}).then(res=>{
                    this.getList()
                    switch(item){
                        case 'dada':
                            this.dada_loading=false
                            break;
                        case 'meituan':
                            this.meituan_loading=false
                            break;
                        case 'fengniao':
                            this.fengniao_loading=false
                            break;
                    }
                }).catch(e=>{
                    switch(item){
                        case 'dada':
                            this.dada_loading=false
                            break;
                        case 'meituan':
                            this.meituan_loading=false
                            break;
                        case 'fengniao':
                            this.fengniao_loading=false
                            break;
                    }
                })


        }


        //保存业务类型
        saveRadio(){
            if(this.loading)return
            this.loading=true

            opCityExpressConfig({business_type:this.business_type}).then(res=>{
                if(res.errorCode==0){
                    this.business_show=2
                    this.$notify({
                        title: '成功',
                        message: '保存成功',
                        type: 'success'
                    });
                }
            })
            this.loading=false


        }

        //保存所有
        saveAll(){
            if(this.loadings)return
            this.loadings=true

            if(this.limit_config.start_send_money<0||this.limit_config.send_distance<=0){
                this.$notify.error({
                    title: '错误',
                    message: '配送限制设置数值有误，请重新设置'
                });
                this.loadings=false
                return;
            }
            if(this.distance_money_config.start_distance<0||this.distance_money_config.start_money<0||this.distance_money_config.plus_distance<=0||this.distance_money_config.plus_money<0){
                this.$notify.error({
                    title: '错误',
                    message: '费用配置设置数值有误，请重新设置'
                });
                this.loadings=false
                return;
            }
            if(this.weight_money_config.free_weight<0||this.weight_money_config.plus_weight<=0||this.weight_money_config.plus_money<0){
                this.$notify.error({
                    title: '错误',
                    message: '续重收费设置数值有误，请重新设置'
                });
                this.loadings=false
                return;
            }


            let data={
                limit_config:JSON.stringify(this.limit_config),
                distance_money_config:JSON.stringify(this.distance_money_config),
                weight_money_config:JSON.stringify(this.weight_money_config),
                business_type:this.business_type
            }
            if(!this.stores_id){
                // data.business_type=this.business_type
                data.free_shipping=this.free_shipping
            }

            opCityExpressConfig(data).then(res=>{
                this.$notify({
                    title: '成功',
                    message: '保存成功',
                    type: 'success'
                });
            })
            this.loadings=false
        }
        show=false

        changeSwitch(value){
            opCityExpressConfig({open:this.open?1:0}).then(res=>{
                this.show=this.open
            }).catch(e=>{
                this.show=false
                this.open=false
            })
        }

        getList(){
            getCityExpressConfig().then(res=>{
                this.business_type_list=res.data.business_type
                this.provider=res.data.provider
                this.express_info=res.data.express_info
                this.contact_info=res.data.contact_info
                for(let item of this.express_info){
                    if(item.provider=='dada'){
                        this.dada=item
                    }
                    if(item.provider=='meituan'){
                        this.meituan=item
                    }
                    if(item.provider=='fengniao'){
                        this.fengniao=item
                    }
                }
                if(!res.data.city_express_config){
                    this.business_show=1
                    for(let item in this.business_type_list){
                        this.business_type=item
                        break
                    }
                }else{
                    this.open=(res.data.city_express_config.open)==1?true:false
                    this.show=this.open
                    this.business_show=2
                    if(res.data.city_express_config.business_type){
                        this.business_type=res.data.city_express_config.business_type
                    }else{
                        this.business_show=1
                        for(let item in this.business_type_list){
                            this.business_type=item
                            break
                        }
                    }
                    this.weight_money_config=res.data.city_express_config.weight_money_config
                    this.distance_money_config=res.data.city_express_config.distance_money_config
                    this.limit_config=res.data.city_express_config.limit_config
                    this.free_shipping=String(res.data.city_express_config.free_shipping)
                }

            })
        }
        stores_id=''
        async created(){
            this.stores_id=await get_Stores_ID()
            await this.getList()


        }




    }

</script>

<style scoped lang="less">
  .same-city{
    padding: 20px 0px 0px 20px;
    height: 100vh;
    width: 100%;
    background-color: #f5f5f5;
    box-sizing: border-box;
  }
  .same-main{
    background-color: #ffffff;
    width: 100%;
    padding-top: 30px;
    box-sizing: border-box;
    height: 100vh;
  }
  .same-top{
    width: 70%;
    height: 150px;
    background-color: #f5f5f5;
    margin-left: 30px;
  }
  .same-top-top{
    color: #333333;
    font-size: 16px;
    font-weight: bold;
    height: 16px;
    line-height: 16px;
    padding-top: 45px;
    padding-left: 36px;
  }
  .same-top-bottom{
    color: #666666;
    font-size: 14px;
    height: 13px;
    line-height: 13px;
    padding-top: 31px;
    padding-left: 37px;
  }
  .el-switchs{
    width: 100px;
    height: 150px;
    line-height: 150px;
  }
  .el-form{
    font-size: 14px;
    color:#666666;
  }
  .padding-tb-30{
    padding-top: 30px;
    padding-bottom: 30px;
  }
  .el-form-item{
    margin-bottom: 0px !important;
  }
  .update-address{
    color: #428CF7;
    cursor: pointer;
    margin-left: 10px;
  }
  .line12 /deep/ .el-form-item__label,.line12 /deep/ .el-form-item__content{
    line-height: 12px !important;
  }

  .radio-same{
    width: 550px;
  }
  .radio-wid{
    margin-bottom: 15px;
    width: 70px;
  }
  .fuwushang{
    width: 588px;
    border: 1px solid #EAEAEA;
    box-sizing: border-box;
  }
  .item-fuwushang{
    width: 588px;
    background-color: #ffffff;
    height: 70px;
    display: flex;
    border-bottom: 1px solid #EAEAEA;
    &:last-child{
      border-bottom: 0px;
    }
    .item-name{
      width: 138px;
      font-size: 14px;
      color: #666666;
      height: 70px;
      line-height: 70px;
      text-align: center;
      background-color: #F8F8F8;
      border-right: 1px solid #EAEAEA;
      box-sizing: border-box;
    }
    .item-right{
      width: 450px;
      border-right: 1px solid #EAEAEA;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .kaitong{
    //width: 407px;
    height: 70px;
    line-height: 70px;
    font-size: 14px;
    color: #38CA2C;
    padding-left: 53px;
    box-sizing: border-box;
  }
  .kaitong-6{
    color: #666666;
    height: 12px;
    line-height: 12px;
    margin-top: 16px;
    margin-bottom: 12px;
  }
  .color-6{
    color: #666666;
  }
  .kaitong-9{
    color: #999999;
    height: 13px;
    line-height: 13px;
  }
  .item-right-last{
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #428CF7;
    cursor: pointer;
    margin-right: 40px;
  }
  .shuoming{
    margin-top: 17px;
    //margin-bottom: 40px;
    font-size: 14px;
    color: #999999;
  }
  .input-width{
    width: 64px;
  }
  .include{
    margin-top: 25px;
    font-size: 14px;
    color: #999999;
  }
  .last-button{
    margin: 83px 0px 71px 171px;
    width: 92px;
    height: 37px;
  }
  .margin-input{
    margin-left: 2px;
    margin-right: 2px;
  }
</style>
