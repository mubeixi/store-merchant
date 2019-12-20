<template>
    <div class="wrap">
        <div class="content">
            <el-form ref="form" :model="form">
                <div class="title">基本信息</div>
                <el-form-item label="活动名称：" prop="name">
                    <el-input v-model="form.name" class="input-name" :disabled="!isEdit"></el-input>
                </el-form-item>
                <el-form-item label="活动时间：" class="time">
                    <!--会员日营销 传2-28的数，结束日期大于开始日期-->
                    <template v-if="form.type == 1">
                      每月 <el-select v-model="form.startday" :disabled="!isEdit">
                      <el-option
                        v-for="item in form.startdatelist"
                        :key="item.value"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                      号
                      <span class="line"></span>
                      <el-select v-model="form.endday" :disabled="!isEdit">
                        <el-option
                          v-for="item in enddatelist"
                          :key="item.value"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                      号
                    </template>
                    <!--生日营销 传act_time-->
                    <template v-if="form.type==2">
                      <el-radio-group v-model="form.act_time" :disabled="!isEdit">
                        <label>
                          <el-radio :label="1">生日当天</el-radio>
                        </label>
                        <label>
                          <el-radio :label="2">生日当周</el-radio>
                        </label>
                        <label >
                          <el-radio :label="3">生日当月</el-radio>
                        </label>
                      </el-radio-group>
                    </template>
                    <!--节日营销 -->
                    <template v-if="form.type==3">
                      <el-date-picker :disabled="!isEdit" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始日期" v-model="form.start_time"></el-date-picker>
                      <span class="line" ></span>
                      <el-date-picker :disabled="!isEdit" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束日期" v-model="form.end_time"></el-date-picker>
                    </template>
                </el-form-item>
                <div class="title">权益</div>
                <el-form-item label="会员等级规则：">
                    <el-radio-group v-model="form.rule_type" class="rule-radio">
                        <el-radio :label="0">所有等级会员，同一规则
                        <div v-if="form.rule_type==0">
                            <el-table
                                class="wzw-table"
                                :data="form.oneruleData"
                                style="width: 100%"
                                >
                                <el-table-column
                                    prop="level"
                                    label="会员身份"
                                    width="137"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    label="权益"
                                    width="373"
                                    align="center">
                                    <template slot-scope="scope">
                                        <div style="text-align:left;padding-left:78px;">
                                            <div class="userinput baoyou">
                                                <label>
                                                  <el-checkbox v-model="form.rights[0].rights.shipping.checked"></el-checkbox>包邮
                                                </label>
                                            </div>
                                            <div class="userinput xiaofei">
                                                <label >
                                                  <el-checkbox v-model="form.rights[0].rights.discount.checked"></el-checkbox>消费折扣
                                                </label>
                                                <el-input :disabled="!form.rights[0].rights.discount.checked" v-model="form.rights[0].rights.discount.value"></el-input>折
                                            </div>
                                            <div class="userinput jifenbei">
                                                <label>
                                                  <el-checkbox v-model="form.rights[0].rights.requite.checked"></el-checkbox>积分倍率
                                                </label>
                                                <el-input :disabled="!form.rights[0].rights.requite.checked" v-model="form.rights[0].rights.requite.value"></el-input>倍
                                            </div>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="礼包"
                                    width="376"
                                    align="center">
                                    <template slot-scope="scope">
                                        <div style="padding-left: 47px;text-align:left">
                                            <div class="giftbag songjifen">
                                              <label>
                                                <el-checkbox v-model="form.rights[0].rights.score.checked"></el-checkbox>送积分
                                              </label>
                                                <el-input :disabled="!form.rights[0].rights.score.checked" v-model="form.rights[0].rights.score.value"></el-input>积分
                                            </div>
                                            <div class="giftbag song" style="display: flex">
                                                <label>
                                                  <el-checkbox v-model="form.rights[0].rights.gift.checked"></el-checkbox>送赠品
                                                </label>
                                                <span class="current"  @click="selectGift(1,0,form.rights[0].rights.gift.checked)">选择赠品</span>
                                                <el-tooltip :content="form.rights[0].rights.gift.pname"  placement="top" effect="light">
                                                  <div>
                                                    <div  class="lst" style="display: block" v-if="form.rights[0].rights.gift.pname">{{form.rights[0].rights.gift.pname}}</div>
                                                  </div>
                                                </el-tooltip>
                                            </div>
                                            <div class="giftbag jifenbei">
                                                <label>
                                                  <el-checkbox v-model="form.rights[0].rights.coupon.checked"></el-checkbox>送优惠券
                                                </label>
                                                <el-select :disabled="!form.rights[0].rights.coupon.checked" v-model="form.rights[0].rights.coupon.value" style="width: 120px">
                                                  <template v-for="(it,ind_con) of coupon">
                                                    <el-option :label="it.title" :value="it.id" ></el-option>
                                                  </template>
                                                </el-select>
