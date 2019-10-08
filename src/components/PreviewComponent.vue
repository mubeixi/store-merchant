<template>
  <div>
    <div class="canvasBox" @drop="dropEv" @dragover.prevent >
<!--      @mouseover="selectStyle"-->
<!--      @mouseout="outStyle"-->
      <div class="canvas" id="canvas"
           @setData="setDataEv"
           @scroll="canvasScroll($event)" ref="pageTemplageBox" >
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
    <div class="handle text-center">
      <el-button @click="uploadConfig" type="primary">保存</el-button>
    </div>
  </div>
</template>

<script lang="ts">
    import {pageMove} from '@/common/utils';
    import {Component, Vue} from 'vue-property-decorator';
    import {State} from 'vuex-class';
    import {mapActions, mapState} from 'vuex';
    import {getSkinConfig, setSkinConfig} from '@/common/fetch';

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
    import Nav from '@/assets/js/diy/nav';
    import Cube from '@/assets/js/diy/cube';
    import Tab from '../assets/js/diy/tab';

    @Component({
        name: 'PreviewComponent',
        props: {},
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
                    // 去修改准备提交到线上的数据对象
                    // 等于右边有变动，中间预览马上就跟着变了


                    // let tempVal = {}
                    // deepCopy(tempVal,val)
                    //
                    // tempVal.aaaaaaaaaaaaaa=444;//监测下是不是data会影响this.search

                    this.$set(this.templateData[this.templateEditIndex], this.tabIndex,val);
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
            CubeComponent

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
            ...mapState(['activeAttr', 'tabIndex','editStatus']),
        },
        methods: {
            // selectStyle(){
            //   let className = document.getElementById('canvas').className
            //   if(className.indexOf('isMouseInPreview')===-1){
            //       document.getElementById('canvas').className += ' isMouseInPreview'
            //   }
            //   this.setEditStatus(false)
            // },
            // outStyle(){
            //     let className = document.getElementById('canvas').className
            //     document.getElementById('canvas').className = className.replace(/isMouseInPreview/,'')
            // },
            canvasScroll() {
                this.canvasScrollTop = this.$refs.pageTemplageBox.scrollTop
                var editEL = document.querySelector('.section.tab-bar')
                editEL.style.top = `calc(6.67rem - 53px + ${
                    this.canvasScrollTop
                }px)`
            },
            uploadConfig() {

                if(this.isAjax){
                    this.$fun.info({msg:'操作过快'})
                    return;
                }
                this.isAjax = true
                let postData = {
                    Skin_ID: this.skinInfo.Skin_ID,
                    Home_Json: JSON.stringify(this.templateData)
                }
                console.log('保存模板', this.templateData);

                setSkinConfig(postData).then(res => {

                    this.isAjax = false
                    if (res.errorCode === 0) {
                        this.$fun.success('配置保存成功')
                    }

                }).catch(e => {
                    this.isAjax = false
                    this.$fun.error('配置保存失败')
                })
            },
            clickPlugin(idx) {
                const sectionEl = document.querySelectorAll('.canvas > section')[idx];
                if (!sectionEl) return;
                sectionEl.click();
                const templateName = sectionEl.getAttribute('data-tag');

                const dragEl = sectionEl.getElementsByClassName(`${templateName}`)[0];
                console.log(templateName, dragEl);
                if (!dragEl) return;
                // 模拟点击
                dragEl.click();
            },
            setDataEv(data) {
                // this.$emit('setData', data)
            },
            activeStatus(e, index, item) {
                console.log(e, index, item);
                this.sort.downIndex = index;
                const currentEl = e.currentTarget;
                const config = {
                    width: getStyle(currentEl, 'width'),
                    height: getStyle(currentEl, 'height'),
                    left: `${currentEl.offsetLeft}px`,
                    top: `${currentEl.offsetTop}px`,
                    display: 'block',
                };
                console.log(config);

                // 方便删除的
                this.currentData.index = index;
                this.currentData.name = item;

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


                this.$store.commit('templateEditIndex', 0)

                this.clickPlugin(0);

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
                console.log(type)
                this.$refs.rightMenu.style.display = 'none';
                this[type] && this[type]();
            },
            // 修改当前活跃的index,以及
            ...mapActions(['setTemplateEditIndex', 'setTmplData','setEditStatus']),
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

        sort = {
            downIndex: -1,
            sortIndex: -1,
        }

        editData = {
            display: 'none',
        }


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
            new Promise(resolve => {


                getSkinConfig().then(res => {
                    console.log(res)
                    _self.skinInfo = res.data

                    resolve(JSON.parse(res.data.Home_Json))

                })

            })
            .then(templateData => {


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
            })
            .catch(err => {
                throw new Error(err)
            })
            .then(() => {
                //拖拽
                var isDraggable = ['div', 'nav']
                Array.from(
                    document.querySelectorAll('[draggable=true]')
                ).filter(el => {
                    let tagName = el.tagName.toLowerCase()
                    return isDraggable.some(elName => elName === tagName)
                })
            })


        }

        setClass(className, idx) {
            if (typeof className === 'undefined') return '';
            className = className.replace(/[0-9]?/g, '');
            let rt = this.dragMove.map((v) => {
                if (v === className) {
                    return `dragMove ${className}`;
                }
                return className;
            });

            if (this.currentData.index === idx) {
                rt.push('active')
            }


            return rt;
        }


        dropEv(e: any) {
            const templateName = e.dataTransfer.getData('text/plain');
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
                case 'cube':
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
                    this.$fun.error('组件不存在');
                    break;
            }


            console.log(newClass)
            //
            // //这里面的数据，会跟踪吗
            //
            if (!Array.isArray(this.templateData[this.templateEditIndex])) {
                this.$set(this.templateData, this.templateEditIndex, []);
            }

            this.templateData[this.templateEditIndex].push(
                deepCopy({}, newClass),
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

                const lastIndex = this.templateList[this.templateEditIndex].length - 1;
                console.log(lastIndex);
                const dragEl = document.querySelectorAll('.canvas > section')[lastIndex].getElementsByClassName(`${templateName}`)[0];

                console.log(dragEl);
                if (!dragEl) return;

                // 模拟点击
                dragEl.click();


                const dragSection = document.getElementById('section' + lastIndex);

                if (!dragSection) return;
                console.log(dragSection);
                dragSection.click()

                pageMove.init('sort', this, () => console.log(22222));

                // 每次页面都会重排一次，可能是因为这里导致拖拽切换导航的时候，页面其他元素不显示了。
                // 始终把 tabbar 放到最后
                // this.tabbarLast()
            }, 0);
        }
    }


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  .canvasBox
    height 667px
    background #f2f2f2
    overflow-x hidden
    overflow-y auto
    border 1px solid #e5e5e5

  .canvas
    height 100%
    padding 0
    position relative

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

  .section.active.noborder{
    /*position static*/
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
    z-index: 21;
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


  .canvasBox::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
</style>
