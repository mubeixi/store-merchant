<template>
  <div class="labelManagement">
    <div class="labelMain">
      <div class="crowdName" style="margin-bottom: 10px;">
        我的人群
      </div>
      <el-tabs  v-model="tabs">
        <el-tab-pane label="自定义人群" name="first">
          <div @click="crowdAdd" class="crowdAdd current">新建人群</div>
          <el-table
            :data="tableData"
            border
            class="wzw-tableS"
            style="width: 80%">
            <el-table-column
              align="center"
              label="人群名称"
              prop="name"
              width="230">
            </el-table-column>
            <el-table-column
              align="center"
              label="人群定义"
              prop="name"
              >
              <template slot-scope="scope">
                <template v-for="(item,index) of tableData[scope.$index].conditions" >
                  <div class="divLeft" v-if="index==0">{{item}}</div>
                </template>
                <div @click="lookDetail(scope.$index)"  class="divLeft curr" v-if="tableData[scope.$index].conditions">查看详情</div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="人群数量"
              prop="group_num"
              width="140">
            </el-table-column>
            <el-table-column
              align="center"
              label="更新时间"
              prop="updated_at"
              width="170">
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              width="250"
            >
              <template slot-scope="scope">
                <span @click="showStep(tableData[scope.$index].id)" class="spans current">操作</span><span class="spans">|</span><span @click="ediT(tableData[scope.$index].id)"  class="spans current">编辑</span><span class="spans">|</span><span @click="delList(tableData[scope.$index].id)" class="spans current">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
<!--        <el-tab-pane label="推荐人群" name="second">-->
<!--          <el-table-->
<!--            class="wzw-tableS"-->
<!--            :data="tableData"-->
<!--            border-->
<!--            style="width: 80%">-->
<!--            <el-table-column-->
<!--              prop="date"-->
<!--              label="人群名称"-->
<!--              align="center"-->
<!--              width="230">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="name"-->
<!--              label="人群定义"-->
<!--              align="center"-->
<!--            >-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="address"-->
<!--              align="center"-->
<!--              label="推荐理由">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              prop="time"-->
<!--              align="center"-->
<!--              width="140"-->
<!--              label="人群数量">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              label="操作"-->
<!--              align="center"-->
<!--              width="140"-->
<!--            >-->
<!--              <template slot-scope="scope">-->
<!--                <span class="spans">短信群发</span></template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </el-tab-pane>-->
      </el-tabs>
      <el-pagination
        :page-size="pageSize"
        :total="totalCount"
        @current-change="currentChange"
        background
        class="pagination"
        layout="prev, pager, next">
      </el-pagination>



      <el-dialog
        :visible.sync="isStep"
        @close="stepClose"
        append-to-body
        center
        class="setting"
        title="选择操作"
        width="40%"
      >