<!--                                                <el-input :disabled="!form.rights[0].rights.coupon.checked" v-model="form.rights[0].rights.coupon.count"></el-input>张-->
                                            </div>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        </el-radio>
                        <el-radio :label="1">不同等级会员，不同规则</el-radio>
                        <div v-if="form.rule_type== 1">
                            <el-table
                                class="wzw-table"
                                :data="form.levels"
                                style="width: 100%">
                                <el-table-column
                                    prop="level_name"
                                    label="会员身份"
                                    width="137"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    label="权益"
                                    width="373"
                                    align="center">
                                    <template slot-scope="scope">
                                        <div style="padding-left: 78px;text-align:left">
                                            <div class="userinput baoyou" >
                                              <label><el-checkbox :disabled="!form.morerights[scope.$index].enable" v-model="form.morerights[scope.$index].rights.shipping.checked" ></el-checkbox>包邮</label>
                                            </div>
                                            <div class="userinput xiaofei">
                                              <label>
                                                <el-checkbox :disabled="!form.morerights[scope.$index].enable" v-model="form.morerights[scope.$index].rights.discount.checked" ></el-checkbox>消费折扣
                                              </label>
                                                <el-input :disabled="!form.morerights[scope.$index].rights.discount.checked" v-model="form.morerights[scope.$index].rights.discount.value" ></el-input>折
                                            </div>
                                            <div class="userinput jifenbei">
                                              <label>
                                                <el-checkbox :disabled="!form.morerights[scope.$index].enable" v-model="form.morerights[scope.$index].rights.requite.checked" ></el-checkbox>积分倍率
                                              </label>
                                                <el-input :disabled="!form.morerights[scope.$index].rights.requite.checked" v-model="form.morerights[scope.$index].rights.requite.value" ></el-input>倍
                                            </div>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="gift"
                                    label="礼包"
                                    width="376"
                                    align="center">
                                    <template slot-scope="scope">
                                        <div style="padding-left:47px;text-align:left;">
                                            <div class="giftbag songjifen">
                                                <label>
                                                  <el-checkbox :disabled="!form.morerights[scope.$index].enable" v-model="form.morerights[scope.$index].rights.score.checked" ></el-checkbox>送积分
                                                </label>
                                                <el-input :disabled="!form.morerights[scope.$index].rights.score.checked" v-model="form.morerights[scope.$index].rights.score.value" ></el-input>积分
                                            </div>
                                            <div class="giftbag song" style="display: flex">
                                                <label>
                                                  <el-checkbox :disabled="!form.morerights[scope.$index].enable" v-model="form.morerights[scope.$index].rights.gift.checked" ></el-checkbox>送赠品
                                                </label>
                                                <span class="current" @click="selectGift(2,scope.$index,form.morerights[scope.$index].rights.gift.checked)">选择赠品</span>
                                                <el-tooltip :content="form.morerights[scope.$index].rights.gift.pname"  placement="top" effect="light">
                                                  <div>
                                                    <div  class="lst" style="display: block" v-if="form.morerights[scope.$index].rights.gift.pname">{{form.morerights[scope.$index].rights.gift.pname}}</div>
                                                  </div>
                                                </el-tooltip>
                                            </div>
                                            <div class="giftbag jifenbei">
                                              <label>
                                                <el-checkbox :disabled="!form.morerights[scope.$index].enable" v-model="form.morerights[scope.$index].rights.coupon.checked" ></el-checkbox>送优惠券
                                              </label>
                                              <el-select :disabled="!form.morerights[scope.$index].rights.coupon.checked" v-model="form.morerights[scope.$index].rights.coupon.value" style="width: 120px">
                                                <template v-for="(it,ind_con) of coupon">
                                                  <el-option :label="it.title" :value="it.id" ></el-option>
                                                </template>
                                              </el-select>
