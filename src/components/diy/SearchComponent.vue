<template>
  <div @click.stop="setData({}, 0)" class="search wrap"
       :style="{backgroundColor:search.style.bgColor}">
    <div class="box" :class="{'round':search.config.type==='round'}">
      <i class="el-icon-search icon"></i>
      <!--      :placeholder="search.value.hot|placeholderStr"-->
      <input class="input" readonly :style="{height:search.style.height+'px',backgroundColor:search.style.inputBgColor,color:search.style.color}" />
      <!--      <el-input  clearable size="small"  prefix-icon="el-icon-search" :placeholder="search.config.hot|placeholderStr" />-->
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapState} from 'vuex';
    import Search from '@/assets/js/diy/search';
    import {deepCopy, deepCopyStrict} from '@/common/utils';

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

            style() {
                return deepCopyStrict(this.search.styleDefault, this.search.style);
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

                // @ts-ignore
                this.$store.commit('activeAttr', this.search);// 这里点击之后，setAttr马上就有响应。
                // @ts-ignore
                this.$store.commit('tabIndex', this.index);

            },
            // ...mapActions(),
        },

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

        }
    }
</script>

<style scoped lang="less">
  .wrap {
    width: 100%;
    padding: 10px 0;

    .box {
      margin: 0 15px;
      position: relative;

      .input {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #DCDFE6;
        padding: 0 30px;

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
