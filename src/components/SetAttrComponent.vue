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
          <el-radio v-for="(radio, ind) in item.value" :key="ind" :label="radio.value"
                    @change="radioChange(radio, item)">{{ radio.value }}
          </el-radio>
        </el-radio-group>

        <el-color-picker
          show-alpha
          v-if="item.type === 'color'"
          v-model="item.model"
          class="inputcolor fun-color-pick"
          format="rgb"
          @on-active-change="colorEv"
          @click.native="colorClick(item)"
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
        change(item, imgUrl, index, isInput) {
            if (isInput) window.isInput = true
            // setTimeout(function () {
            // 	window.isInput =false
            // },100)
            //console.log(item)

            if (
                item.editType &&
                (item.editType === 'style' || item.editType === 'config')
            ) {
                if (!window.ActiveAttrObj.activeAttr[item.editType])
                    window.ActiveAttrObj.activeAttr[item.editType] = {}

                let editObj = window.ActiveAttrObj.activeAttr[item.editType]

                //console.log('根据配置修改')
                //写法
                if (item.editObj)
                    item.editObj.map(key => (editObj = editObj[key]))

                if (item.editCb) {
                    editObj[item.editKey] = item.editCb(item)
                } else {
                    editObj[item.editKey] = item.model
                }
            } else if (item.editType === 'sort') {
                item.editCb(item)
            } else {
                //这里最主要的就是一次回调

                let index = item.index
                    ? item.index
                    : window.ActiveAttrObj.activeAttr.activeIndex

                //console.log(index,item,window.ActiveAttrObj,window.ActiveAttrObj.activeAttr.value[index][item.editKey])

                //返回值就可以了。
                if (window.ActiveAttrObj.activeAttr.tag && window.ActiveAttrObj.activeAttr.tag.indexOf('switchNav') != -1) {
                    window.ActiveAttrObj.activeAttr.value[index][item.editKey] = typeof item.editCb === 'function' ? item.editCb(item, imgUrl) : item.model
                } else {
                    //这里又改一遍
                    window.ActiveAttrObj.activeAttr.value[index][item.editKey] = typeof item.editCb === 'function' ? item.editCb(item, imgUrl) : item.model
                }

                // = rt
            }
            // debugger
            if (item.removeData && this.uploadStatus === undefined)
                item.removeData(item)

            // console.log(window.ActiveAttrObj)
        },
        colorEv(val) {
            this.color1 = val
            this.clickObj.model = val
        },
        colorClick(item) {
            this.clickObj = item
            //this.change(item)
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
        ...mapActions(['activeAttr'])
    },
    computed:{
        activeAttr:{
            get(){
                return this.$store.state.activeAttr
            },
            set(nval){

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