<!--                                                <el-input :disabled="!form.morerights[scope.$index].rights.coupon.checked" v-model="form.morerights[scope.$index].rights.coupon.count" ></el-input>张-->
                                            </div>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="handle"
                                    label="状态操作"
                                    width="170"
                                    align="center">
                                    <template slot-scope="scope">
                                        <el-switch
                                            v-model="form.morerights[scope.$index].enable"
                                            active-color="#428CF7"
                                            inactive-color="#C0CCDA">
                                        </el-switch>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-radio-group>
                </el-form-item>
                <div class="title">通知配置</div>
                <el-form-item class="is-open-msg">
                    <el-checkbox label="是否启用短信通知" v-model="form.sms_che"></el-checkbox>
                    <el-input placeholder="配置短信内容" v-model="form.sms_content" :disabled="!form.sms_che"></el-input>
<!--                    <span class="peizhi">配置短信内容</span>-->
                </el-form-item>
                <div class="title">时间设置</div>
                <el-form-item label="发放权益、通知时间：" class="time-choose">
                    <span>在活动生效</span>
                    <el-select v-model="form.day" placeholder="前一天" :disabled="!isEdit">
                        <el-option
                        v-for="item in form.days"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <span>的</span>
                    <el-select v-model="form.time" placeholder="08：30" :disabled="!isEdit">
                        <el-option
                        v-for="item in form.times"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <span>开始通知会员</span>
                </el-form-item>
                <div class="title">计划异常提醒</div>
                <el-form-item label="提醒方式：">
                    <el-checkbox v-model="form.mobile_che" label="通过短信提醒我" name="remindByMsg"></el-checkbox>
                    <div class="recive-number">
                        <span>接收短信的手机号</span>
                        <el-input type="text" maxlength="11" :disabled="!form.mobile_che" v-model="form.mobile"></el-input>
                    </div>
                </el-form-item>
                <div style="height: 80px;width: 100%;background-color: #ffffff"></div>
            </el-form>
        </div>


      <div class="bottomFixed">
        <el-button size="small"  type="primary" :loading="loading" class="submits" @click="onSubmit">保存提交</el-button>
        <el-button  size="small"  class="close" @click="goMarking">返回</el-button>
      </div>

      <el-dialog
        title="选择赠品"
        width="60%"
        @close="cardCancel"
        append-to-body
        :visible.sync="isShow"
        class="setting"
      >
        <div class="cardTitle" style="margin-bottom: 10px">
          <div class="cardTitle" style="margin-right: 10px">
            产品名称： <el-input    class="sortInput" style="width: 100px" v-model="nameMbx"></el-input>
          </div>
          <el-button  type="primary" @click="searchList">搜索</el-button>
        </div>
        <el-table
          ref="multipleTable"
          :data="GivingGifts"
          tooltip-effect="dark"
          style="width: 100%"
          highlight-current-row
          @current-change="handleSelectionChange"
        >
          <el-table-column
            type="index"
            label="#"
            width="55">
          </el-table-column>
          <el-table-column
            label="赠品名称"
            prop="gift_name"
            width="120">
          </el-table-column>
          <el-table-column
            prop="Products_Name"
            label="产品名称"
            width="300px"
            >
            <template slot-scope="scope">
                <div class="fixDisplay">
                  <div style="width: 100px;height: 100px">
                    <img :src="GivingGifts[scope.$index].img_url" style="width: 100%;height: 100%">
                  </div>
                  <div style="width: 200px;margin-left: 10px;">{{GivingGifts[scope.$index].Products_Name}}</div>
                </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="valid_days"
            label="领取有效天数"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="limit_times"
            label="限制领取次数"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="Products_Count"
            label="剩余库存"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 20px;text-align: center;"
          @current-change="currentChange"
          background
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="totalCount">
        </el-pagination>
      </el-dialog>
    </div>
</template>

