<template>
  <div @click.stop="setData({}, 0)" class="search wrap" :class="[getPostion]" :id="'searchWrap'+index"
       :style="[getWrapStyle]">
    <div class="box" :class="{'round':search.config.type==='round'}">
      <i class="el-icon-search icon"></i>
      <input class="input" readonly :style="{height:style.height+'px',backgroundColor:style.inputBgColor,color:style.color}" />
    </div>
    <span class="fun-plugin-tag">搜索框</span>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';
    import Search from '@/assets/js/diy/search';
    import {deepCopy, deepCopyStrict,mixinStyle} from '@/common/utils';
    import {fun} from '@/common';

    import {pageMove} from '@/common/tool/pageMove';

    @Component({
        props: {
            index: {
                required: true,
            },
            data: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                search: {},
            };
        },
        computed: {
            getWrapStyle(){
              if(this.search.style.position==='absolute'){
                  return {
                      background:this.style.bgColor,
                      // left:this.search.style.x+'px',
                      top:this.style.y+'px',
                      position:'absolute'
                  }
              }

                return {
                    background:this.style.bgColor,
                    position:'inherit'
                }

            },
            getPostion(){
                return this.style.position === 'absolute'?'absolute':'inherit';
            },
            style() {
                return mixinStyle(this.search.styleDefault, this.search.style);
            },
            activeAttr: {
                get() {
                    return this.$store.state.activeAttr;
                },
                set(nval) {

                },
            },
            ...mapState(['editStatus']),
        },
        filters: {
            placeholderStr(hot) {
                const str = hot.join(' ');
                if (str) return str;
                return '请输入内容';
            },
        },
        watch: {
            data(val) {

                console.log("搜索data变化",val)

            },
            'search.style.position':{
              deep:true,
                immediate:true,
              handler(val){

                  this.$nextTick().then(res=>{

                      let eleId = 'searchWrap'+this.index
                      let sectionEle = document.getElementById('section'+this.index);



                      if(val==='absolute'){

                          //还是每次都去顶上吧
                          //this.search.style.y = 0;//parseInt(document.getElementById('searchWrap'+this.index).style.top);//在这里来修改

                          // sectionEle.style.position = 'static'
                          //绝对定位就不要外边框了
                          if(sectionEle.className.indexOf('noborder')<0){
                              sectionEle.className += ' noborder'
                          }


                          pageMove.init('sort', this.$parent, () => console.log('move init start'));

                          // moveanyway(eleId,true)
                      }else{

                          // sectionEle.style.position = 'relative'

                          sectionEle.className = sectionEle.className.replace(/noborder/,'')

                          //取消事件绑定
                          // moveanyway(eleId,false)
                      }
                  })




              }
            },
            // 属性变化
            activeAttr: {
                deep: true,
                handler(val) {

                },
            },
        },
        components: {},
        methods: {
            setData(item, index) {
                console.log('点击了一次')

                //牛逼
                if(this.search.style.position==='absolute'){
                    this.search.style.y = parseInt(document.getElementById('searchWrap'+this.index).style.top);//在这里来修改
                }

                // let sectionEle = document.getElementById('section'+this.index);
                //
                // if(this.search.style.position==='absolute'){
                //
                //     //绝对定位就不要外边框了
                //     sectionEle.style.position = 'static'
                //     // if(sectionEle.className.indexOf('noborder')<0){
                //     //     // sectionEle.className += ' noborder'
                //     //
                //     // }
                //
                //     // moveanyway(eleId,true)
                // }else{
                //
                //     sectionEle.style.position = 'relative'
                //     // sectionEle.className = sectionEle.className.replace(/noborder/,'')
                //
                //     //取消事件绑定
                //     // moveanyway(eleId,false)
                // }



                // @ts-ignore
                this.$store.commit('activeAttr', this.search);// 这里点击之后，setAttr马上就有响应。
                // @ts-ignore
                this.$store.commit('tabIndex', this.index);

            },
            // ...mapActions(),
        },
        mounted(){
            // this.$nextTick().then(res=>{
            //     let eleId = 'searchWrap'+this.index
            //     let sectionEle = document.getElementById('section'+this.index);
            //
            //
            //
            //     if(this.search.style.position==='absolute'){
            //
            //         //绝对定位就不要外边框了
            //         if(sectionEle.className.indexOf('noborder')<0){
            //             sectionEle.className += ' noborder'
            //         }
            //
            //         // moveanyway(eleId,true)
            //     }else{
            //
            //         sectionEle.className = sectionEle.className.replace(/noborder/,'')
            //
            //         //取消事件绑定
            //         // moveanyway(eleId,false)
            //     }
            // })
        }

    })
    export default class SearchComponent extends Vue {
        created() {
            //用这个来搞事啊
            //funvm也是vue实例，而且不是根实例，是这个组件的实例，可以快捷的调用组件中的对象或者方法以及$ref

            // @ts-ignore
            Search.prototype.funvm = this;
            //Search.prototype.vm = this;

            // @ts-ignore
            this.$store.commit('tabIndex', this.index);// 设置tabIndex，等于templData是二维数组，这个是二维数组的

            //之类会修改等于把
            let searchObj = new Search();

            //这里后面实际上把this.search和searchObj指向同一个引用了。不过由于searchObj和this.data是浅拷贝，所以没有什么关系。
            //核心想法应该是mergeObj，混合多个对象，而且后面对象的东西会覆盖前面的

            // @ts-ignore
            this.search = deepCopy(searchObj, this.data);
            //重新绑定attrData.content，让修改可以同步到其他地方
            this.search.setIndex(0,{value:false,config:false})



        }


    }
</script>

<style scoped lang="less">



  .wrap {
    width: 100%;
    padding: 10px 0;
    &.absolute{
      &:hover{
        border: 1px dashed #298df8;
      }

      box-sizing: border-box;
      z-index: 999;
    }

    .box {
      margin: 0 15px;
      position: relative;

      .input {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #DCDFE6;
        padding: 0 30px;
        background: none;

        &::placeholder {
          color: #999;
        }
      }

      .icon {
        position: absolute;
        top: 50%;
        width: 30px;
        transform: translateY(-50%);
        -webkit-transition: all .3s;
        text-align: center;
        color: #C0C4CC;
      }
    }

    .round {
      .input {
        border-radius: 4px;
      }
    }
  }


</style>
