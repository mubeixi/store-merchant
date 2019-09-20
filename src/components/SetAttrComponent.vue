<template>
  <div>
    <div class="title" style=""><div class="leftText">{{eTitle}}</div></div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item inline-message
                    class="formitem"
                    label-width="110px"
                    @mouseenter.native="saveCurrentItem(item)"
                    :label="item.text"
                    v-for="(item, index) in activeAttr.attrData.content"
                    :key="index">

        <Uploadimg v-if="item.type === 'uploadImg'" class="myUploadImg" :onSuccess='uploadImg'
                   :type='item.uploadType'
                   :imgUrl='item.model'></Uploadimg>

        <el-input v-if="item.type === 'input'" autosize v-model="item.model" class="input"
                  @input='change(item)'
                  :type='item.inputType'></el-input>

        <el-tooltip v-if="showPage(item) === 'array'" class="item rightBtn" effect="dark"
                    :content="activeItem[item.index].tooltip | pageTooltip" placement="right">
          <el-button v-if="!activeItem[item.index].tooltip" @click.prevent="selectPageShow = true">选择页面
          </el-button>
          <el-button v-else icon="el-icon-check" @click.prevent="selectPageShow = true">选择页面</el-button>
        </el-tooltip>

        <el-button v-if="item.removeBtn" class="rightBtn" @click.prevent="removeInput(item, index)"
                   icon='el-icon-minus'></el-button>

        <el-button v-if="item.addBtn" class="rightBtn" @click.prevent="addInput(item, index)"
                   icon='el-icon-plus'></el-button>

        <el-switch v-if="item.type === 'switch'" v-model="item.model"
                   @change='switchChange(item)'></el-switch>

        <el-alert v-if="item.propmt" :title="item.propmt.text" :type='item.propmt.type'
                  :style='{lineHeight: "26px"}'
                  :closable='item.propmt.closable'/>

        <el-radio-group v-model="item.model" v-if="item.type === 'radio'">
          <el-radio v-for="(radio, ind) in item.value" :key="ind" :label="radio.value" @change="radioChange(radio, item)">{{ radio.label }}</el-radio>
        </el-radio-group>

        <el-color-picker
          show-alpha
          v-if="item.type === 'color'"
          v-model="item.model"
          class="inputcolor fun-color-pick"
          format="rgb"
          @change="colorEv"
        />

      </el-form-item>
<!--      <el-form-item>-->
<!--        <el-button type="primary" @click="onSubmit">立即创建</el-button>-->
<!--        <el-button>取消</el-button>-->
<!--      </el-form-item>-->
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State, Action, Getter } from 'vuex-class';
import {mapActions,mapState} from "vuex";

//没有继承，是依靠vuex的数据。也不碍事啊
@Component({
    props:{
        eTitle:{type:String, default:'属性设置'}
    },
    data(){
      return {
          currentData:null,
          clickObj:{},
          color1:null
      }
    },
    methods:{
        radioChange(radio, item) {

            //if (typeof item.attrData === 'function') item.attrData(this.activeData, radio);
            this.change(item)
        },
        change(item, imgUrl, index, isInput) {
            if (isInput) window.isInput = true
            // setTimeout(function () {
            // 	window.isInput =false
            // },100)
            console.log(item)
            console.log('修改类别是'+item.editType+'修改字段是'+item.editKey)

            if (item.editType && (item.editType === 'style' || item.editType === 'config')) {

                if (!this.activeAttr[item.editType]){
                    this.activeAttr.activeAttr[item.editType] = {}
                }

                //config{} 或者style{}
                let editObj = this.activeAttr[item.editType]

                //console.log('根据配置修改')


                //就不要用这个了吧。如果涉及到复杂的话，就统一写在editCB里面好了
                // if (item.editObj){
                //     item.editObj.map(key => {
                //         editObj = editObj[key]
                //     })
                // }

                //有回调函数的,可以去函数里面做各种关联操作和格式化操作。比如像素加px，颜色值的转换之类，json转换之类。简单值的就直接走下面赋值了
                if (item.editCb) {
                    editObj[item.editKey] = item.editCb(item)
                } else {
                    editObj[item.editKey] = item.model
                }
            } else if (item.editType === 'sort') {
                item.editCb(item)
            } else {
                //这里最主要的就是一次回调

                //let index = item.index ? item.index : this.activeAttr.activeIndex

                //console.log(index,item,window.ActiveAttrObj,window.ActiveAttrObj.activeAttr.value[index][item.editKey])

                //返回值就可以了。
                // if (this.activeAttr.tag && this.activeAttr.tag.indexOf('switchNav') != -1) {
                //
                //     this.activeAttr.value[index][item.editKey] = typeof item.editCb === 'function' ? item.editCb(item, imgUrl) : item.model
                //
                // } else {
                //
                //     //既然已经是model绑定了，为什么这里又改一遍?
                //     this.activeAttr.value[index][item.editKey] = typeof item.editCb === 'function' ? item.editCb(item, imgUrl) : item.model
                //
                // }

                // = rt
            }
            // debugger
            if (item.removeData && this.uploadStatus === undefined)
                item.removeData(item)

            // console.log(window.ActiveAttrObj)
        },
        colorEv(val) {

            // this.color1 = val
            // this.clickObj.model = val
            //用这个代替是一样的
            this.change(this.currentData)
        },
        colorClick(item) {

        },
        showPage(item) {
            if (Array.isArray(this.activeAttr.value)) {
                if (item.selectLink && item.selectLink.show) return 'array';
                return false
            } else if (typeof this.activeAttr.value === 'object') {
                if (item.selectLink && item.selectLink.show) return 'object';
                return false
            }
        },
        saveCurrentItem(item) {
            // if (this.activeAttr.isSendAjax) return;
            this.currentData = item
        },
        ...mapActions(['setActiveAttr'])
    },
    computed:{
        activeAttr:{
            get(){
                return this.$store.state.activeAttr
            },
            set(nval){
                this.setActiveAttr(navl)
            }
        }
    }
})


export default class SetAttrComponent extends Vue {


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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .fun-color-pick .el-color-picker__icon.el-icon-arrow-down{display:none}
</style>
<style scoped lang="stylus">
.title{
  display: flex;
  line-height: 18px;
  height: 18px;
  padding-left: 10px;
  border-left: 2px solid rgb(63, 142, 243);
  margin-bottom: 25px;
}

</style>