<script lang="ts">
    import {
        Component,
        Vue,
        Watch
    } from 'vue-property-decorator';
    import Vue from 'vue'
    import {initScene,addScene,getScene,getGivingGifts} from '../common/fetch'
    import {createTmplArray} from '@/common/utils';
    import fa from "element-ui/src/locale/lang/fa";


    const tmpl_data = {
            level: 1,
            enable: 0,
            rights:
                {
                    gift: {
                        checked: false,
                        value: '',
                        pname:''
                    },
                    score: {
                        checked: false,
                        value: ''
                    },
                    coupon: {
                        checked: false,
                        value: ''
                        // count: ''
                    },
                    requite: {
                        checked: false,
                        value: ''
                    },
                    shipping: {
                        checked: false,
                    },
                    discount: {
                        checked: 0,
                        value: ''
                    }
                }
        }
    @Component({
        computed:{
            enddatelist: function(){
                let temarr = []
                for(var i = this.form.startday;i<28;i++) {
                    temarr.push({
                        value: i+1
                    })
                }
                return temarr
            },

        }
    })
    export default class DayMark extends Vue{
        nameMbx='';
        loading=false
        form = {
            name: '',
            type: 1, // 1：会员日营销，2：生日营销，3：节日营销
            rule_type: 0, // 1是都不一样，0是都一样
            startday: '', // 用户选择的开始日期
            endday:'', // 用户选择的结束日期
            rights: [{
                rights: {
                    gift: {
                        checked:false,
                        value: '',
                        pname:''
                    },
                    score: {
                        checked: false,
                        value: ''
                    },
                    coupon: {
                        checked: false,
                        value: ''
                        // count: ''
                    },
                    requite: {
                        checked: false,
                        value: ''
                    },
                    shipping: {
                        checked: false,
                    },
                    discount: {
                        checked: 0,
                        value: ''
                    }
                }
            }],
            morerights: [],
            levels: [],
            start_time: '',
            end_time: '',
            mobile_che: false,   //通过短信提醒我开关
            mobile: '', // 短信提醒的手机号
            sms_che: false,  //是否启用短信通知
            sms_content: '', // 短信通知内容
            day: '1',
            time: '0',
            days: [],
            times: [],
            oneruleData: [
                {
                    level: '所有等级会员',
                }
            ],
            startdatelist : [],
            act_time: 1, // 1当天 2当周 3当月
        }
        initData=[]
        timeArr=[];
        coupon=[];//优惠券
        isEdit=true;//能否编辑
        totalCount=0
        page=1
        pageSize=8
        //赠品
        isShow=false;
        GivingGifts=[];//赠品列表
        giftIndex=0;
        giftType=1;
        selectGift(type,index,bool){
            //type  为1是同一规则  2 为不同规则
            //index   下标 第几行
            //bool  是否选择赠品
            if(!bool){
                this.$message.error('请勾选送赠品');
                return
            }
            this.giftType=type;
            this.giftIndex=index;
            this.isShow=true;
        }

        currentChange(val){
            this.page=val;
            this.searchList()
        }
        searchList(){
            let data={
                page:this.page,
                pageSize:this.pageSize,
                pro_name:this.nameMbx
            }
            getGivingGifts(data).then(res=>{
                if(res.errorCode==0){
                    this.GivingGifts=res.data;
                }
            })
        }

        goMarking(){
            this.$router.push({
                name:'Marketing'
            })
        }
        //取消
        cardCancel(){
            this.isShow=false
        }
        handleSelectionChange(val){
            if(val){
                if(this.giftType==1){
                    this.form.rights[0].rights.gift.value=val.id;
                    this.form.rights[0].rights.gift.pname=val.Products_Name;
                    this.form.rights[0].rights.gift.checked=true;
                }
                if(this.giftType==2){
                    this.form.morerights[this.giftIndex].rights.gift.value=val.id;
                    this.form.morerights[this.giftIndex].rights.gift.pname=val.Products_Name;
                    this.form.morerights[this.giftIndex].rights.gift.checked=true;
                }
                this.isShow=false
                this.$refs.multipleTable.setCurrentRow();
            }
        }


        onSubmit(){
            // if(this.form.mobile_che){
            //     if(!(/^1[3456789]\d{9}$/.test(this.form.mobile))){
            //         this.$message.error('请填写正确接收短信的手机号');
            //         return
            //     }
            // }
            if(this.loading) return;
            this.loading=true;
            let arrMore=[]
            for(let item of this.form.morerights){
                if(item.enable){
                    arrMore.push(item);
                }
            }
            // this.form.morerights=this.form.morerights.filter((item)=>{
            //     if(item.enable){
            //         return item
            //     }
            //     return
            // })
            let postData = {
                name: this.form.name,
                type: this.form.type,
                rule_type: this.form.rule_type,
                rights: JSON.stringify(this.form.rule_type == 0 ? this.form.rights : arrMore) ,
                start_time: this.form.start_time,
                end_time: this.form.end_time,
                notify_day: this.form.day,
                notify_time: this.timeArr[this.form.time],
                mobile_che: this.form.mobile_che?1:0,
                mobile: this.form.mobile,
                sms_che: this.form.sms_che?1:0,
                sms_content: this.form.sms_content,
                act_time: ''
            }

            let id = this.$route.query.id
            //获取初始化活动信息
            if(id){
                postData.id=id
            }
            //判断类型
            if(this.form.type == 1) {
                postData.start_time = this.form.startday;
                postData.end_time = this.form.endday;
                if(postData.end_time<=postData.start_time) {
                    this.$message({
                        message: '开始时间不能大于结束时间',
                        type: 'warning'
                    });
                    this.loading=false;
                    return;
                }

            }else if(this.form.type == 2) {
                postData.start_time = '';
                postData.end_time = '';
                postData.act_time = this.form.act_time;
            }else if(this.form.type == 3) {
                postData.start_time = this.form.start_time;
                postData.end_time = this.form.end_time;
            }else {
                this.loading=false;
                return;
            }

            addScene(postData).then(res=>{
                if(res.errorCode==0){
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                    this.loading=false
                    setTimeout(()=>{
                        this.$router.push({
                            name: 'Marketing'
                        })
                    },1500)
                }
            }).catch(e=>{
                this.loading=false
            })
        }
        change(scope,index){
            console.log(scope)
            console.log(index)
        }
       async created(){
            console.log('type....')
            console.log(this.$route)

            this.form.type = this.$route.query.type;
            // 获取一些初始化信息
            await initScene().then(res=>{
                console.log('ressss')
                console.log(res)
                // 转换day为需要的格式
                let dayslist = res.data.days;
                this.timeArr=res.data.times;
                this.coupon=res.data.coupons;
                let temArr = [];
                for(let i in dayslist) {
                    temArr.push({
                        label: dayslist[i],
                        value: i
                    })
                }
                this.form.days = temArr
                // 转换 时间为需要的格式
                let timeslist = res.data.times;
                let arr = [];
                for(let i in timeslist) {
                    arr.push({
                        label: timeslist[i],
                        value: i
                    })
                }
                this.form.times = arr
                this.form.levels = res.data.levels

                //以指定数据为模板，创建指定长度的数组
                this.form.morerights = createTmplArray(tmpl_data,this.form.levels.length)
                this.form.morerights.forEach((item,index)=>{
                    item.level = index + 1;
                })
                console.log(this.form.morerights)
                console.log('sssssss')
                let temarr = []
                for(let i = 0 ; i<28; i++) {
                    temarr.push({
                        value: i + 1
                    })
                }
                this.form.startdatelist = temarr;

            })
           let data={
               page:this.page,
               pageSize:this.pageSize
           }
           await getGivingGifts(data).then(res=>{
               if(res.errorCode==0){
                   this.GivingGifts=res.data;
                   this.totalCount=res.totalCount
               }
           })


           let id = this.$route.query.id
           //获取初始化活动信息
           if(id){
               this.isEdit=false;
               let initData={
                   id:id,
                   edit:1
               }
               await getScene(initData).then(res=>{
                      if(res.errorCode==0){
                          this.initData=res.data;
                          this.form.name=this.initData.name;
                          if(this.form.type==3){
                              this.form.start_time=this.initData.start_time;
                              this.form.end_time=this.initData.end_time;
                          }
                          if(this.form.type==1){
                              this.form.startday=this.initData.start_time;
                              this.form.endday=this.initData.end_time;
                          }
                          if(this.form.type==2){
                              this.form.act_time=parseInt(this.initData.act_time);
                          }
                          this.form.rule_type=this.initData.rule_type;
                          if(this.form.rule_type==1){
                              this.form.morerights=this.initData.rights;
                          }
                          if(this.form.rule_type==0){
                              this.form.rights=this.initData.rights;
                              // for(let i in this.form.rights[0].rights){
                              //         this.form.rights[0].rights[i].checked=true;
                              // }
                          }
                          if(this.initData.sms_content){
                              this.form.sms_che=true;
                          }else{
                              this.form.sms_che=false;
                          }
                          if(this.initData.mobile){
                              this.form.mobile_che=true;
                          }else{
                              this.form.mobile_che=false;
                          }
                          this.form.mobile=this.initData.mobile;
                          this.form.sms_content=this.initData.sms_content;
                          this.form.day=this.initData.notify_day.toString();
                          this.form.time=this.initData.notify_time;

                      }
               })
           }



        }
    }
