<template>
  <div v-show="tmplData[0] && tmplData[0].length>0" @click="taggleEditStatus">
    <div class="title" style="" v-show="eTitle">
      <div class="leftText">{{eTitle}}</div>
    </div>
    <el-form ref="form" :model="form" :label-width="activeAttr.attrData.labelSize==='L'?'100px':'80px'">
      <el-form-item inline-message
                    class="formitem"
                    :label="item.text"
                    @mouseenter.native="saveCurrentItem(item)"
                    v-if="(item.type==='arr' && item.value.length>0) ||item.type!='arr'"
                    v-for="(item, index) in activeAttr.attrData.content"
                    :key="index">

        <upload-img-components v-if="item.type === 'uploadImg'" :tip="item.tip" class="myUploadImg"
                               :onSuccess='uploadImg'
                               :type='item.uploadType'
                               :imgUrl='item.model'></upload-img-components>


        <div v-if="item.type === 'slider'">
          <el-slider @input='change(item)' show-input v-model="item.model" :max="item.max"
                     :min="item.min"></el-slider>
        </div>


        <el-input @blur="inputBlurEvent(item)" v-if="item.type === 'input'" autosize
                  v-model="item.model" class="input"
                  @input='change(item)'
                  :type='item.inputType'></el-input>


        <!--        activeItem[item.index].tooltip | pageTooltip-->
        <el-tooltip v-if="item.type === 'setlink'" class="item rightBtn" effect="dark"
                    :content="item.model.tooltip| pageTooltip" placement="right">
          <!--          v-if="0&&!activeItem[item.index].tooltip"-->
          <el-button size="small" v-if="item.model.link==''" @click="openBindLinkBase(item)">选择页面
          </el-button>
          <el-button size="small" v-else icon="el-icon-check" @click="openBindLinkBase(item)">选择页面
          </el-button>


        </el-tooltip>
        <span v-if="item.type === 'setlink'" class="font12 graytext2 padding10-c">{{item.model.tooltip|cutstr(20,'..')}}</span>

        <!--        <bind-link v-model="selectPageShow" :checkedIndex='pageChecked' :data='currentData.customizeObject' @change='selectPagePath' />-->

        <div v-if="item.type==='addbtn'">
          <el-button @click="item.editCB(pageEl)" type="primary" size="small">{{item.label}}
          </el-button>
        </div>

        <div v-if="item.type==='arr' && item.value.length>0" class="arr-box">

          <div v-for="(arr_item,idx) in item.value" :key="idx" class="arr-row"
               style="background: #f2f2f2;padding: 20px;">
            <!--简单值-->
            <div class="flex" v-if="['text','number'].indexOf(item.row_type)!==-1">
              <span class="padding10-c">{{item.label}}</span>
              <el-input @input="item.inputCB(item)" class="flex1" v-model="item.value[idx]"/>
            </div>

            <div class="flex" v-if="['coupon'].indexOf(item.row_type)!==-1">
              <span class="padding10-c">{{item.label}} : {{item.value[idx].Coupon_Title}}</span>
            </div>

            <div class="row-container flex" v-if="['swiper'].indexOf(item.row_type)!==-1">
              <upload-img-components
                :cropperOption="{aspectRatio:1/1}"
                class="myUploadImg"
                :onSuccess='item.imgCB'
                :mini="true"
                type='avatar'

                :idx2="idx"
                :imgUrl='item.value[idx].img_src'/>
              <div>
                <div class="padding10-c">
                  <el-tooltip class="item" effect="dark" :content="item.value[idx].tooltip||'未绑定'"
                              placement="right">
                    <el-button :title="item.value[idx].tooltip" size="small"
                               @click="openSwiperBindLink(item,idx,item.bindCB)">绑定链接
                    </el-button>
                  </el-tooltip>
                  <span class="padding10-c font12">{{item.value[idx].tooltip|cutstr(20,'..')}}</span>
                  <div class="graytext2 font12" style="line-height: 22px;">
                    建议尺寸为750*350
                  </div>
                </div>
              </div>
            </div>

            <div class="row-container" v-if="['title'].indexOf(item.row_type)!==-1">

              <div class="line10 flex">
                <div class="graytext" style="width: 70px;padding-left: 10px;">导航标题</div>
                <div>
                  <el-input v-model="item.value[idx].title"/>
                </div>
              </div>


              <div class="line10 flex">
                <div class="graytext" style="width: 70px;padding-left: 10px;">设置链接</div>
                <div>
                  <el-tooltip class="item" effect="dark" :content="item.value[idx].tooltip||'未绑定'"
                              placement="right">
                    <el-button :title="item.value[idx].tooltip" size="small"
                               @click="openSwiperBindLink(item,idx,item.bindCB)">绑定链接
                    </el-button>
                  </el-tooltip>
                  <span class="padding10-c font12">{{item.value[idx].tooltip|cutstr(20,'..')}}</span>
                </div>
              </div>


            </div>

            <div class="row-container flex" v-if="['nav'].indexOf(item.row_type)!==-1">
              <upload-img-components

                :cropperOption="{aspectRatio:1/1}"
                class="myUploadImg"
                :onSuccess='item.imgCB'
                :mini="true"
                type='avatar'
                :idx2="idx"
                :imgUrl='item.value[idx].img'/>
              <div>
                <div class="line10 flex">
                  <div class="graytext" style="width: 50px;padding-left: 10px;">标题</div>
                  <div>
                    <el-input autosize v-model="item.value[idx].title" class="input"
                              @input='item.inputCB'/>
                  </div>
                </div>
                <div class="flex">
                  <div class="graytext" style="width: 50px;padding-left: 10px;">链接</div>
                  <el-tooltip class="item" effect="dark" :content="item.value[idx].tooltip||'未绑定'"
                              placement="right">
                    <el-button :title="item.value[idx].tooltip" size="small"
                               @click="openSwiperBindLink(item,idx,item.bindCB)">绑定链接
                    </el-button>
                  </el-tooltip>
                  <span class="padding10-c font12" :title="item.value[idx].tooltip">{{item.value[idx].tooltip|cutstr(14,'..')}}</span>
                </div>

              </div>
            </div>


            <div class="row-container" v-if="['cate'].indexOf(item.row_type)!==-1">

              <div class="line10">
                <div class="graytext" style="padding: 0 10px;display: inline-block">商品分类</div>
                <el-tooltip class="item" effect="dark" :content="item.value[idx].tooltip||'未绑定'"
                            placement="right">
                  <el-button :title="item.value[idx].tooltip" size="small"
                             @click="openGoodsBindCate(item,item.bindCB,idx,true)">绑定分类
                  </el-button>
                </el-tooltip>
                <span class="padding10-c font12 graytext.graytext2">{{item.value[idx].tooltip|cutstr(20,'..')}}</span>
              </div>
              <div class="flex line10">
                <div class="graytext" style="padding:0 10px;">显示名称</div>
                <div>
                  <el-input size="small" autosize v-model="item.value[idx].title" class="input"
                            @input='item.inputCB'/>
                </div>
              </div>
              <div class="flex">
                <div class="graytext" style="padding: 0 10px;">显示数量</div>
                <el-radio-group style="margin-left: 20px;padding-top: 14px"
                                v-model="item.arr[idx].type" @change="item.radioCB">
                  <el-radio label="all">全部</el-radio>
                  <el-radio label="diy">自定义</el-radio>
                </el-radio-group>
                <el-input type="number" v-if="item.arr[idx].type==='diy'"
                          style="width: 140px;margin-left: 20px;" v-model="item.arr[idx].limit"/>
              </div>
            </div>

            <i class="el-icon-circle-close del-icon" @click="item.removeCB(idx)"></i>

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
          <el-radio v-for="(radio, ind) in item.value" :key="ind" :label="radio.value"
                    @change="radioChange(radio, item)">{{ radio.label }}
          </el-radio>
        </el-radio-group>

        <el-checkbox :disabled="item.disabled" @change="change(item)" v-if="item.type === 'checkbox'" v-model="item.model">
          {{item.label}}
        </el-checkbox>

        <div v-if="item.type === 'diy'" class="flex">
          <!--          @change="checkboxCB(item)"-->
          <el-checkbox @change="item.checkboxCB" v-model="item.model">{{item.label}}</el-checkbox>

          <template v-if="item.row_type === 'buybtn'">

            <el-radio-group style="margin-left: 20px;padding-top: 14px" v-model="item.data.style"
                            @change="item.radioCB">
              <el-radio :label="1">样式一</el-radio>
              <el-radio :label="2">样式二</el-radio>
            </el-radio-group>

            <el-input size="small" style="width: 90px;margin-left: 20px;" v-model="item.data.text"
                      @input="item.inputCB"/>
            <el-tooltip class="item" effect="dark" content="自定义按钮的文本" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>


          </template>

          <template v-if="item.row_type === 'tag'">
            <el-radio-group style="margin-left: 20px;padding-top: 14px" v-model="item.data.style"
                            @change="item.radioCB">
              <el-radio label="new">新品</el-radio>
              <el-radio label="hot">热卖</el-radio>
              <el-radio label="diy">自定义</el-radio>
            </el-radio-group>
            <!--非新品和热卖才-->
            <upload-img-components style="margin-left: 20px;" v-if="item.data.style === 'diy'"
                                   class="myUploadImg"
                                   :onSuccess='item.radioImgCB'
                                   type='avatar'
                                   :mini="true"
                                   tip="推荐100*100png图片"
                                   :imgUrl='item.data.img'></upload-img-components>
          </template>

        </div>

        <div v-if="item.type === 'origin'">


          <el-radio-group v-model="item.model">
            <el-radio v-for="(radio, ind) in item.value" :key="ind" :label="radio.value"
                      @change="radioChange(radio, item)">{{ radio.label }}
            </el-radio>
          </el-radio-group>

          <div v-if="item.model==='filter'">
            <el-tooltip class="item rightBtn" effect="dark" :content="item.origintooltip"
                        placement="right">
              <el-button @click="openGoodsBindList(item,item.bindListCB)" type="primary"
                         size="small">选择商品
              </el-button>
            </el-tooltip>

          </div>

          <div v-if="item.model!='filter'" class="line10">
            <el-tooltip class="item rightBtn" effect="dark" :content="item.origintooltip"
                        placement="right">
              <el-button @click="openGoodsBindCate(item,item.bindCateCB,null,true)" type="primary"
                         size="small">绑定分类
              </el-button>

            </el-tooltip>
            <span class="padding10-c font12 graytext">{{item.origintooltip|cutstr(20,'..')}}</span>

          </div>

          <div v-if="item.model!='filter'">
            <span>产品数量</span>
            <el-input style="width: 140px;margin-left: 20px;" type="number" max="30" min="1" v-model="item.limit"
                      @input="item.inputCB(item.limit)"/>
            <span class="padding10-c font14 graytext">(最多显示30个)</span>
          </div>


        </div>

        <el-color-picker
          show-alpha
          v-if="item.type === 'color'"
          v-model="item.model"
          class="inputcolor fun-color-pick"
          format="rgb"
          @change="colorEv"
        />

        <!--魔方-->
        <div v-if="item.type==='MagicCube'">
          <magic-cube-component :row.sync="item.row" :selecteds.sync="item.value"
                                @mouseenter.native="bindBindLinkDiaCall(item.bindCB)"
                                @selectChange="bindSelectChange"
                                @openBindLink="openMagicCubeBindLink"/>
        </div>

      </el-form-item>
      <!--      <el-form-item>-->
      <!--        <el-button type="primary" @click="onSubmit">立即创建</el-button>-->
      <!--        <el-button>取消</el-button>-->
      <!--      </el-form-item>-->
    </el-form>


    <select-goods-component @cancel="bindListCancel" :onSuccess="bindListSuccessCall"
                            :pageEl="pageEl" :show="bindListDialogShow"/>

    <bind-cate-components :multiple="bindCateMultiple" @cancel="bindCateCancel" :onSuccess="bindCateSuccessCall"
                          :idx2="bindCateIdx2" :pageEl="pageEl" :show="bindCateDialogShow"/>

    <bind-link-components @cancel="bindLinkCancel" :onSuccess="bindLinkSuccessCall"
                          :idx2="bindLinkIdx2" :pageEl="pageEl" :show="bindLinkDialogShow"/>

    <select-coupon-component @coupon="bindCouponSelect" @couponCancel="couponCancel"
                             :ids="coupon_ids" :show.sync="couponDialogShow"/>


  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapActions, mapState} from 'vuex';
    import BindLinkComponents from '@/components/BindLinkComponents';
    import uploadImgComponents from '@/components/common/uploadImgComponents';
    import SelectCouponComponent from '@/components/SelectCouponComponent';
    import BindCateComponents from '@/components/BindCateComponents';
    import SelectGoodsComponent from '@/components/SelectGoodsComponent';
    import MagicCubeComponent from '@/components/diy/tool/MagicCubeComponent';

    // 没有继承，是依靠vuex的数据。也不碍事啊
    @Component({
        components: {
            SelectCouponComponent,
            BindLinkComponents,
            uploadImgComponents,
            BindCateComponents,
            SelectGoodsComponent,
            MagicCubeComponent
        },
        props: {
            // eTitle:{type:String, default:'属性设置'}
        },
        data() {
            return {
                bindCateMultiple:false,
                bindListDialogShow: false,
                bindListSuccessCall: null,
                bindCateDialogShow: false,
                bindCateSuccessCall: null,
                bindCateIdx2: null,
                bindLinkDialogShow: false,
                bindLinkIdx2: null,
                bindLinkSuccessCall: null,
                selectPageShow: false,
                bindLinkData: null,
                currentData: {},
                clickObj: {},
                color1: null,
                pageEl: null,
                couponDialogShow: false,//优惠券
                coupon_ids: '',//已经选择的优惠券
            };
        },
        filters: {
            pageTooltip(str) {
                if (str) return str;
                return '选择的链接将会显示在这里';
            },
        },
        computed: {

            eTitle() {
                return this.$store.state.tmplData.length > 0 && this.$store.state.activeAttr.attrData.title ? this.$store.state.activeAttr.attrData.title : '';
            },
            activeAttr: {
                get() {
                    return this.$store.state.activeAttr;
                },
                set(nval) {

                    // this.setActiveAttr(navl)
                },
            },
            ...mapState(['tmplData']),
        },
        created() {
            this.pageEl = this
        },

        methods: {
            taggleEditStatus(){

                // let className = document.getElementById('canvas').className
                // document.getElementById('canvas').className = className.replace(/isMouseInPreview/,'')
                // this.setEditStatus(true);

            },
            openBindLinkBase(item) {
                this.bindLinkDialogShow = true
                this.bindLinkSuccessCall = item.bindLinkCB
            },
            bindSelectChange(arr) {
                console.log('选中区域变化', arr)
                this.currentData.seclectChangeCB && this.currentData.seclectChangeCB(arr)

            },
            //用两个来
            bindBindLinkDiaCall(bindCB) {
                this.bindLinkSuccessCall = bindCB;
            },
            openMagicCubeBindLink(idx2) {

                this.bindLinkDialogShow = true;
                this.bindLinkIdx2 = idx2;
                //
            },
            openGoodsBindList(item, success) {
                this.bindListDialogShow = true
                this.bindListSuccessCall = success
            },
            openGoodsBindCate(item, success, idx2,bindCateMultiple) {
                this.bindCateDialogShow = true
                this.bindCateSuccessCall = success
                this.bindCateIdx2 = idx2
                this.bindCateMultiple = bindCateMultiple
            },
            openSwiperBindLink(item, idx2, success) {
                this.bindLinkDialogShow = true
                this.bindLinkIdx2 = idx2
                this.bindLinkSuccessCall = success
            },
            switchChange(item) {
                this.change(item)
            },
            addInput(item) {
                const {index} = item;
                const value = JSON.parse(JSON.stringify(this.currentData.value[index]));
                this.currentData.value.splice(index, 0, value);
                this.currentData.setIndex(0, {
                    value: false,
                });
            },
            // 用函数来校验灵活一点
            inputBlurEvent(item) {
                if (!item.patternFunc) return;
                if (!item.patternFunc(item.model)) {
                    item.model = '';
                    this.$fun.warning({msg: item.parrern_tip || '表单填写不符合要求'});
                }
            },
            uploadSwiperImg(response) {

            },

            uploadImg(response) {
                //先修改Preview中的预览组件实例值
                this.currentData.model = response.data.path;// response.data.url;
                //再修改VUEX中的值
                this.change(this.currentData);
            },
            bindCateCancel() {
                this.bindCateDialogShow = false
            },
            bindListCancel() {
                this.bindListDialogShow = false
            },
            bindLinkCancel() {
                this.bindLinkDialogShow = false
            },
            couponCancel() {
                this.couponDialogShow = false
            },
            bindCouponSelect(coupons) {
                this.couponDialogShow = false
                this.currentData.dialogCB(coupons)
            },
            radioChange(radio, item) {
                // if (typeof item.attrData === 'function') item.attrData(this.activeData, radio);
                this.change(item);
            },
            change(item, imgUrl, index, isInput) {
                if (isInput) window.isInput = true;
                // setTimeout(function () {
                // 	window.isInput =false
                // },100)
                console.log(item);
                console.log(`修改类别是${item.editType}修改字段是${item.editKey}`);


                if (item.editType && (item.editType === 'style' || item.editType === 'config' || item.editType === 'value')) {

                    //这里怎么直接这样写上vuex的数据了。。
                    if (!this.activeAttr[item.editType]) {
                        this.activeAttr.activeAttr[item.editType] = {};
                    }

                    // config{} 或者style{}
                    const editObj = this.activeAttr[item.editType];

                    // console.log('根据配置修改')


                    // 就不要用这个了吧。如果涉及到复杂的话，就统一写在editCB里面好了
                    // if (item.editObj){
                    //     item.editObj.map(key => {
                    //         editObj = editObj[key]
                    //     })
                    // }


                    //这个地方,只需要修改vuex中的vuex的组件即可。因为实例类中的简单值属性，已经通过数据双向绑定机制完成修改了
                    // 比如 item.model.text 然后通过el-input 的v-model双向绑定修改了，所以PreView中的实例组件对应的值已经修改，只需要修改vuex即可

                    // 有回调函数的,可以去函数里面做各种关联操作和格式化操作。比如像素加px，颜色值的转换之类，json转换之类。简单值的就直接走下面赋值了
                    //反正会跑一次回调的
                    if (item.editCB) {
                        editObj[item.editKey] = item.editCB(item);
                    } else {
                        editObj[item.editKey] = item.model;
                    }


                } else if (item.editType === 'sort') {
                    item.editCB(item);
                } else {
                    // 这里最主要的就是一次回调

                    // let index = item.index ? item.index : this.activeAttr.activeIndex

                    // console.log(index,item,window.ActiveAttrObj,window.ActiveAttrObj.activeAttr.value[index][item.editKey])

                    // 返回值就可以了。
                    // if (this.activeAttr.tag && this.activeAttr.tag.indexOf('switchNav') != -1) {
                    //
                    //     this.activeAttr.value[index][item.editKey] = typeof item.editCB === 'function' ? item.editCB(item, imgUrl) : item.model
                    //
                    // } else {
                    //
                    //     //既然已经是model绑定了，为什么这里又改一遍?
                    //     this.activeAttr.value[index][item.editKey] = typeof item.editCB === 'function' ? item.editCB(item, imgUrl) : item.model
                    //
                    // }

                    // = rt
                }
                // debugger
                if (item.removeData && this.uploadStatus === undefined) item.removeData(item);

                // console.log(window.ActiveAttrObj)
            },
            colorEv(val) {
                // this.color1 = val
                // this.clickObj.model = val
                // this.currentData.model = val

                // 用这个代替是一样的
                this.change(this.currentData);
            },
            colorClick(item) {

            },
            showPage(item) {
                if (Array.isArray(this.activeAttr.value)) {
                    if (item.selectLink && item.selectLink.show) return 'array';
                    return false;
                }
                if (typeof this.activeAttr.value === 'object') {
                    if (item.selectLink && item.selectLink.show) return 'object';
                    return false;
                }
            },
            saveCurrentItem(item) {
                if (this.activeAttr.isSendAjax) return;
                this.currentData = item;
            },
            ...mapActions(['setActiveAttr','setEditStatus']),
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
            desc: '',
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
            // // this.activeData.config.setValueCB && this.activeData.config.setValueCB()
            //
            // this.$set(this.activeItem[index], 'tooltip', tooltip);
            // this.$set(this.activeItem[index], 'link', path);
            // this.$set(this.activeItem[index], 'linkType', type);
            // this.$set(this.activeItem[index], 'dataItem', dataItem);
            // this.$set(this.activeItem[index], 'id', dataItem.id);
            // this.$set(this.activeItem[index], 'type', dataType);
            // this.$set(this.activeItem[index], 'show', true);
            //
            // if (typeof this.currentData.selectLink.checkedPageCB === 'function') {
            //     let data = this.currentData.selectLink.checkedPageCB(this.activeItem[index], this.activeData);
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
  .fun-color-pick .el-color-picker__icon.el-icon-arrow-down {
    display: none
  }
</style>
<style scoped lang="less">
  @import "../assets/css/variable.less";

  .title {
    display: flex;
    line-height: 18px;
    height: 18px;
    padding-left: 10px;
    border-left: 2px solid rgb(63, 142, 243);
    margin-bottom: 25px;
  }

  .arr-box {
    .arr-row {
      position: relative;
      margin-bottom: 15px;

      span {
        color: #666;
      }

      .del-icon {
        position: absolute;
        right: -12px;
        top: -12px;
        font-size: 24px;
        color: #999;
        cursor: pointer;

        &:hover {
          color: @danger;
        }
      }
    }
  }


  .el-icon-question {
    font-size: 22px !important;
    margin-top: 9px;
    margin-left: 10px;
    cursor: pointer;
    color: #409eff;
  }
</style>
