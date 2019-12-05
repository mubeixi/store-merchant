<template>
    <div class="wrap">
        <div class="title">
            <div class="item" :class="item==1?'active':''" @click="changeItem(1)">用户详情</div>
            <div class="item" :class="item==2?'active':''" @click="changeItem(2)">登录日志</div>
            <div class="item" :class="item==3?'active':''" @click="changeItem(3)">积分明细</div>
            <div class="item" :class="item==4?'active':''" @click="changeItem(4)">资金流水</div>
            <div class="item" :class="item==5?'active':''" @click="changeItem(5)">成长值明细</div>
        </div>
        <div class="content">
            <div style="background: #fff;width: 100%;">
            <template v-if="item ==1">
                <!-- 用户信息 -->
                <div class="user-msg-wrap">
                    <div class="user-msg">
                        <div class="user-left">
                            <img class="user-avator" :src="userInfo.User_HeadImg" alt="">
                            <div class="user-phone">{{userInfo.User_Mobile}}</div>
                            <div class="user-level">{{userInfo.level_name}}</div>
                        </div>
                        <div class="user-right">
                            <table class="width:100%;height: 100%;color:#666;" cellspacing="0" cellpadding="0">
                                <tr class="first">
                                    <td>手机</td>
                                    <td>{{userInfo.User_Mobile}}</td>
                                    <td>姓名</td>
                                    <td>{{userInfo.User_Name}}</td>
                                </tr>
                                <tr>
                                    <td>性别</td>
                                    <td>{{userInfo.User_Gender}}</td>
                                    <td>年龄</td>
                                    <td>{{userInfo.User_Age}}</td>
                                </tr>
                                <tr>
                                    <td>昵称</td>
                                    <td>{{userInfo.User_NickName}}</td>
                                    <td>身份证号</td>
                                    <td>{{userInfo.User_IDNum}}</td>
                                </tr>
                                <tr>
                                    <td>传真</td>
                                    <td>{{userInfo.User_Fax}}</td>
                                    <td>QQ</td>
                                    <td>{{userInfo.User_QQ}}</td>
                                </tr>
                                <tr>
                                    <td>邮箱</td>
                                    <td>{{userInfo.User_Email}}</td>
                                    <td>公司</td>
                                    <td>{{userInfo.User_Company}}</td>
                                </tr>
                                <tr>
                                    <td>地区</td>
                                    <td>{{userInfo.area}}</td>
                                    <td>详细地址</td>
                                    <td>{{userInfo.User_Address}}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <!-- 统计信息start -->
                <div class="stat wzw-table">
                    <div class="order-title">
                        统计信息
                    </div>
                    <el-table
                        :data="statData"
                        >
                        <el-table-column
                        prop="mount"
                        label="消费金额"
                        width="124"
                        align="center">
                        </el-table-column>
                        <el-table-column
                        prop="amount"
                        label="订单总数"
                        width="124"
                        align="center">
                        </el-table-column>
                        <el-table-column
                        prop="balance"
                        label="可用余额"
                        width="124"
                        align="center">
                        </el-table-column>
                        <el-table-column
                        prop="integral"
                        label="可用积分"
                        width="124"
                        align="center">
                        </el-table-column>
                        <el-table-column
                        prop="grow"
                        label="成长值"
                        width="124"
                        align="center">
                        </el-table-column>
                        <el-table-column
                        prop="tickets"
                        label="剩余优惠券"
                        width="124"
                        align="center">
                        </el-table-column>
                        <el-table-column
                        prop="comments"
                        align="center"
                        width="124"
                        label="商品评价">
                        </el-table-column>
                        <el-table-column
                        prop="backorder"
                        align="center"
                        width="124"
                        label="退货记录">
                        </el-table-column>
                        <el-table-column
                        prop="loginTimes"
                        align="center"
                        width="124"
                        label="登录次数">
                        </el-table-column>
                        <el-table-column
                        prop="collect"
                        align="center"
                        width="124"
                        label="收藏产品">
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 统计信息end -->
                <div class="line"></div>
                <!-- 地址信息start -->
                <div class="address-msg wzw-table">
                    <div class="order-title">
                        地址管理
                    </div>
                    <el-table
                        :data="addData"
                        >
                        <el-table-column
                        prop="Address_Name"
                        label="姓名"
                        align="center"
                        width="187">
                        </el-table-column>
                        <el-table-column
                        prop="Address_Mobile"
                        label="手机号"
                        align="center"
                        width="202">
                        </el-table-column>
                        <el-table-column
                        prop="addinfo"
                        width="851"
                        align="center"
                        label="详细地址">
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 地址信息end -->
                 <div class="line"></div>
                <!-- 订单记录start -->
                <div class="order-msg wzw-table">
                    <div class="order-title">
                        订单记录
                    </div>
                    <el-table
                        :data="orderData"
                        >
                        <el-table-column
                        prop="Order_No"
                        label="订单号"
                        align="center"
                        width="187">
                        </el-table-column>
                        <el-table-column
                        prop="Order_TotalPrice"
                        label="订单金额"
                        align="center"
                        width="155">
                        </el-table-column>
                        <el-table-column
                        prop="Order_PaymentInfo"
                        width="148"
                        align="center"
                        label="支付方式">
                        </el-table-column>
                        <el-table-column
                        prop="env"
                        width="148"
                        align="center"
                        label="订单来源">
                        </el-table-column>
                        <el-table-column
                        prop="status_txt"
                        width="148"
                        align="center"
                        label="订单状态">
                        </el-table-column>
                        <el-table-column
                        prop="Order_CreateTime"
                        width="160"
                        align="center"
                        label="下单时间">
                        </el-table-column>
                        <el-table-column
                        prop="Order_Store"
                        width="148"
                        align="center"
                        label="所属门店">
                        </el-table-column>
                        <el-table-column
                        prop="hand"
                        width="148"
                        align="center"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope,orderData)" type="text" size="small">查看订单</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 订单记录end -->
            </template>
            <!-- 登录日志 -->
            <template v-if="item !=1">
                <div class="condition">
                    <template v-if="des[item]">
                        <span>{{des[item]}}来源：</span>
                        <el-select v-model="type" :placeholder="'请选择'+des[item]+'来源'" popper-class="my-select">
                            <el-option
                                v-for="(item,index) in types"
                                :key="index"
                                :label="item"
                                :value="index">
                            </el-option>
                        </el-select>
                    </template>
                        <div class="inline-block">
                            <span class="demonstration">变化时间：</span>
                            <el-date-picker
                            v-model="start_time"
                            type="datetime"
                            placeholder="选择开始时间"
                            value-format='yyyy-MM-dd HH:mm:ss'>
                            </el-date-picker>
                        </div>
                        <span class="cut-line">—</span>
                        <div class="inline-block endtime">
                            <!-- <span class="demonstration">默认</span> -->
                            <el-date-picker
                            v-model="end_time"
                            type="datetime"
                            placeholder="选择结束时间"
                            value-format='yyyy-MM-dd HH:mm:ss'>
                            </el-date-picker>
                        </div>
                        <el-button type="primary" class="query" @click="query">查询</el-button>
                        <el-button type="primary" class="export" @click="query('output')" v-if="item != 2">导出数据</el-button>
                    </div>
            </template>
            <template v-if="item == 2">
                <div class="logs-wrap wzw-table">
                    <el-table
                        :data="loginData"
                        :row-style="rowStyle"
                        :header-row-style="headerStyle"
                        >
                        <el-table-column
                            prop="login_time"
                            label="时间"
                            align="center"
                            width="310">
                        </el-table-column>
                        <el-table-column
                            prop="login_ip"
                            label="IP"
                            align="center"
                            width="310">
                        </el-table-column>
                        <el-table-column
                            prop="area"
                            width="310"
                            align="center"
                            label="地区">
                        </el-table-column>
                        <el-table-column
                            prop="source"
                            width="310"
                            align="center"
                            label="登录方式">
                        </el-table-column>
                    </el-table>
                </div>
            </template>
            <!-- 登录日志end -->
            <!-- 积分明细start -->
            <template v-if="item ==3">
                    <div class="detail-wrap wzw-table">
                    <el-table
                        :data="detailData"
                        :row-style="rowStyle"
                        :header-row-style="headerStyle"
                        >
                        <el-table-column
                            prop="source"
                            label="积分来源"
                            align="center"
                            width="206">
                        </el-table-column>
                        <el-table-column
                            prop="num"
                            label="积分变化"
                            align="center"
                            width="167">
                        </el-table-column>
                        <el-table-column
                            prop="surplus_num"
                            width="167"
                            align="center"
                            label="变化后剩余">
                        </el-table-column>
                        <el-table-column
                            prop="created_at"
                            width="224"
                            align="center"
                            label="变化时间">
                        </el-table-column>
                        <el-table-column
                            prop="descr"
                            width="262"
                            align="center"
                            label="备注">
                        </el-table-column>
                    </el-table>
                </div>
            </template>
            <!-- 积分明细end -->
            <!-- 资金流水start -->
            <template v-if="item ==4">
                <div class="detail-wrap wzw-table">
                    <el-table
                        :data="moneyData"
                        :row-style="rowStyle"
                        :header-row-style="headerStyle"
                        >
                        <el-table-column
                            prop="source"
                            label="余额来源"
                            align="center"
                            width="206">
                        </el-table-column>
                        <el-table-column
                            prop="num"
                            label="余额变化"
                            align="center"
                            width="167">
                        </el-table-column>
                        <el-table-column
                            prop="surplus_num"
                            width="167"
                            align="center"
                            label="变化后剩余">
                        </el-table-column>
                        <el-table-column
                            prop="created_at"
                            width="224"
                            align="center"
                            label="变化时间">
                        </el-table-column>
                        <el-table-column
                            prop="descr"
                            width="262"
                            align="center"
                            label="备注">
                        </el-table-column>
                    </el-table>
                </div>
            </template>
            <!-- 资金流水end -->
            <!-- 成长值start -->
             <template v-if="item ==5">
                    <div class="detail-wrap wzw-table">
                    <el-table
                        :data="groupData"
                        :row-style="rowStyle"
                        :header-row-style="headerStyle"
                        >
                        <el-table-column
                            prop="source"
                            label="成长值来源"
                            align="center"
                            width="206">
                        </el-table-column>
                        <el-table-column
                            prop="num"
                            label="成长值变化"
                            align="center"
                            width="167">
                        </el-table-column>
                        <el-table-column
                            prop="surplus_num"
                            width="167"
                            align="center"
                            label="变化后剩余">
                        </el-table-column>
                        <el-table-column
                            prop="created_at"
                            width="224"
                            align="center"
                            label="变化时间">
                        </el-table-column>
                        <el-table-column
                            prop="descr"
                            width="262"
                            align="center"
                            label="备注">
                        </el-table-column>
                    </el-table>
                </div>
            </template>
            <!-- 成长值end -->
            <div style="width: 100%;background:#fff">
                <el-pagination
                    background
                    :current-page.sync ="page"
                    layout="prev, pager, next,jumper"
                    :page-size = "pageSize"
                    :total="total"
                    @prev-click="prev"
                    @next-click="next"
                    @current-change="current">
                </el-pagination>
            </div>
          </div>
        <!-- <div style="width: 100%;background:#fff">
            <el-pagination
            background
            :current-page.sync ="page"
            layout="prev, pager, next"
            :page-size = "pageSize"
            :total="total"
            @prev-click="prev"
            @next-click="next"
            @current-change="current">
            </el-pagination>
        </div> -->
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue'
    import {
        getSysuser,
        getSysorders,
        getSysgrowths,
        getSysbalances,
        getSysintegrals,
        getSysloginLogs,
        getSysstatistics,
        getAddress
    } from '../common/fetch'
    import Component from 'vue-class-component'
    import {GetQueryByString} from '../common/utils';
    const User_ID = GetQueryByString(location.href,'user_id');
    @Component
    export default class UserList extends Vue{
        item = 1;
        des = {
            '3': '积分',
            '4': '余额',
            '5': '成长值'
        }
        type = ''
        types = {}
        userInfo = {};
        statInfo = {};
        total = 0; //总条数
        page = 1;
        pageSize = 10;
        switchValue = true;
        start_time = '';
        end_time = '';
        statData = [{
            mount: '',
            amount: '',
            balance: '',
            integral: '',
            grow: '',
            tickets: '',
            comments: '',
            backorder: '',
            loginTimes: '',
            collect: ''
        }]
        orderData = [{
            Order_ID: '',
            Order_TotalPrice: '',
            Order_PaymentInfo: '',
            env: '',
            status_txt: '',
            Order_CreateTime: '',
            Order_Store: '',
            link:''
        }]
        addData = []
        // 登录日志
        loginData = []
        // 积分明细
        detailData = []
        options = []
        // 余额明细
        moneyData = []
        // 成长值
        groupData = []
        handleClick(index,rows) {
            console.log(index,rows)
            let i = index.$index;
            window.location.href = rows[i].link;
        }
        rowStyle(){
            return 'color: #666;'
        }
        headerStyle() {
            return '';
            //return 'background-color:red;color:red;'
        }
        getDetailByPage(page) {
            this.page = page;
            if(this.item == 2) {
                // 请求日志
                this.get_syslogin_logs();
            }else if(this.item == 3) {
                // 积分明细
                this.get_sysintegrals();
            }else if(this.item == 4) {
                // 资金流水
                this.get_sysbalances();
            }else if(this.item == 5) {
                // 成长值明细
                this.get_sysgrowths();
            }else {
                // 首页订单记录
                this.get_sysorders();
            }
        }
        prev(page){
            this.getDetailByPage(page);
        }
        next(page){
            this.getDetailByPage(page);
        }
        current(page){
            this.getDetailByPage(page);
        }
        // 用户信息
        getSysuser(){
            getSysuser({User_ID}).then(res=>{
                this.userInfo = res.data;
            })
        }
        // 统计信息
        get_sysstatistics(){
            getSysstatistics({User_ID}).then(res=>{
                this.statData[0].mount = res.data.con_money;
                this.statData[0].amount = res.data.ord_count;
                this.statData[0].balance = res.data.user.User_Money;
                this.statData[0].integral = res.data.user.User_Integral;
                this.statData[0].grow = res.data.user.User_Grow;
                this.statData[0].tickets = res.data.cou_count;
                this.statData[0].comments = res.data.com_count;
                this.statData[0].backorder = res.data.bac_count;
                this.statData[0].loginTimes = res.data.log_count;
                this.statData[0].collect = res.data.fav_count;
            })
        }
        query(arg = ''){
            if(this.item == 2) {
                // 请求日志
                this.get_syslogin_logs();
            }else if(this.item == 3) {
                // 积分明细
                this.get_sysintegrals(arg);
            }else if(this.item == 4) {
                // 资金流水
                this.get_sysbalances(arg);
            }else if(this.item == 5) {
                // 成长值明细
                this.get_sysgrowths(arg);
            }
        }
        changeItem(num) {
            if(this.item == num) return;
            // 切换的时候 type变为空，时间变为0
            this.type = '';
            this.start_time = '';
            this.end_time = '';
            this.page = 1;
            this.item = num;
            if(num == 2) {
                // 请求日志
                this.get_syslogin_logs();
            }else if(num == 3) {
                // 积分明细
                this.get_sysintegrals();
            }else if(num == 4) {
                // 资金流水
                this.get_sysbalances();
            }else if(num == 5) {
                // 成长值明细
                this.get_sysgrowths();
            }
        }
        // 订单记录
        get_sysorders(){
            getSysorders({User_ID,page:this.page}).then(res=>{
                this.orderData = res.data;
                this.total = res.totalCount
            })
        }
        // 日志
        get_syslogin_logs(){
            getSysloginLogs({User_ID,start_time: this.start_time,end_time:this.end_time,page:this.page}).then(res=>{
                this.loginData = res.data;
                this.total = res.totalCount
            })
        }
        // 积分
        get_sysintegrals(arg = ''){
            getSysintegrals({User_ID,start_time: this.start_time,end_time:this.end_time,type:this.type,page:this.page, output: arg === 'output' ? 1 : 0}).then(res=>{
                if (arg === 'output') {
                  res.data.file_path && window.open(res.data.file_path, '_self');
                } else {
                  this.detailData = res.data;
                  this.types = res.types;
                  this.total = res.totalCount;
                }
            })
        }
        // 资金
        get_sysbalances(arg = ''){
            getSysbalances({User_ID,start_time: this.start_time,end_time:this.end_time,type:this.type,page:this.page, output: arg === 'output' ? 1 : 0}).then(res=>{
                if (arg === 'output') {
                  res.data.file_path && window.open(res.data.file_path, '_self');
                } else {
                  this.moneyData = res.data;
                  this.types = res.types;
                  this.total = res.totalCount;
                }
            })
        }
        // 成长值
        get_sysgrowths(arg = ''){
            getSysgrowths({User_ID,start_time: this.start_time,end_time:this.end_time,type:this.type,page:this.page, output: arg === 'output' ? 1 : 0}).then(res=>{
                if (arg === 'output') {
                  res.data.file_path && window.open(res.data.file_path, '_self');
                } else {
                  this.groupData = res.data;
                  this.types = res.types;
                  this.total = res.totalCount;
                }
            })
        }
        // 获取收货地址
        getAddress(){
            getAddress({User_ID}).then(res=>{
                this.addData = res.data;
                this.addData.forEach(item=>{
                    item.addinfo = item.Address_Province_name + item.Address_City_name + item.Address_Area_name + item.Address_Town_name;
                })
                console.log(this.addData);
            })
        }
        created(){
            console.log(User_ID,"sss")
            this.getSysuser()
            this.get_sysstatistics();
            this.get_sysorders();
            this.getAddress();
        }
    }
