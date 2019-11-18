<template>
    <div class="page-wrap">
        <div class="content">
            <div class="tabs">
                <div class="tab">
                    <div class="tab-item item1">
                        <img src="../assets/img/marketing/v.png" alt="">
                    </div>
                    <div class="tab-item item2">
                        会员日营销
                    </div>
                    <div class="tab-item item3">
                        立即新建
                    </div>
                    <img src="../assets/img/marketing/bg1.png" alt="">
                </div>
                <div class="tab">
                    <div class="tab-item item1">
                        <img src="../assets/img/marketing/s.png" alt="">
                    </div>
                    <div class="tab-item item2">
                        生日营销
                    </div>
                    <div class="tab-item item3">
                        立即新建
                    </div>
                    <img src="../assets/img/marketing/bg2.png" alt="">
                </div>
                <div class="tab">
                    <div class="tab-item item1">
                        <img src="../assets/img/marketing/j.png" alt="">
                    </div>
                    <div class="tab-item item2">
                        节日营销
                    </div>
                    <div class="tab-item item3">
                        立即新建
                    </div>
                    <img src="../assets/img/marketing/bg3.png" alt="">
                </div>
            </div>
            <!-- 筛选start -->
            <div class="condition">
                <el-select v-model="type" placeholder="请选择活动类型">
                    <el-option
                    v-for="item in types"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-select class="select2" v-model="state" placeholder="请选择活动状态">
                <el-option
                v-for="item in states"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-input class="input-name" v-model="active_name" placeholder="请输入活动名称"></el-input>
            <el-button type="primary" >查询</el-button>
            </div>
            <!-- 筛选end -->
            <!-- 列表start -->
            <div class="list">
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="活动名称"
                        width="239">
                    </el-table-column>
                    <el-table-column
                        prop="type"
                        label="活动类型"
                        width="187">
                    </el-table-column>
                    <el-table-column
                        prop="time"
                        label="活动时间"
                        width="219">
                    </el-table-column>
                    <el-table-column
                        prop="area"
                        label="会员范围"
                        width="191">
                    </el-table-column>
                    <el-table-column
                        prop="state"
                        label="状态"
                        width="145">
                    </el-table-column>
                    <el-table-column
                        prop="handle"
                        label="操作"
                        width="254">
                         <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
                            <el-button type="text" size="small">编辑</el-button>
                            <el-button type="text" size="small">删除</el-button>
                            <el-button type="text" size="small">终止</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 列表end -->
            <!-- 分页start -->
            <div class="fenye">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="1000">
                </el-pagination>
            </div>
            <!-- 分页end -->

        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'
    @Component
    export default class Marketing extends  Vue{
        active_name = ''
        types = [{
          value: 'type1',
          label: '类型1'
        }, {
          value: 'type2',
          label: '类型2'
        }]
        states = [{
            value: 'state1',
            label: '状态1'
        },{
            value: 'state2',
            label: '状态2'
        }]
        type = ''
        state = ''
        tableData = [{
            name:'会员日回馈老用户活动',
            type: '会员日营销',
            time: '每周 周一',
            area: '全部等级会员',
            state: '未开始',
            handle: '删除'
        }]
    }
</script>

<style scoped lang="less">
    html,body {
        height: 100%;
    }
    .page-wrap {
        height:100%;
        background: #f6f6f6;
        padding: 20px 0 0 20px;
    }
    .content {
        height: 100%;
        padding: 15px 0 0 14px;
        background: #fff;
        .tabs {
            width: 1240px;
            display: flex;
            justify-content: space-between;
            .tab {
                position: relative;
                .tab-item {
                    position: absolute;
                }
                .item1 {
                    top: 70px;
                    left: 58px;
                }
                .item2 {
                    top: 73px;
                    left: 125px;
                    font-size:22px;
                    color: #fff;
                    font-weight: 700;
                }
                .item3 {
                    top: 126px;
                    left: 125px;
                    width:90px;
                    height:35px;
                    color: #fff;
                    line-height: 35px;
                    text-align: center;
                    border:1px solid rgba(255,255,255,1);
                    border-radius:5px;
                    cursor: pointer;
                }
            }
        }
        .condition {
            display: flex;
            align-items: center;
            padding-left: 6px;
            margin-top: 47px;
            margin-bottom: 20px;
            .el-input {
                width: 175px;
                height: 35px !important;
                line-height: 35px !important;
            }
            /deep/ .el-input__inner {
                height: 35px ;
                line-height: 35px;
            }
            .input-name {
                margin: 0 20px 0 10px;
            }
            .select2 {
                margin-left: 20px;
            }
            /deep/ .el-button  {
                width: 60px;
                height: 30px;
                line-height: 30px;
                padding: 0;
            }
        }
        .list {
            /deep/ .el-table {
                .el-table--scrollable-x .el-table__body-wrapper {
                    overflow: hidden !important;
                }
                th {
                    text-align: center;
                    border-bottom: 0;
                    border-left: 1px solid #eaeaea;
                    border-top: 1px solid #eaeaea;
                    background-color: #F9FAFC;
                    color: #333;
                }
                & th:nth-last-child(2) {
                    border-right: 1px solid #eaeaea;
                }
            }
            /deep/ .el-table {
                td {
                    color: #666;
                    text-align: center;
                    border-left: 1px solid #eaeaea;
                    border-top: 1px solid #eaeaea;
                    border-bottom: 0;
                }
                & td:last-child {
                    border-right: 1px solid #eaeaea;
                }
                .el-table__body {
                    border-bottom: 1px solid #eaeaea;
                }
            }
            /deep/ .el-table::before {
                width: 0;
            }
        }
        .fenye {
            margin-top: 48px;
            width: 1240px;
            text-align: center;
            padding-bottom: 76px;
        }
    }
</style>