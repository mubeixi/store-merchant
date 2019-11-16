<template>
  <div class="setting">
    <el-dialog
      title="佣金设置"
      width="70%"
      @close="cancel"
      append-to-body
      :visible.sync="isShow"
    >

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ruleForm">
        <div class="commissionDiv">
          <div class="titles">
              发放比例
          </div>
          <div>
            <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
              <el-input  size="mini" style="width: 80px;margin-left: 19px;"></el-input>
                % <span class="msg">（发放金额所占网站利润的百分比；小于100%大于0%）</span>
            </el-form-item>
          </div>
        </div>
        <div class="commissionDiv">
          <div class="titles">
            爵位奖励比例
          </div>
          <div>
            <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
              <el-input  size="mini" style="width: 80px;margin-left: 19px;"></el-input>
              % <span class="msg">（所占发放比例的百分比）</span>
            </el-form-item>
          </div>
        </div>
        <div class="commissionDiv">
          <div class="titles">
            区域代理比例
          </div>
          <div>
            <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
              <el-input  size="mini" style="width: 80px;margin-left: 19px;"></el-input>
              % <span class="msg">（所占发放比例的百分比）</span>
            </el-form-item>
          </div>
        </div>
        <div class="commissionDiv">
          <div class="titles">
            股东佣金比例
          </div>
          <div>
            <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
              <el-input  size="mini" style="width: 80px;margin-left: 19px;"></el-input>
              % <span class="msg">（所占发放比例的百分比）</span>
            </el-form-item>
          </div>
        </div>
        <div class="commissionDiv">
          <div class="titles">
            佣金比例
          </div>
          <div>
            <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
              <el-input  size="mini" style="width: 80px;margin-left: 19px;"></el-input>
              % <span class="msg">（下面佣金返利所占发放比例比例的百分比）</span>
            </el-form-item>
          </div>
        </div>
        <div class="commissionLast">
          <div class="titles">
            佣金返利 (全部统一)
          </div>
          <div class="aiHai">
                <div class="fenxiaoshang">
                    <div class="fenTitle">普通分销商</div>
                    <div>
                      <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
                        一级
                        <el-input  size="mini" style="width: 70px"></el-input>
                        % <span class="msg">（佣金比例的百分比）</span>
                      </el-form-item>
                      <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
                        二级
                        <el-input  size="mini" style="width: 70px"></el-input>
                        % <span class="msg">（佣金比例的百分比）</span>
                      </el-form-item>
                      <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
                        自销佣金
                        <el-input  size="mini" style="width: 70px"></el-input>
                        % <span class="msg">（佣金比例的百分比）</span>
                      </el-form-item>
                    </div>
                </div>
                <div class="fenxiaoshang">
                  <div class="fenTitle">普通分销商</div>
                  <div>
                    <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
                      一级
                      <el-input  size="mini" style="width: 70px"></el-input>
                      % <span class="msg">（佣金比例的百分比）</span>
                    </el-form-item>
                    <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
                      二级
                      <el-input  size="mini" style="width: 70px"></el-input>
                      % <span class="msg">（佣金比例的百分比）</span>
                    </el-form-item>
                    <el-form-item label="" prop="sort" style="margin-bottom: 0px;">
                      自销佣金
                      <el-input  size="mini" style="width: 70px"></el-input>
                      % <span class="msg">（佣金比例的百分比）</span>
                    </el-form-item>
                  </div>
                </div>
          </div>
        </div>



      </el-form>
            <div class="sure">
              <span class="spans">确认</span>
            </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "SettingComponent",
        props: {
            show: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isShow:false,
                ruleForm:{

                },
                rules:{

                }
            }
        },
        watch:{
            show: {
                immediate: true,
                handler(val) {
                    this.isShow = val;
                }
            }
        },
        methods:{
            cancel(){
                this.$emit('cancel');
            }
        }
    }

</script>

<style scoped lang="less">
  @border:#DBDBDB;
.setting{
  font-size: 14px;
  color: #666666;
  margin-left: 0px;
}
.commissionDiv{
  display: flex;
  align-items: center;
  height: 50px;
  align-items: center;
  border:1px solid @border;
  border-bottom: 0px;
}

  .titles{
    width: 220px;
    text-align: center;
    line-height: 50px;
    height: 50px;
    border-right: 1px solid @border;
  }
.msg{
  color: #999999;
}
 .commissionLast{
   display: flex;
   align-items: center;
   text-align: center;
   border: 1px solid @border;
 }
.aiHai{
  padding: 19px 29px 30px 21px;
  background-color: #FFFFFF;
  display: flex;
}
  .fenxiaoshang{
    background-color: #F8F8F8;
    width: 320px;
    margin-right: 15px;
  }
  .fenTitle{
    font-size: 16px;
    color: #333333;
    height: 41px;
    line-height: 41px;
    text-align: center;
    border-bottom: 1px dotted #C0C0C0;
  }

  .sure{
    height: 38px;
    width: 100%;
    padding-top: 26px;
    .spans{
      width: 77px;
      height: 38px;
      display: block;
      line-height: 38px;
      text-align: center;
      font-size: 16px;
      color: #FFFFFF;
      background-color: #428CF7;
      line-height:34px;
      margin: 0 auto;
    }
  }
</style>
