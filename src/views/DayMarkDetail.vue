<template>
  <div class="wrap">
    <div class="content">
      <el-form ref="form" :model="form">
        <div class="title">基本信息</div>
        <el-form-item label="活动名称：">
          {{vipDate.name}}
        </el-form-item>
        <el-form-item label="活动时间：" class="time">
          每月 {{vipDate.act_time}}
        </el-form-item>
        <div class="title">权益</div>
        <el-form-item label="会员等级规则：">
              {{vipDate.right_rule}}
                <el-table
                  class="wzw-table"
                  :data="vipDate.rights"
                  style="width: 100%"
                >
                  <el-table-column
                    prop="scope"
                    label="会员身份"
                    width="137"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="right"
                    label="权益"
                    width="373"
                    align="center">
                    <template slot-scope="scope">
                      <div style="text-align:center;width: 100%;">
                        <div class="userinput baoyou" v-for="(item,index) of vipDate.rights[scope.$index].rights.basic" :key="index">
                            {{item}}
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
                      <div style="text-align:center;width: 100%">
                        <div class="userinput baoyou" v-for="(it,ind) of vipDate.rights[scope.$index].rights.right" :key="ind">
                          {{it}}
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>


        </el-form-item>
        <div class="title">通知配置</div>
        <el-form-item class="is-open-msg">
          <template v-if="vipDate.sms_content">启用短信通知：{{vipDate.sms_content}}</template>
          <template v-if="!vipDate.sms_content">未启用短信通知</template>
        </el-form-item>
        <div class="title">时间设置</div>
        <el-form-item label="发放权益、通知时间：" class="time-choose">
          {{vipDate.notify_rule}}
        </el-form-item>
        <div class="title">计划异常提醒</div>
        <el-form-item label="提醒方式：">
          通过短信提醒我
          <div class="recive-number">
            <span>接收短信的手机号：{{vipDate.mobile}}</span>
          </div>
        </el-form-item>
        <div class="bottomFixed">
            <el-button class="close" size="small" @click="closeThis">返回</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
    import Component from 'vue-class-component'
    import Vue from 'vue'
    import {getScene} from '@/common/fetch'
    @Component
    export default class DayMark extends Vue{
        form = {
            name: '',
            type: 3,
            rule_type: 0, // 1是都不一样，0是都一样
            rights: [
                {
                    gift: {
                        checked:false,
                        value: 7
                    },
                    score: {
                        checked: false,
                        value: 10
                    },
                    coupon: {
                        checked: false,
                        value: 5,
                        count: 5
                    },
                    requite: {
                        checked: false,
                        value: 1.1
                    },
                    shipping: {
                        checked: false,
                    },
                    discount: {
                        checked: 0,
                        value: 9
                    }
                }
            ],
            morerights: [
                {
                    level: 1,
                    enable: 0,
                    rights: [
                        {
                            gift: {
                                checked: false,
                                value: 7
                            },
                            score: {
                                checked: false,
                                value: 10
                            },
                            coupon: {
                                checked: false,
                                value: 5,
                                count: 5
                            },
                            requite: {
                                checked: false,
                                value: 1.1
                            },
                            shipping: {
                                checked: false,
                            },
                            discount: {
                                checked: 0,
                                value: 9
                            }
                        }
                    ]
                },
            ],
            value: true,
            levels: [],
            start_time: '',
            end_time: '',
            notify_day: 1,
            notify_time: '08:30',
            mobile_che: true,   //通过短信提醒我开关
            mobile: '13946878984', // 短信提醒的手机号
            sms_che: true,  //是否启用短信通知
            sms_content: '活动开始了,请及时参加', // 短信通知内容
            delivery: false,
            resource: '',
            desc: '',
            isOpenMsg: true,
            day: '',
            time: '',
            isBaoyou: false,
            isDiscount: true, // 是否开启折扣
            isJifen: false, // 是否开启积分倍率
            discount: 0,
            multiple: 0, // 积分倍率
            isSendJifen: false, // 是否赠送积分
            isSendGift: false, // 是否送赠品
            isSendTickets: true, // 是否送优惠券
            sendjifen: 10, // 输入的积分
            tickets: 2, //优惠券
        }
        days = []
        times = []
        oneruleData = [
            {
                level: '所有等级会员',
                right: '权益',
                gift: '232'
            }
        ]
        vipDate=[];
        moreruleData = [
            {
                level: 'VIP1',
                right: '权益',
                gift: '232'
            },
        ]

        closeThis(){
            this.$router.push({
                name:'Marketing'
            })

        }
        created(){
            let id=this.$route.query.id;
            getScene({id:id}).then(res=>{
                this.vipDate=res.data;
            })
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
        margin-right: 50px;
      }
      /deep/ .el-form-item__label {
        padding-left: 20px;
      }
      /deep/ .input-name {
        width: 353px;
        height: 40px;
        line-height: 40px;
      }
      .time {
        /deep/ .el-input__inner  {
          width: 140px;
          height: 40px;
          padding: 0 27px;
        }
        /deep/ .el-date-editor.el-input {
          width: 140px;
          height: 40px;
        }
      }
      .line {
        display: inline-block;
        width: 14px;
        height: 1px;
        margin: 0 10px;
        background: #B4B4B4;
        margin-bottom: 5px;
      }
      .rule-radio {
        /deep/ .el-radio {
          display: block;
        }
      }
      /deep/.el-radio__label {
        line-height: 40px;
      }
      .is-open-msg {
        padding-left: 20px;
        .peizhi {
          color: #79B0FF;
          margin-left: 20px;
        }
      }
      .recive-number {
        padding-left: 100px;
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
        .el-button--primary {
          margin-left: 102px;
          margin-top: 97px;
          width: 146px;
          height: 46px;
        }
      }
      /deep/ .el-table td {
        padding: 0 !important;
      }
      .baoyou {
        padding-top: 5px;
        padding-bottom: 5px;
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
    .close{
        /*width:62px;*/
        /*height:32px;*/
        /*line-height: 32px;*/
        /*text-align: center;*/
        /*cursor: pointer;*/
        /*border-radius:5px;*/
        /*margin-top: 50px;*/
        /*display: inline-block;*/
        font-size: 16px;
        background-color: #428CF7;
        color: #FFFFFF;
        margin:0 auto;
    }
  }
</style>
