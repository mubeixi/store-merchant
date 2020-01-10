<template>
  <div class="attr-body">
<!--    <div class="title" style="" v-show="eTitle">-->
<!--      <div class="leftText">{{eTitle}}</div>-->
<!--    </div>-->
    <el-form ref="form" size="small" :model="form" label-width="80px">
      <el-form-item inline-message class="formitem" label="模板名称">
        <el-input @input="titleEv" type='text' v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item inline-message class="formitem" label="背景色">
<!--        @change="colorEv"-->
        <el-color-picker @change="colorEv" show-alpha v-model="form.bgcolor" class="inputcolor fun-color-pick" />
      </el-form-item>
    </el-form>

  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {mapActions, mapState} from 'vuex';


    // 没有继承，是依靠vuex的数据。也不碍事啊
    @Component({
        components: {

        },
        props: {
            // eTitle:{type:String, default:'属性设置'}
        },
        data() {
            return {
                // form:{}
            };
        },
        filters: {

        },
        watch:{
          // eTitle:{
          //     immediate:true,
          //     handler(val){
          //         this.setComponentTitle({title:val,desc:''})
          //     }
          // }
        },
        computed: {
            form:{
              get(){
                console.log(this.$store.state)
                  return Object.assign({},this.$store.state.system)
              },
                set(nval) {
                    //this.setSystem(nval)
                },
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
            //this.form = Object.assign({},this.$store.state.system);
        },

        methods: {
            titleEv(val){
                console.log(val)
                this.$store.state.system.title = val

                console.log(this.$store.state.system.title)

                console.log('文字改变了')
            },
            colorEv(val) {
                // this.color1 = val
                // this.clickObj.model = val
                // this.currentData.model = val

                this.$store.state.system.bgcolor = val
                console.log(this.$store.state.system.bgcolor)

                console.log('颜色改变了')

                // 用这个代替是一样的

            },
            colorClick(item) {

            },
            ...mapActions(['setActiveAttr','setEditStatus','setComponentTitle','setSystem']),
        },

    })


    export default class CommonAttrComponent extends Vue {

        // form = {
        //   'bgcolor':'#ffffff',
        //   'title':'首页'
        // }

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



  .attr-body{
    padding-top: 15px;
    padding-right: 15px;
  }
  .attr-body::-webkit-scrollbar {
    display: none;
  }
  .attr-body .el-form::-webkit-scrollbar {
    display: none;
  }
</style>