</script>

<style scoped lang="less" >
    html,body {
        height: 100%;
    }
    .wrap {
        height:100%;
        background: #f6f6f6;
        padding: 20px 0 0 20px;
        .content {
            min-width: 1200px;
            color: #666;
            height: 100%;
            background: #fff;
            padding: 25px 0 0 25px;
            .title {
                color: #333;
                font-size: 16px;
                height: 50px;
                line-height: 50px;
                padding-left: 20px;
                margin-bottom: 20px;
                background: #F8F8F8;
            }
            /deep/ .el-form-item__label {
                padding-left: 20px;
            }
            /deep/ .input-name {
                width: 470px;
                height: 40px;
                line-height: 40px;
            }
            .time {
                /deep/ .el-input__inner  {
                    width: 200px;
                    height: 40px;
                    padding: 0 27px;
                }
                /deep/ .el-date-editor.el-input {
                    width: 200px;
                    height: 40px;
                }
            }
            .line {
                display: inline-block;
                width: 14px;
                height: 1px;
                margin: 0 10px 5px;
                background: #B4B4B4;
            }
            .rule-radio {
                /deep/ .el-radio {
                    display: block;
                }
            }
            /deep/.el-radio__label {
                line-height: 40px;
                margin-right: 30px;
            }
            .is-open-msg {
                padding-left: 20px;
                .peizhi {
                    color: #79B0FF;
                    margin-left: 20px;
                }
              .el-input {
                width: 200px;
                margin-left: 10px;
              }
            }
            .recive-number {
                padding-left: 104px;
                .el-input {
                    width: 167px;
                    height: 35px;
                    margin-left: 8px;
                    .el-input__inner {
                        height: 35px;
                    }
                }
            }
            .time-choose {
                .el-select {
                    width: 100px;
                    height: 30px;
                    margin: 0 10px 0 13px;
                    & .el-input__inner {
                        height: 30px;
                    }
                }
            }
            .submit {
              /*.submits{*/
              /*  margin-left: 102px;*/
              /*  margin-top: 97px;*/
              /*}*/
              /*.close{*/
              /* // margin-left: 40px;*/
              /*  margin-top: 97px;*/
              /*}*/
            }
            /deep/ .el-table td {
                padding: 0 !important;
            }
            .baoyou {
                margin-top: 40px;
                margin-bottom: 18px;
            }
            .songjifen {
                margin-top: 34px;
                margin-bottom: 18px;
            }
            .xiaofei {
                margin-bottom: 15px;
            }
            .song {
                margin-bottom: 24px;
            }
            .jifenbei {
                margin-bottom: 74px;
            }
            .userinput,
            .giftbag {
                .el-checkbox {
                    margin-right: 12px;
                }
                .el-input {
                    width: 69px;
                    height: 30px;
                }
                /deep/ .el-input__inner {
                    height: 30px;
                    line-height: 30px;
                }
                .el-select {
                    width: 75px;
                    height: 30px;
                    line-height: 30px;
                    margin-right: 12px;
                }
                /deep/ .el-input__suffix {
                    top: 6px !important;
                }
            }
            /deep/ .el-table td {
                border-top: 1px solid #EBEEF5;
                border-left: 1px solid #EBEEF5;
                border-bottom: 0;
            }
        }

    }

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
    /deep/ .el-table__row  {
      cursor: pointer;
    }

    .bottomFixed{
      position: fixed;
      padding: 10px 0;
      box-sizing: border-box;
      bottom: 0;
      width: 100%;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: center;
      justify-content: center;
      background-color: #fff;
      box-shadow: 0 -3px 5px #eee;
      z-index: 1;
      transition: right .2s ease;
    }
</style>
