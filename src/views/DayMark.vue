<template>
    <div class="wrap">
        <div class="content">
            <el-form ref="form" :model="form">
                <div class="title">基本信息</div>
                <el-form-item label="活动名称：">
                    <el-input v-model="form.name" class="input-name"></el-input>
                </el-form-item>
                <el-form-item label="活动时间：" class="time">
                    每月 <el-date-picker type="date" placeholder="选择开始日期" v-model="form.start_time"></el-date-picker>
                    <span class="line" ></span>
                    <el-date-picker type="date" placeholder="选择结束日期" v-model="form.end_time"></el-date-picker>
                </el-form-item>
                <div class="title">权益</div>
                <el-form-item label="会员等级规则：">
                    <el-radio-group v-model="form.rule_type" class="rule-radio">
                        <el-radio :label="0">所有等级会员，同一规则
                        <div v-if="form.rule_type==0">
                            <el-table
                                class="wzw-table"
                                :data="oneruleData"
                                style="width: 100%"
                                >
                                <el-table-column
                                    prop="level"
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
                                        <div style="text-align:left;padding-left:78px;">
                                            <div class="userinput baoyou">
                                                <el-checkbox name="isOpenMsg" v-model="form.rights[0].shipping.checked"></el-checkbox>包邮
                                            </div>
                                            <div class="userinput xiaofei">
                                                <el-checkbox name="isOpenMsg" v-model="form.rights[0].discount.checked"></el-checkbox>消费折扣
                                                <el-input v-model="form.rights[0].discount.value"></el-input>折
                                            </div>
                                            <div class="userinput jifenbei">
                                                <el-checkbox name="isOpenMsg" v-model="form.rights[0].requite.checked"></el-checkbox>积分倍率
                                                <el-input v-model="form.rights[0].requite.value"></el-input>倍
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
                                        <div style="padding-left: 47px;text-align:left">
                                            <div class="giftbag songjifen">
                                                <el-checkbox name="isOpenMsg" v-model="form.rights[0].score.checked"></el-checkbox>送积分
                                                <el-input v-model="form.rights[0].score.value"></el-input>积分
                                            </div>
                                            <div class="giftbag song">
                                                <el-checkbox name="isOpenMsg" v-model="form.rights[0].gift.checked"></el-checkbox>送赠品
                                                <span>选择赠品</span>
                                            </div>
                                            <div class="giftbag jifenbei">
                                                <el-checkbox name="isOpenMsg" v-model="form.rights[0].coupon.checked"></el-checkbox>送优惠券
                                                <el-select v-model="form.tickets"></el-select>
                                                <el-input v-model="form.rights[0].coupon.value"></el-input>张
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
                                :data="levels"
                                style="width: 100%">
                                <el-table-column
                                    prop="level_name"
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
                                        <div style="padding-left: 78px;text-align:left">
                                            <div class="userinput baoyou" @click="see(scope)">
                                                <el-checkbox name="isOpenMsg" v-model="form.morerights[scope.$index].rights.shipping.checked"></el-checkbox>包邮
                                            </div>
                                            <div class="userinput xiaofei">
                                                <el-checkbox name="isOpenMsg" v-model="form.morerights[scope.$index].rights.discount.checked"></el-checkbox>消费折扣
                                                <el-input v-model="form.morerights[scope.$index].rights.discount.value"></el-input>折
                                            </div>
                                            <div class="userinput jifenbei">
                                                <el-checkbox name="isOpenMsg" v-model="form.morerights[scope.$index].rights.requite.checked"></el-checkbox>积分倍率
                                                <el-input v-model="form.morerights[scope.$index].rights.requite.value"></el-input>倍
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
                                                <el-checkbox name="isOpenMsg" v-model="form.morerights[scope.$index].rights.score.checked"></el-checkbox>送积分
                                                <el-input v-model="form.morerights[scope.$index].rights.score.value"></el-input>积分
                                            </div>
                                            <div class="giftbag song">
                                                <el-checkbox name="isOpenMsg" v-model="form.morerights[scope.$index].rights.gift.checked"></el-checkbox>送赠品
                                                <span>选择赠品</span>
                                            </div>
                                            <div class="giftbag jifenbei">
                                                <el-checkbox name="isOpenMsg" v-model="form.morerights[scope.$index].rights.coupon.checked"></el-checkbox>送优惠券
                                                <el-select v-model="form.morerights[scope.$index].rights.coupon.value"></el-select>
                                                <el-input v-model="form.morerights[scope.$index].rights.coupon.count"></el-input>张
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
                    <el-checkbox label="是否启用短信通知" name="isOpenMsg" v-model="form.sms_che"></el-checkbox>
                    <span class="peizhi">配置短信内容</span>
                </el-form-item>
                <div class="title">时间设置</div>
                <el-form-item label="发放权益、通知时间：" class="time-choose">
                    <span>在活动生效</span>
                    <el-select v-model="form.day" placeholder="前一天">
                        <el-option
                        v-for="item in days"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <span>的</span>
                    <el-select v-model="form.time" placeholder="08：30">
                        <el-option
                        v-for="item in times"
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
                        <el-input type="text" v-model="form.mobile"></el-input>
                    </div>
                </el-form-item>
                <el-form-item class="submit">
                    <el-button type="primary" @click="onSubmit">新建活动</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
    import Component from 'vue-class-component'
    import Vue from 'vue'
    import {initScene} from '../common/fetch'
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
        moreruleData = [
            {
                level: 'VIP1',
                right: '权益',
                gift: '232'
            },
        ]
        onSubmit(e){
            console.log(e)
        }
        change(scope,index){
            console.log(scope)
            console.log(index)
        }
        created(){
            // 获取一些初始化信息
            initScene().then(res=>{
                console.log(res)
                // 转换day为需要的格式
                let dayslist = res.data.days;
                let temArr = [];
                for(let i in dayslist) {
                    temArr.push({
                        label: dayslist[i],
                        value: i
                    })
                }
                this.days = temArr
                // 转换 时间为需要的格式
                let timeslist = res.data.times;
                let arr = [];
                for(let i in timeslist) {
                    arr.push({
                        label: timeslist[i],
                        value: i
                    })
                }
                this.times = arr
                this.levels = res.data.levels
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
</style>