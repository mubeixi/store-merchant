<template>
  <div class="preview-body" id="previewWrap">
    <div class="preview-head"><div class="preview-header-title">{{system.title||'新页面'}}</div></div>
    <div class="canvasBox" @drop="dropEv" @dragover.prevent >
<!--      @mouseover="selectStyle"-->
<!--      @mouseout="outStyle"-->
      <!--           @scroll="canvasScroll($event)" -->
<!--      v-scroll="scrollFn"-->
<!--      @scroll="canvasScroll($event)"-->
      <div class="canvas" id="canvas" :style="{backgroundColor:system.bgcolor}"
           @setData="setDataEv"
           ref="pageTemplageBox" v-if="show_preview" >
        <section
          :ref="item | dragSorts"
          v-for="(item, index) in templateList[templateEditIndex]"
          :key="index"
          :id="'section'+index"
          class="section"
          :class="setClass(item,index)"
          :data-name="item"
          :data-tag="templateData[templateEditIndex][index].tag"
          @mousedown="activeStatus($event, index, item)"
          @click="activeStatus($event, index, item)"
          @contextmenu.stop.prevent="contextmenuRightEv($event, item, index)"
        >

          <text-component
            ref="plugin"
            v-if="item.indexOf('text') !== -1"
            @setData="setDataEv"
            :draggable="true"
            :data="templateData[templateEditIndex][index]"
            :index="index"
          />
          <hr-component
            ref="plugin"
            v-if="item.indexOf('hr') !== -1"
            @setData="setDataEv"
            :draggable="true"
            :data="templateData[templateEditIndex][index]"
            :index="index"
          />
          <space-component
            ref="plugin"
            v-if="item.indexOf('space') !== -1"
            @setData="setDataEv"
            :draggable="true"
            :data="templateData[templateEditIndex][index]"
            :index="index"
          ></space-component>

          <title-component
            ref="plugin"
            v-if="item.indexOf('title') !== -1"
            @setData="setDataEv"
            :draggable="true"
            :data="templateData[templateEditIndex][index]"
            :index="index"
          ></title-component>

          <video-component
            ref="plugin"
            v-if="item.indexOf('video') !== -1"
            @setData="setDataEv"
            :draggable="true"
            :data="templateData[templateEditIndex][index]"
            :index="index"
          />

          <search-component
            ref="plugin"
            v-if="item.indexOf('search') !== -1"
            @setData="setDataEv"
            :draggable="true"
            :data="templateData[templateEditIndex][index]"
            :index="index"
          />


          <swiper-component
            ref="plugin"
            v-if="item.indexOf('swiper') !== -1"
            @setData="setDataEv"
            :draggable="true"
            :data="templateData[templateEditIndex][index]"
            :index="index"
          />
          <coupon-component
            ref="plugin"
            v-if="item.indexOf('coupon') !== -1"
            @setData="setDataEv"
            :draggable="true"
            :data="templateData[templateEditIndex][index]"
            :index="index"
          />

          <notice-component
            ref="plugin"
            v-if="item.indexOf('notice') !== -1"
            @setData="setDataEv"
            :draggable="true"
            :data="templateData[templateEditIndex][index]"
            :index="index"
          />

          <base-component
            ref="plugin"
            v-if="item.indexOf('base') !== -1"
            @setData="setDataEv"
            :draggable="true"
            :data="templateData[templateEditIndex][index]"
            :index="index"
          />

          <goods-component
            ref="plugin"
            v-if="item.indexOf('goods') !== -1"
            @setData="setDataEv"
            :draggable="true"
            :data="templateData[templateEditIndex][index]"
            :index="index"
          />

          <group-component
            ref="plugin"
            v-if="item.indexOf('group') !== -1"
            @setData="setDataEv"
            :draggable="true"
            :data="templateData[templateEditIndex][index]"
            :index="index"
          />

          <flash-component
            ref="plugin"
            v-if="item.indexOf('flash') !== -1"
            @setData="setDataEv"
            :draggable="true"
            :data="templateData[templateEditIndex][index]"
            :index="index"
          />

          <kill-component
            ref="plugin"
            v-if="item.indexOf('kill') !== -1"
            @setData="setDataEv"
            :draggable="true"
            :data="templateData[templateEditIndex][index]"
            :index="index"
          />

          <nav-component
            ref="plugin"
            v-if="item.indexOf('nav') !== -1"
            @setData="setDataEv"
            :draggable="true"
            :data="templateData[templateEditIndex][index]"
            :index="index"
          />

          <cube-component
            ref="plugin"
            v-if="item.indexOf('cube') !== -1"
            @setData="setDataEv"
            :draggable="true"
            :data="templateData[templateEditIndex][index]"
            :index="index"
          />

          <tab-component
            ref="plugin"
            v-if="item.indexOf('tab') !== -1"
            @setData="setDataEv"
            :draggable="true"
            :data="templateData[templateEditIndex][index]"
            :index="index"
          />

          <div class="sortStatus"
               v-show="sort.sortIndex === templateList[templateEditIndex].length && index + 1 === templateList[templateEditIndex].length"></div>

        </section>

        <div class="removeModal" ref="removeModal" v-show="removePosition.show">
          <!-- <h4>您确定要删除 {{ currentData.name }} 组件吗？</h4> -->
          <h4>您确定要删除这个组件吗？</h4>
          <p>
            <input type="button" value="确定" class="ok" @click="removeTemplate"/>
            <input type="button" value="取消" class="on" @click="removePosition.show = false"/>
          </p>
        </div>
        <ul
          class="contextmenuRight"
          ref="rightMenu"
          @mousedown.stop="hideRightMenu"
        >
          <li class="menuList" type="showRemovePrompt">
            删除
          </li>

        </ul>

      </div>

    </div>