<!--          <div class="divLin">-->
<!--            <span class="curr" @click="goMessage">群发短信</span>-->
<!--            <span class="marginLe">此处是群发短信相关解释说明此处是群发短信解释说明</span>-->
<!--          </div>-->

        <div class="divLin">
          <span class="curr" @click="goStation">群发站内信</span>
          <span class="marginLe">此处是群发站内信相关解释说明</span>
        </div>

        <div class="divLin">
          <span class="curr" @click="labelSetting">设置标签</span>
          <span class="marginLe">此处是设置标签相关解释说明此处是群发短信解释说明</span>
        </div>

        <div class="divLin">
          <span class="curr" @click="goCoupon">赠送优惠券</span>
          <span class="marginLe">此处是赠送优惠券相关解释说明此处是群发短信解释说明</span>
        </div>

        <div class="divLin">
          <span class="curr" @click="goGifts">赠送赠品</span>
          <span class="marginLe">此处是赠送赠品相关解释说明此处是群发短信解释说明</span>
        </div>



      </el-dialog>



      <el-dialog
        :visible.sync="isLabel"
        @close="labelClose"
        append-to-body
        center
        class="setting"
        title="设置标签"
        width="30%"
      >
        <el-form size="small">
          <el-form-item  label="人群对象："  >
            <el-select  placeholder="请选择"   style="width: 200px"  v-model="crowdValue">
                    <template v-for="(shop,shopIn) in crowdList">
                      <el-option :label="shop.group_name" :value="shop.id"></el-option>
                    </template>
            </el-select>
          </el-form-item>

          <el-form-item  label="选择标签："  >
            <el-select  placeholder="请选择"   style="width: 200px" v-model="labelValue">
                    <template v-for="(label,labelIndex) in labelList">
                      <el-option :label="label.tag_name" :value="label.id"></el-option>
                    </template>
            </el-select>
          </el-form-item>


          <el-button size="small"  class="cancel" @click="labelClose">取消</el-button>
          <el-button size="small" :loading="loading" type="primary" class="spanButton" @click="saveCrowd">保存</el-button>
        </el-form>

      </el-dialog>




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
    import  {getCrowds,delCrowd,initCrowd,tagCrowd} from  '@/common/fetch'

    @Component({
        mixins:[],
        components: {

        }
    })

    export default class AddProduct extends Vue {
        isStep=false //是否显示操作弹窗
        idCrowd=0
        crowdList=[]
        labelList=[]
        crowdValue=''
        labelValue=''
        loading=false
        //关闭弹窗
        stepClose(){
            this.isStep=false
        }
        //显示弹窗
        showStep(id){
            this.idCrowd=id
            this.isStep=true
        }

        isLabel=false  //是否显示设置标签
        //取消设置标签
        labelClose(){
            this.isLabel=false
        }

        //设置标签
        labelSetting(){
            if(this.crowdList.length>0){
                this.crowdValue=this.idCrowd
            }
            this.isStep=false
            this.isLabel=true
        }
        //跳转群发短信
        goMessage(){
            this.$router.push({
                name: 'MessageSend',
                params: {
                    id:this.idCrowd
                }
            })
        }
        //跳转站内信
        goStation(){
            this.$router.push({
                name: 'MessageStationSend',
                params: {
                    id:this.idCrowd
                }
            })
        }
        //赠送优惠券
        goCoupon(){
            this.$router.push({
                name: 'CouponGift',
                params: {
                    id:this.idCrowd
                }
            })
        }
        //赠送赠品
        goGifts(){
            this.$router.push({
                name: 'GiftsGift',
                params: {
                    id:this.idCrowd
                }
            })
        }
        //保存标签
        saveCrowd(){
            this.loading=true
              let data={
                  crowd_id:this.crowdValue,
                  tag_id:this.labelValue
              }

            tagCrowd(data).then(res=>{
                if(res.errorCode==0){
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                    let that=this
                    setTimeout(function () {
                        that.isLabel=false
                    },1000)
                }
            })
            this.loading=false
        }



        //tab选项的值
        tabs='first'
        tableData=[]
        page=1
        totalCount=0
        pageSize=10
        getList(){
            let data={
                page:this.page,
                pageSize:this.pageSize
            }
            getCrowds(data).then(res=>{
                if(res.errorCode==0){
                    this.totalCount=res.totalCount
                    this.tableData=res.data
                }
            })
        }
        crowdAdd(){
            this.$router.push({
                name:'CrowdName'
            })
        }

        lookDetail(index){
            let arr=``
            for(let item of this.tableData[index].conditions){
                arr+=`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${item}</br>`
            }
            this.$alert(arr, '人群定义', {
                dangerouslyUseHTMLString: true
            });
        }
        currentChange(val){
            this.page=val
            this.getList()
        }
        //编辑人群
        ediT(id){
            this.$router.push({
                name: 'CrowdName',
                query:{
                    id:id
                }
            })
        }
        //删除人群
        delList(id){
            this.$confirm('你确定要删除这个人群吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delCrowd({id:id}).then(res=>{
                    if(res.errorCode==0){
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.getList();
                    }else{
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        });
                    }
                })
            }).catch(() => {

            })
        }

        async created(){

            await this.getList()

            //获取标签 人群下拉列表
            await initCrowd({type:2}).then(res=>{
                if(res.errorCode==0){
                    this.labelList=res.data.tags
                    this.crowdList=res.data.crowds
                }
            })
        }




    }

</script>

<style lang="less" scoped>
  @bgColor:#428CF7;

  .labelManagement{
    background-color: #f6f6f6;
    padding-top: 18px;
    padding-left: 19px;
    width: 100%;
    box-sizing: border-box;
    .labelMain{
      background-color: #FFFFFF;
      width: 100%;
      box-sizing: border-box;
      padding-top: 30px;
      padding-left: 24px;
    }
  }

  .crowdName{
    font-size: 16px;
    color: #333333;
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    background-color: #F8F8F8;
    margin-right: 100px;
  }
  .crowdAdd{
    margin-bottom: 15px;
    width:80px;
    height:34px;
    background:rgba(66,140,247,1);
    font-size: 14px;
    color: #F3F3F3;
    text-align: center;
    line-height: 34px;
    margin-top: 24px;
  }
  .pagination{
    padding-top: 73px;
    margin-left: 30%;
  }
  .spans{
    color: @bgColor;
    margin-left: 2px;
    margin-right: 2px;
  }
  .wzw-tableS th {
    color: #333333 !important;
    background-color: #F9FAFC !important;
    border: none !important;
    border-top: 1px solid #EAEAEA !important;
    border-left: 1px solid #EAEAEA !important;
  }
  .divLeft{
    line-height: 20px;
    text-align: left;
    margin-left: 30px;
  }
  .curr{
    color: #428CF7;
    cursor: pointer;
  }
  .current{
    cursor: pointer;
  }
  .marginLe{
    color: #9E9E9E;
    margin-left: 20px;
  }

  .divLin{
    height: 40px;
    line-height: 40px;
  }
  .spanButton{
    margin-top: 50px;
    margin-left: 50px;
  }
  .cancel{
    margin-top: 50px;
    margin-left: 90px;
  }

</style>
