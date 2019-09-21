<template>
  <div>
    <div class="title" style="" v-show="eTitle"><div  class="leftText">{{eTitle}}</div></div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item inline-message
                    class="formitem"
                    label-width="110px"
                    @mouseenter.native="saveCurrentItem(item)"
                    :label="item.text"
                    v-for="(item, index) in activeAttr.attrData.content"
                    :key="index">

        <upload-img-components v-if="item.type === 'uploadImg'" class="myUploadImg" :onSuccess='uploadImg'
                               :type='item.uploadType'
                               :imgUrl='item.model'></upload-img-components>



        <div v-if="item.type === 'slider'">
          <el-slider @input='change(item)' show-input  v-model="item.model" :max="item.max" :min="item.min"></el-slider>
        </div>


        <el-input @blur="inputBlurEvent(item)" v-if="item.type === 'input'" autosize v-model="item.model" class="input"
                  @input='change(item)'
                  :type='item.inputType'></el-input>



<!--        activeItem[item.index].tooltip | pageTooltip-->
        <el-tooltip v-if="item.type === 'setlink'" class="item rightBtn" effect="dark"
                    :content="''| pageTooltip" placement="right">
<!--          v-if="0&&!activeItem[item.index].tooltip"-->
          <el-button v-if="0"  @click.prevent="selectPageShow = true">选择页面
          </el-button>
          <el-button v-else icon="el-icon-check" @click.prevent="selectPageShow = true">选择页面</el-button>
        </el-tooltip>

<!--        <bind-link v-model="selectPageShow" :checkedIndex='pageChecked' :data='currentData.customizeObject' @change='selectPagePath' />-->

        <div v-if="item.type==='addbtn'">
          <el-button @click="item.editCb"  type="primary"  size="small">{{item.label}}</el-button>
        </div>

        <div v-if="item.type==='arr'" class="arr-box">
          <div v-for="(arr_item,idx) in item.value" :key="idx" class="arr-row" style="background: #f2f2f2;padding: 20px;">
<!--            简单值-->
            <div class="flex" v-if="['text','number'].indexOf(item.row_type)!==-1">
              <span class="padding10-c">{{item.label}}</span> <el-input @input="item.inputCB(item)" class="flex1" v-model="item.value[idx]" />
            </div>

            <i class="el-icon-circle-close del-icon"></i>

          </div>
        </div>


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
import BindLinkComponents from '@/components/BindLinkComponents'
import uploadImgComponents from '@/components/common/uploadImgComponents'


//没有继承，是依靠vuex的数据。也不碍事啊
@Component({
    components:{BindLink:BindLinkComponents,uploadImgComponents},
    props:{
        // eTitle:{type:String, default:'属性设置'}
    },
    data(){
      return {
          selectPageShow:false,
          currentData:{},
          clickObj:{},
          color1:null
      }
    },
    filters: {
        pageTooltip(str) {
            if (str) return str;
            return '选择的链接将会显示在这里'
        }
    },
    computed:{
        eTitle(){
            return this.$store.state.tmplData.length>0 && this.$store.state.activeAttr.attrData.title?this.$store.state.activeAttr.attrData.title:''
        },
        activeAttr:{
            get(){
                return this.$store.state.activeAttr
            },
            set(nval){

                //this.setActiveAttr(navl)
            }
        },
        ...mapState(['tmplData'])
    },
    methods:{
        addInput(item) {
            let index = item.index;
            let value = JSON.parse(JSON.stringify(this.currentData.value[index]));
            this.currentData.value.splice(index, 0, value);
            this.currentData.setIndex(0, {
                value: false
            })
        },
        //用函数来校验灵活一点
        inputBlurEvent(item){

          if(!item.patternFunc)return;
          if(!item.patternFunc(item.model)){
              item.model = '';
              this.$fun.warning({msg:item.parrern_tip||'表单填写不符合要求'})
          }
        },
        uploadImg(response) {
            console.log(response);
            this.currentData.model = 'https://knowledges.qd101.net/uploads/20190921/183707ef00bcaa47dc813d3dd50c0061.jpg';//response.data.url;
            this.change(this.currentData)
        },
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

            if (item.editType && (item.editType === 'style' || item.editType === 'config' || item.editType === 'value')) {

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
            if (this.activeAttr.isSendAjax) return;
            this.currentData = item
        },
        ...mapActions(['setActiveAttr'])
    },

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

    pageChecked() {
        // debugger
        // if (Object.keys(this.currentData).length === 0) return undefined;
        // let index = this.currentData.index;
        // if (typeof this.currentData.index === 'undefined') {
        //     return undefined
        // }
        // if (!this.activeItem[index]) return undefined;
        //
        // return {
        //     type: this.activeItem[index].linkType,
        //     id: this.activeItem[index].id
        // }
    }

    selectPagePath(data) {
        // let {tooltip, type, path, dataItem, dataType} = data;
        // let index = this.currentData.index;
        //
        // // this.activeData.config.setValueCb && this.activeData.config.setValueCb()
        //
        // this.$set(this.activeItem[index], 'tooltip', tooltip);
        // this.$set(this.activeItem[index], 'link', path);
        // this.$set(this.activeItem[index], 'linkType', type);
        // this.$set(this.activeItem[index], 'dataItem', dataItem);
        // this.$set(this.activeItem[index], 'id', dataItem.id);
        // this.$set(this.activeItem[index], 'type', dataType);
        // this.$set(this.activeItem[index], 'show', true);
        //
        // if (typeof this.currentData.selectLink.checkedPageCb === 'function') {
        //     let data = this.currentData.selectLink.checkedPageCb(this.activeItem[index], this.activeData);
        //     let {assignment} = data;
        //     if (assignment) return;
        //     data = deepCopy(this.activeItem[index], data);
        //     data.linkType = type;
        //     data.tooltip = tooltip;
        //     data.id = dataItem.id;
        //
        //     this.$set(this.activeItem, index, data)
        // }
    }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .fun-color-pick .el-color-picker__icon.el-icon-arrow-down{display:none}
</style>
<style scoped lang="less">
@import "../assets/css/variable.less";

.title{
  display: flex;
  line-height: 18px;
  height: 18px;
  padding-left: 10px;
  border-left: 2px solid rgb(63, 142, 243);
  margin-bottom: 25px;
}

.arr-box{
  .arr-row{
    position:relative;
    margin-bottom: 20px;
    span{
      color: #666;
    }
    .del-icon{
      position: absolute;
      right: -14px;
      top: -14px;
      font-size: 28px;
      color: #999;
      cursor: pointer;
      &:hover{
        color: @danger;
      }
    }
  }
}

</style>