<!--    <div class="handle text-center">-->
<!--      <el-button @click="uploadConfig" type="primary">保存</el-button>-->
<!--    </div>-->
    <div class="bottom-place" id="js-bottom-place"></div>
  </div>
</template>

<script lang="ts">
    import {pageMove} from '@/common/tool/pageMove';
    import {objTranslate, GetQueryByString} from '@/common/utils';
    import {ss} from '@/common/tool/ss';
    import {Component, Vue} from 'vue-property-decorator';
    import {State} from 'vuex-class';
    import {mapActions, mapState} from 'vuex';
    import {getSkinConfig, setSkinConfig,uploadImgByBase64,getDiySkinConfig,setDiySkinConfig} from '@/common/fetch';

    import SpaceComponent from '@/components/diy/SpaceComponent';
    import HrComponent from '@/components/diy/HrComponent.vue';
    import TextComponent from '@/components/diy/TextComponent.vue';
    import TitleComponent from '@/components/diy/TitleComponent.vue';
    import VideoComponent from '@/components/diy/VideoComponent.vue';
    import SearchComponent from '@/components/diy/SearchComponent.vue';
    import CouponComponent from '@/components/diy/CouponComponent.vue';
    import SwiperComponent from '@/components/diy/SwiperComponent.vue';
    import NoticeComponent from '@/components/diy/NoticeComponent.vue';
    import BaseComponent from '@/components/diy/BaseComponent.vue';
    import GoodsComponent from '@/components/diy/GoodsComponent';
    import FlashComponent from '@/components/diy/FlashComponent';
    import KillComponent from '@/components/diy/KillComponent';
    import GroupComponent from '@/components/diy/GroupComponent';
    import NavComponent from "@/components/diy/NavComponent.vue";
    import CubeComponent from '@/components/diy/CubeComponent.vue';
    import TabComponent from '@/components/diy/TabComponent';

    import {deepCopy, getStyle} from '@/common/utils';
    import Hr from '@/assets/js/diy/hr';
    import Text from '@/assets/js/diy/text';
    import Space from '@/assets/js/diy/space';
    import Title from '@/assets/js/diy/title';
    import Video from '@/assets/js/diy/video';
    import Search from '@/assets/js/diy/search';
    import Coupon from '@/assets/js/diy/coupon';
    import Swiper from '@/assets/js/diy/swiper';
    import Notice from '@/assets/js/diy/notice';
    import Base from '@/assets/js/diy/base';
    import Goods from '@/assets/js/diy/goods';
    import Group from '@/assets/js/diy/group';
    import Flash from '@/assets/js/diy/flash';
    import Kill from '@/assets/js/diy/kill';
    import Nav from '@/assets/js/diy/nav';
    import Cube from '@/assets/js/diy/cube';
    import Tab from '../assets/js/diy/tab';
    import MagicCube from '@/assets/js/diy/tool/MagicCube';


    import html2canvas from 'html2canvas';
    import {Canvas2Image} from '@/assets/js/diy/tool/canvas2img';
    import {trim} from 'vue-resource/src/util';


    @Component({
        name: 'PreviewComponent',
        props: {
            isDiy:{
                default:false,
                type:Boolean
            }
        },
        watch: {
            templateData: {
                deep: true,
                handler(val) {
                    // console.log('预览的数据变化', val);
                    this.setTmplData(val);
                },
            },
            //修改activeAttr就可以修改组件中对应的数据
            activeAttr: {
                deep: true,
                handler(val) {
                    // console.log('1.51.51.51.51activeAttr对象有改变111111111',this.templateList,this.tabIndex,objTranslate(val))
                    // 去修改准备提交到线上的数据对象
                    // 等于右边有变动，中间预览马上就跟着变了

                    //这里只是存一个值而已，所以不需要搞什么
                    //已经从这里避免了引用依赖
                    this.$set(this.templateData[this.templateEditIndex], this.tabIndex,objTranslate(val));
                    // if(!this.isChangeData){
                    //     //这里只是解除了依赖而已
                    //   this.$set(this.templateData[this.templateEditIndex], this.tabIndex,val);
                    // }

                },
            },
        },
        components: {
            TabComponent,
            NavComponent,
            GoodsComponent,
            NoticeComponent,
            CouponComponent,
            SpaceComponent,
            HrComponent,
            TextComponent,
            SpaceComponent,
            TitleComponent,
            VideoComponent,
            SearchComponent,
            SwiperComponent,
            BaseComponent,
            CubeComponent,
            GroupComponent,
            FlashComponent,
            KillComponent

        },
        filters: {
            dragSorts(val) {
                const dragSort = ['nav', 'list', 'swiper', 'input', 'hr', 'text'];
                if (dragSort.indexOf(val) === -1) return '';
                return 'allTemplate';
            },
        },
        computed: {
            templateEditIndex: {
                get() {
                    return this.$store.state.templateEditIndex;
                },
                set() {
                },
            },
            ...mapState(['activeAttr', 'tabIndex','editStatus','system']),
        },
        methods: {
            scrollFn:function(direction){
                //console.log(direction)
            },

            clearPlugin(){
                this.templateData = [] //页面数据的二维数组。
                this.templateList = [] //页面组件的二维数组。
            },
            restTmplFun(defaultData){

                if(!defaultData)return;
                new Promise((resolve,reject) => {
                    this.isChangeData = true
                    //初始化这个
                    this.$store.commit('activeAttr',{attrData: {}})
                    resolve(defaultData)
                })
                    .then(templateData => {

                        //存储页面数据
                        this.templateData = [] //页面数据的二维数组。
                        this.templateList = [] //页面组件的二维数组。

                        //console.log(templateData)
                        if (templateData && Array.isArray(templateData[0])) {
                            //多个页面，每个页面是一个数组
                            templateData.map(item => {
                                this.templateData.push(item)
                                this.templateList.push([])
                            })
                        } else if (templateData && !Array.isArray(templateData[0]) && templateData.length > 0) {
                            //单纯是一个对象的时候？？
                            this.templateData = [templateData]
                            this.templateList = [[]]
                        } else {
                            this.templateData = [[]]
                            this.templateList = [[]]
                        }

                        //存储页面组件templateList
                        for (let i = 0; i < this.templateData.length; i++) {
                            if (this.templateData[i] && this.templateData[i] !== []) {
                                this.templateData[i].map(m => {
                                    this.templateList[i].push(m.tag)
                                })
                            }
                        }

                        var _self = this
                        _self.show_preview = false
                        setTimeout(function () {
                            _self.show_preview = true;
                            _self.isChangeData = false
                        },200)
                        // setTimeout(() => pageMove.init('sort', this), 500)
                    })
                    .catch(err => {
                        throw new Error(err)
                    })
                    .then(() => {
                        //拖拽
                        // var isDraggable = ['div', 'nav']
                        // Array.from(
                        //     document.querySelectorAll('[draggable=true]')
                        // ).filter(el => {
                        //     let tagName = el.tagName.toLowerCase()
                        //     return isDraggable.some(elName => elName === tagName)
                        // })
                    })
            },
            canvasScroll(e) {
                this.canvasScrollTop = this.$refs.pageTemplageBox.scrollTop
            },
            async convert2canvas(el) {
                let shareContent = el //需要截图的包裹的（原生的）DOM 对象
                let width = shareContent.offsetWidth //获取dom 宽度
                let height = shareContent.offsetHeight //获取dom 高度
                let canvas = document.createElement('canvas') //创建一个canvas节点
                let scale = 0.5 //定义任意放大倍数 支持小数
                canvas.width = width * scale //定义canvas 宽度 * 缩放
                canvas.height = height * scale //定义canvas高度 *缩放
                canvas.getContext('2d').scale(scale, scale) //获取context,设置scale
                //https://html2canvas.hertzen.com/configuration
                let opts = {
                    scale: 1, // 添加的scale 参数
                    canvas: canvas, //自定义 canvas
                    logging: false, //日志开关，便于查看html2canvas的内部执行流程
                    width: width, //dom 原始宽度
                    height: height,
                    useCORS: true // 【重要】开启跨域配置
                }
                await html2canvas(shareContent, opts).then(canvas => {

                    console.log(canvas)
                    let context = canvas.getContext('2d')
                    // 【重要】关闭抗锯齿
                    context.mozImageSmoothingEnabled = false
                    context.webkitImageSmoothingEnabled = false
                    context.msImageSmoothingEnabled = false
                    context.imageSmoothingEnabled = false
                    // 【重要】默认转化的格式为png,也可设置为其他格式
                    // return this.imgUrl = Canvas2Image.convertToPNG(canvas, canvas.width, canvas.height).getAttribute('src');
                    let src = Canvas2Image.convertToPNG(
                        canvas,
                        canvas.width,
                        canvas.height
                    ).getAttribute('src')
                    //console.log(src)

                    let base64Data = src;
                    //let blob = this.dataURItoBlob(src)
                    // let file = new File(
                    //     [blob],
                    //     (this.title || '自定义页面') + '.png'
                    // )
                    //let data = new FormData()
                    //data.append('file', file)

                    //,'title':this.title || '自定义页面'+'png'
                    let data = {image:base64Data};

                    return uploadImgByBase64(data).then(res => {
                        console.log('upimg rt ',res.data.path)
                        this.imgUrl = res.data.path
                    })
                })
            },
            dataURItoBlob(base64Data) {
                let byteString
                if (base64Data.split(',')[0].indexOf('base64') >= 0)
                    byteString = atob(base64Data.split(',')[1])
                else byteString = unescape(base64Data.split(',')[1])
                let mimeString = base64Data
                    .split(',')[0]
                    .split(':')[1]
                    .split(';')[0]
                let ia = new Uint8Array(byteString.length)
                for (let i = 0; i < byteString.length; i++)
                    ia[i] = byteString.charCodeAt(i)
                return new Blob([ia], { type: mimeString })
            },
            /**
             *
             * @param is_use 是否选中当前模板
             * @param pre 是否预览
              */
            async uploadConfig(is_use,pre,call) {


                if(this.isAjax){
                    this.$fun.info({msg:'操作过快'})
                    return;
                }

                //各种数据检测
                for(var i in this.templateList){
                    for(var j in this.templateList[i]){
                        let pluginName = this.templateList[i][j]

                        if(pluginName.indexOf('cube')!=-1){

                            let conf = this.templateData[i][j];

                            //检查图片设置
                            for(var valItem of conf.value.list){
                                //console.log(valItem)
                                if(!valItem.bgimg){
                                    this.$fun.error({title:'设置错误',msg:'魔方中有区块未设置图片'})
                                    //去掉锁
                                    return;
                                }
                            }

                            //用数据创建一个魔方实例
                            let MagicCubeCTX = new MagicCube(conf.config.row,conf.config.col,375,375)
                            MagicCubeCTX.selects = [...conf.value.list];
                            //看是否填充满
                            if(!MagicCubeCTX.is_full()){
                                this.$fun.error({title:'设置错误',msg:'魔方需填充满'})
                                //去掉锁
                                return;
                            }


                        }
                    }
                }


                if(!this.system.title){
                    this.$fun.warning({msg:"名称必填"});
                    return;
                }


                this.isAjax = true
                let mixinData = {plugin:this.templateData,system:this.system}

                console.log(`提交模板配置`,mixinData)


                let postData = {
                    //this.templateData换掉最新的
                    Home_Json: JSON.stringify(mixinData)
                }



                //不是diy
                if(!this.isDiy){
                    let Skin_ID =  parseInt(ss.get('Skin_ID')),
                        Home_ID = parseInt(ss.get('Home_ID'));
                    if(!Skin_ID && !Home_ID){
                        this.$fun.error({msg:'页面参数错误'});
                        return;
                    }

                    if(Home_ID){
                        postData.Home_ID = Home_ID
                    }else{
                        postData.Skin_ID = Skin_ID
                    }

                    //是否使用
                    if(is_use){
                        postData.is_use = is_use
                    }

                }

                //自定义页面保存
                if(this.isDiy){
                    if(ss.get('Home_ID')){
                        postData.Home_ID = parseInt(ss.get('Home_ID'))
                    }
                }





                let load = null;

                let Skin_Name = this.system.title

                //自定义
                if(!this.isDiy){

                    postData.Skin_Name = Skin_Name
                    //每次都需要截图
                    let el = document.getElementById('canvas')

                    load = this.$loading({
                        fullscreen: true,
                        text:'保存中',
                        spinner:'el-icon-loading',
                        background:'rgba(0, 0, 0, 0.3)'

                    })

                    await this.convert2canvas(el)
                    postData.Skin_Img = this.imgUrl;


                }else{

                    postData.Home_Name = Skin_Name
                    load = this.$loading({
                        fullscreen: true,
                        text:'保存中',
                        spinner:'el-icon-loading',
                        background:'rgba(0, 0, 0, 0.3)'

                    })
                }


                //保存方法也不一样
                let saveFunc = null;

                if(this.isDiy){
                    saveFunc = setDiySkinConfig;
                }else{
                    saveFunc = setSkinConfig;
                }

                saveFunc(postData).then(res => {

                    load.close();

                    this.isAjax = false
                    if (res.errorCode === 0) {

                        console.log(res.data.Home_ID)

                        //保存Home_ID
                        if(res.data.Home_ID){


                            //刷新页面
                            if(!this.isDiy && (GetQueryByString(location.href,'Home_ID')==0 || !GetQueryByString(location.href,'Home_ID')) ){
                                //需要刷新页面
                                //str.replace(/\?.*/g, "")
                                let oldURL =location.href;
                                let newUrl = oldURL.replace(/\?.*/g,"?Home_ID="+res.data.Home_ID)
                                console.log('需要跳转到的页面',newUrl)
                                location.href = newUrl;
                                location.reload();
                                return;

                            }

                            if(this.isDiy && (GetQueryByString(location.href,'Home_ID')==0 || !GetQueryByString(location.href,'Home_ID')) ){
                                //需要刷新页面
                                //str.replace(/\?.*/g, "")
                                let oldURL =location.href;
                                let newUrl = ''

                                if(oldURL.indexOf('?')!=-1){
                                    newUrl = oldURL.replace(/\?.*/g,"?Home_ID="+res.data.Home_ID)
                                }else{
                                    newUrl = oldURL+"?Home_ID="+res.data.Home_ID
                                }

                                console.log('需要跳转到的页面',newUrl)
                                location.href = newUrl;
                                location.reload();
                                return;

                            }
                            ss.set('Home_ID',res.data.Home_ID)
                        }

                        this.$fun.success('配置保存成功');
                        if(pre){
                            this.$emit('preFun',true);
                        }
                    }

                },err=>{
                    load.close();
                }).catch(e => {
                    load.close();

                    this.isAjax = false
                    this.$fun.error({msg:'配置保存失败'})
                })
            },
            clickPlugin(idx) {
                const sectionEl = document.querySelectorAll('.canvas > section')[idx];
                if (!sectionEl) return;
                sectionEl.click();

                //没文化真可怕
                document.getElementById('section'+idx).scrollIntoView({
                  behavior:  "smooth",
                  block: "center",
                  inline: "center"
                });

                const templateName = sectionEl.getAttribute('data-tag');
                const dragEl = sectionEl.getElementsByClassName(`${templateName}`)[0];

                if (!dragEl) return;
                // 模拟点击
                dragEl.click();




            },
            setDataEv(data) {
                // this.$emit('setData', data)
            },
            activeStatus(e, index, item) {
                //console.log(e, index, item);
                this.sort.downIndex = index;
                const currentEl = e.currentTarget;
                const config = {
                    width: getStyle(currentEl, 'width'),
                    height: getStyle(currentEl, 'height'),
                    left: `${currentEl.offsetLeft}px`,
                    top: `${currentEl.offsetTop}px`,
                    display: 'block',
                };
                //console.log(config);

                // 方便删除的
                this.currentData.index = index;
                this.currentData.name = item;

                //console.log(item)

                this.setMode('attr');




                // this.setEditStatus(false)
                //this.editData = config;
            },
            contextmenuRightEv(e, item, index) {
                this.$refs.rightMenu.style.display = 'block';
                this.$refs.rightMenu.style.left = `${e.clientX}px`;
                this.$refs.rightMenu.style.top = `${e.clientY}px`;

                this.removePosition.x = e.clientX;
                this.removePosition.y = e.clientY;

                this.currentData.index = index;
                this.currentData.name = item;

                this.removePosition.show = false;
            },
            removeTemplateByKeyCode(idx){

                //console.log('监听键盘删除组件事件')
                // if(this.currentData.index<0){
                //     return;
                // }


                this.$confirm('确定删除该组件?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteItem(idx);
                    this.removePosition.show = false;
                }).catch(() => {

                });

            },
            removeTemplate() {

                this.deleteItem(this.currentData.index, this.currentData.name);
                this.removePosition.show = false;
                //this.$emit('setData', []);
                // console.log(this)
            },
            deleteItem(index, name) {


                this.templateList[this.templateEditIndex].splice(index, 1);
                this.templateData[this.templateEditIndex].splice(index, 1);


                //console.log('删除掉额index'+index)
                //this.$store.commit('templateEditIndex', 0)
                //this.clickPlugin(0);

                //如果删除的是当前激活的
                if(index === this.$store.state.tabIndex){
                    //清空右侧的
                    this.setActiveAttr({attrData: {}})

                    this.$store.commit('tabIndex', null);
                }

              // 用心良苦啊,删除的时候还要保留这个页面，确实比较符合需要
                // if (name.substring(0, 9) === 'switchNav') {
                //   // 删除导航及其他页面
                //   this.templateData = [this.templateData[this.templateEditIndex]];
                //   this.templateList = [this.templateList[this.templateEditIndex]];
                //   ActiveAttrObj.tabIndex = 0;
                // }
                // this.$fun.info({title: '操作提示', msg: '删除成功！'});
                this.editData.display = 'none';
            },
            showRemovePrompt() {
                this.removePosition.show = true
                this.$refs.removeModal.style.left = this.removePosition.x + 'px'
                this.$refs.removeModal.style.top = this.removePosition.y + 'px'
            },
            hideRightMenu(e) {
                const type = e.target.getAttribute('type');
                //console.log(type)
                this.$refs.rightMenu.style.display = 'none';
                this[type] && this[type]();
            },
            // 修改当前活跃的index,以及
            ...mapActions(['setTemplateEditIndex', 'setTmplData','setEditStatus','setMode','setComponentTitle','setSystem','setActiveAttr']),
        },
        mounted(){
            let _self = this;
            // this.$nextTick().then(res=>{
            //     document.onkeydown = function(event){
            //         let className = document.getElementById('canvas').className
            //         //鼠标必须在范围内
            //         if(className.indexOf('isMouseInPreview')===-1 || this.editStatus)return;
            //         var e = event || arguments.callee.caller.arguments[0];
            //         console.log(e)
            //         switch (e.keyCode) {
            //             case 8:
            //             case 46:
            //                 _self.removeTemplateByKeyCode()
            //                 break;
            //         }
            //
            //
            //     }
            // })
        }
    })

    export default class PreviewComponent extends Vue {
        @State attrData: attrData;

        @State editStatus: editStatus;

        dragMove = ['input']


        isChangeData = false

        sort = {
            downIndex: -1,
            sortIndex: -1,
        }

        imgUrl = ''

        editData = {
            display: 'none',
        }


        show_preview = true


        canvasScrollTop = 0;


        currentData = {
            index: -1,
            name: '',
        }

        removePosition = {
            show: false,
        }

        isAjax = false


        templateData = []

        templateList = []

        pageTemplateName = ''


        setDataEv() {
        }

        skinInfo = null

        created() {

            let _self = this;
            new Promise((resolve,reject) => {


                let postData = {},getSkinConfigFunc = null;
                //普通模式
                if(!_self.isDiy){
                    let Skin_ID =  parseInt(ss.get('Skin_ID')),
                        Home_ID = parseInt(ss.get('Home_ID'));
                    if(!Skin_ID && !Home_ID){
                        _self.$fun.error({msg:'页面参数错误'});
                        return;
                    }
                    if(Home_ID){
                        postData.Home_ID = Home_ID
                    }else{
                        postData.Skin_ID = Skin_ID
                    }

                    getSkinConfigFunc = getSkinConfig;

                }else{

                    //如果有，就加载吧
                    let Home_ID = parseInt(ss.get('Home_ID'));
                    if(Home_ID){
                        postData.Home_ID = Home_ID;
                        getSkinConfigFunc = getDiySkinConfig;
                    }else{

                        //没有Home_ID就什么都不做
                        return;
                    }



                }


                getSkinConfigFunc(postData).then(res => {
                    //console.log(JSON.parse(res.data.Home_Json))


                    _self.skinInfo = res.data

                    if(res.data && res.data.Home_Json){
                        resolve(JSON.parse(res.data.Home_Json))
                    }

                    reject(false)

                },err=>{
                    console.log(err)
                })

            })
            .then(mixinData => {

                console.log('拿到的数据',mixinData)
                let templateData = mixinData.plugin;


                if(mixinData.system){
                    this.setSystem(mixinData.system);
                }


                //存储页面数据
                this.templateData = [] //页面数据的二维数组。
                this.templateList = [] //页面组件的二维数组。
                // console.log(templateData)
                if (templateData && Array.isArray(templateData[0])) {
                    //多个页面，每个页面是一个数组
                    templateData.map(item => {
                        this.templateData.push(item)
                        this.templateList.push([])
                    })
                } else if (
                    templateData &&
                    !Array.isArray(templateData[0]) &&
                    templateData.length > 0
                ) {
                    //单纯是一个对象的时候？？
                    this.templateData = [templateData]
                    this.templateList = [[]]
                } else {
                    this.templateData = [[]]
                    this.templateList = [[]]
                }
                // this.templateData = templateData
                //存储页面组件templateList
                for (let i = 0; i < this.templateData.length; i++) {
                    if (
                        this.templateData[i] &&
                        this.templateData[i] !== []
                    ) {
                        this.templateData[i].map(m => {
                            this.templateList[i].push(m.tag)
                        })
                    }
                }

                setTimeout(() => pageMove.init('sort', this), 500)
            },err=>{
                console.log('模板为空')
                //this.$fun.warning({msg:'模板数据加载失败'})
            })
            .catch(err => {
                throw new Error(err)
            })



        }

        setClass(className, idx) {
            console.log(className,idx)
            if (typeof className === 'undefined') return '';

            if(typeof className !='string')return'';


            // className = className.replace(/[0-9]?/g, '');

            let rt = []
            // let rt = this.dragMove.map((v) => {
            //     if (v === className) {
            //         return `dragMove ${className}`;
            //     }
            //     return className;
            // });

            //之类就可以看出来是不是search
            if(className.indexOf('search')!=-1 && this.templateData[this.templateEditIndex][idx].style && this.templateData[this.templateEditIndex][idx].style.position === 'absolute'){
                rt.push('noborder')
            }

            if (this.currentData.index === idx) {
                rt.push('active')
            }


            return rt;
        }


        dropEv(e: any) {
            let templateName = e.dataTransfer.getData('text/plain');
            templateName = trim(templateName);
            console.log(templateName);
            if (templateName === '') return; // 在页面内拖动时，无需添加组件

            // 如果是switchNav组件，特殊操作。虽然我也不知道为什么要这样
            // 因为没有swtichNav的时候，只有一个页面，所以是一个二维数组（最外层键名为0，所有数据都在子数组中按组件顺序存下来），但是有switchNav之后，二维数组长度会变化（多个页面），所以需要特殊处理下。
            let newClass = {};
            // //console.log(templateName)
            switch (templateName) {
                case 'hr':
                    newClass = new Hr();
                    break;
                case 'text':
                    newClass = new Text();
                    break;
                case 'space':
                    newClass = new Space();
                    break;
                case 'title':
                    newClass = new Title();
                    break;
                case 'video':
                    newClass = new Video();
                    break;
                case 'search':
                    newClass = new Search();
                    break;
                case 'coupon':
                    newClass = new Coupon();
                    break;
                case 'notice':
                    newClass = new Notice();
                    break;
                case 'base':
                    newClass = new Base();
                    break;
                case 'goods':
                    newClass = new Goods();
                    break;
                case 'group':
                    newClass = new Group();
                    break;
                case 'kill':
                    newClass = new Kill();
                    break;
                case 'flash':
                    newClass = new Flash();
                    break;
                case 'cube':
                    // let len = this.templateList[this.templateEditIndex].length;
                    // let tagName = 'cube'+(len+1);
                    newClass = new Cube()
                    break;
                case 'nav':
                    newClass = new Nav()
                    break;
                case 'tab':
                    newClass = new Tab()
                    break;
                case 'swiper':
                    newClass = new Swiper()
                    break;
                // case 'input':
                //     newClass = new InputJS()
                //     break
                // case 'scale':
                //     newClass = new ScaleJS()
                //     break
                default:
                    this.$fun.error({msg:'只允许拖入组件'});
                    return;
                    break;
            }


            //console.log(newClass)
            //
            // //这里面的数据，会跟踪吗
            //
            if (!Array.isArray(this.templateData[this.templateEditIndex])) {
                this.$set(this.templateData, this.templateEditIndex, []);
            }

            this.templateData[this.templateEditIndex].push(
                Object.assign({},newClass)
                // deepCopy({}, newClass),
            );

            if (!Array.isArray(this.templateList[this.templateEditIndex])) {
                this.$set(this.templateList, this.templateEditIndex, []);
            }
            // this.templateList[this.templateEditIndex].push(templateName)
            this.templateList[this.templateEditIndex].push(
                templateName + this.templateList[this.templateEditIndex].length,
            );

            // //this.refreshAttrFun();//需要模拟点击一下。
            //
            //
            // //这里是用来模拟点击的
            setTimeout(() => {

                //上面是先执行各个组件的created
                const lastIndex = this.templateList[this.templateEditIndex].length - 1;
                //console.log(lastIndex,templateName);

                //用的延时，来确保点击的时候。created函数已经实现完毕（各个组件的created函数都是本地，而且没有异步操作)
                const dragEl = document.querySelectorAll('.canvas > section')[lastIndex].getElementsByClassName(`${templateName}`)[0];
                //console.log(dragEl);

                if (!dragEl) return;

                // 模拟点击
                dragEl.click();


                const dragSection = document.getElementById('section' + lastIndex);

                if (!dragSection) return;
                //console.log(dragSection);
                dragSection.click()

                pageMove.init('sort', this, () => console.log('move init start'));

                // 每次页面都会重排一次，可能是因为这里导致拖拽切换导航的时候，页面其他元素不显示了。
                // 始终把 tabbar 放到最后
                // this.tabbarLast()
            }, 10);
        }
    }


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  /*#previewWrap*/
  /*  position relative*/
  /*  width 100%*/
  .canvasBox
    /*height 667px*/
    /*width 1549px*/
    /*margin 0 auto*/
    //background #f2f2f2
    //overflow-x hidden
    //overflow-y scroll
    //border 1px solid #e5e5e5

  .canvas
    //height 100%
    //box-shadow 0 0 14px 0 rgba(0,0,0,0.1)
    width 375px
    min-height 675px
    margin 0 auto
    padding 0
    position relative
    //overflow hidden

  .handle
    margin-top 80px

  .section
    position relative

  .section.search
    position initial

  .section:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    pointer-events: none;
    display: none;

  }

  .section.noborder{
    position static
  }

  .section.active.noborder:before{
    display:none;
  }

  .section.active:before {
    z-index: 2;
    display: block;
    border: 1px dashed #298df8;
  }


  .contextmenuRight {
    display: none;
    overflow: hidden; /*隐藏溢出的元素*/
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    position: fixed; /*自定义菜单相对与body元素进行定位*/
    background-color: white;
    z-index: 212121;
    // padding: 10px 0;
    border: 1px solid #e6e6e6;
    font-size: 14px;
  }

  .menuList {
    width: 130px;
    line-height: 36px;
    padding: 0 20px;
    cursor: default;

    &:hover {
      background-color: #e6e6e6;
    }
  }


  .removeModal {
    position: fixed;
    right: 30px;
    top: 250px;
    z-index: 21;
    background-color: white;
    padding: 10px;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    width: 200px;

    h4 {
      font-weight: normal;
      font-size: 14px;
    }

    p {
      overflow: hidden;
      margin-top: 20px;

      input {
        float: right;
        box-sizing: border-box;
        font-size: 12px;
        background-color: #f0f0f0;
        border: none;
        width: 50px;
        height: 26px;
        cursor: pointer;
      }

      .ok {
        background-color: #418ef6;
        color: white;
      }

      .on {
        margin-right: 10px;
      }
    }
  }



</style>
<style scoped lang="less">
  .canvasBox::-webkit-scrollbar {
    display:none !important;
  }
  .preview-head{
    background-image: url(~@/assets/img/statusbar.jpg);
    height: 64px;
    width: 375px;
    margin: 0 auto;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50%;
    position: relative;
    box-shadow: 0 0 14px 0 rgba(0,0,0,.1);
  }
  .preview-header-title{
    width: 180px;
    margin: 0 auto;
    height: 34px;
    text-align: center;
    padding-top: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .preview-body{
    /*position: absolute;*/
    padding-top: 70px;
    /*padding-bottom: 100px;*/
    top: 0;
    bottom: 0;
  }
  .bottom-place{
    height: 100px;
  }
</style>
