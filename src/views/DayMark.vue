<template>
    <div class="wrap">
        <div class="content">
            <el-form ref="form" :model="form">
                <div class="title">基本信息</div>
                <el-form-item label="活动名称：">
                    <el-input v-model="form.name" class="input-name"></el-input>
                </el-form-item>
                <el-form-item label="活动时间：">
                    每月 <el-date-picker type="date" placeholder="选择日期" v-model="form.date1"></el-date-picker>
                    <span class="line" ></span>
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date1"></el-date-picker>
                </el-form-item>
                <el-form-item label="活动性质">
                    <el-checkbox-group v-model="form.type">
                    <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                    <el-checkbox label="地推活动" name="type"></el-checkbox>
                    <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                    <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="特殊资源">
                    <el-radio-group v-model="form.resource">
                    <el-radio label="线上品牌商赞助"></el-radio>
                    <el-radio label="线下场地免费"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="活动形式">
                    <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">立即创建</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'

    export default class DayMark extends Vue{
        form = {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
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
            /deep/ .el-input__inner  {
                width: 140px;
                height: 40px;
            }
            .line {
                display: inline-block;
                width: 14px;
                height: 1px;
                margin: 0 10px;
                background: #B4B4B4;
            }
        }
    }
</style>