</script>
<style scoped lang="less">
  * {
    box-sizing: border-box;
  }
  .wrap {
    width:100%;
    padding: 20px 0 0 20px;
  }
  .inline-block {
    display: inline-block;
  }
  .title {
    display: flex;
    margin-bottom: 15px;
    .item {
      width: 100px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: #666;
      margin-right: 10px;
      background: #f8f8f8;
      text-align: center;
      cursor: pointer;
    }
    .item.active {
      background: #428CF7;
      color: #fff;
    }
  }
  .content {
    background: #f6f6f6;
    padding: 20px 0 20px 20px;
    // 分割线
    .line {
        width: 100%;
        height: 20px;
        background: #F6F6F6;
    }
    // 用户信息start
    .user-msg-wrap {
      background: #fff;
      padding: 20px 0 25px 20px;
      border-bottom: 20px solid #F6F6F6;
    }
    .user-msg {
      display: flex;
      width: 100%;
      height: 277px;
      box-sizing: border-box;
      overflow: hidden;
      .user-left {
        width: 306px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid #EAEAEA;
        border-right: 0;
        box-sizing: border-box;
        .user-avator {
          width: 75px;
          height: 75px;
          border-radius: 80px;
          margin-bottom: 14px;
        }
        .user-phone {
          font-size: 16px;
          color: #666;
        }
        .user-level {
          background: #428CF7;
          color: #fff;
          font-size: 14px;
          width: 92px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          margin-top: 15px;
          border-radius: 15px;
        }
      }
      .user-right {
        flex: 1;
        td {
          height: 45px;
          line-height: 45px;
          text-align: center;
          color: #666;
          border-left: 1px solid #EAEAEA;
          border-bottom: 1px solid #EAEAEA;
          // border: 1px solid #EAEAEA;
          border-top: 0;
          box-sizing: border-box;
        }
        & td:nth-child(2n+1) {
          background: #F9FAFC;
          width: 159px;
        }
        & td:nth-child(2n) {
          width: 307px;
          text-align: left;
          padding-left: 34px;
          box-sizing: border-box;
        }
        .first td {
          border-top: 1px solid #eaeaea;
        }
        & td:nth-child(4n) {
          border-right: 1px solid #eaeaea;
        }
      }
    }
    // 用户信息 end
    // 统计信息 start
    .stat,
    .address-msg,
    .order-msg {
        display: inline-block;
        padding: 20px 0 25px 20px;
        background: #fff;
        color: #333;
        .order-title {
            width: 1240px;
            text-align: center;
            font-size: 16px;
            margin-bottom: 20px;
        }
    }
    // 统计信息 end
    .el-pagination {
      padding: 7px 0 62px 20px;
      background: #fff;
      text-align: center;
      width: 1240px;
    }
    // 登录日志, 积分明细
    .logs-wrap,
    .detail-wrap {
        display: inline-block;
        padding:20px 0 20px 20px;
        background: #fff;
    }
    .condition {
      height: 60px;
      line-height: 60px;
      margin-bottom: 10px;
      background: #fff;
      padding-left: 30px;
      .el-button--primary {
        height: 30px;
        line-height: 30px;
        vertical-align: middle;
        padding: 0;
        text-align: center;
      }
      .query {
        width: 60px;
      }
      .export {
        width: 75px;
      }
    }
    .el-dropdown-link {
      cursor: pointer;
      color: #409EFF;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
    .el-select {
      width: 175px;
      height: 35px;
      margin-right: 40px;
    }
    .el-date-editor.el-input {
      width: 175px;
      height: 35px;
    }
    .cut-line {
      display: inline-block;
      width: 30px;
      text-align: center;
      color: #B4B4B4;
    }
    .endtime {
      margin-right: 24px;
    }
  }
</style>
