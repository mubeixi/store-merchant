<template>
  <div>
    <div class="tr" v-if="rowData">
      <div class="td width-220">
        <span>{{rowData.title}}</span>
      </div>
      <div class="td width-220">
        <el-input  v-model="rowData.label" size="mini" class="width-120"></el-input>
      </div>
      <div class="td width-220">
        <el-input :disabled="rowData.type === 'area'"  v-model="rowData.value" size="mini" class="width-120" placeholder="多个值以|分隔"></el-input>
      </div>
      <div class="td width-220">
        <el-input  v-model="rowData.desc" size="mini" class="width-120"></el-input>
      </div>
      <div class="td width-148 cursor">
        <el-switch v-model="rowData.require"></el-switch>
      </div>
      <div class="td width-148 actions">
        <i title="删除" @click="delFn" class="el-icon-delete fz-18 handle-icon"></i>
        <i title="上移" @click="preFn" :class="{grayText2:idx===0}" class="el-icon-arrow-up fz-18 handle-icon"></i>
        <i title="下移" @click="nextFn" :class="{grayText2:idx===len-1}" class="el-icon-arrow-down fz-18 handle-icon"></i>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import {
    Component,
    Vue,
    Prop,
    Watch
  } from 'vue-property-decorator'
  import {
    Action,
    State
  } from 'vuex-class'
  import {objTranslate} from "../../common/utils";

  @Component({
    watch:{
      conf:{
        immediate:true,
        deep:true,
        handler(newVal,oldVal){
          //这一句很关键，不然会是一条衔尾的蛇吃完所有内存
          if(JSON.stringify(newVal) === JSON.stringify(oldVal))return'';
          this.rowData = Object.assign({},newVal)
        }
      }
    }
  })
  export default class FormRow extends Vue {

    rowData = {}

    @Prop({
      type: Number,
      require:true
    })
    idx;
    @Prop({
      type: Number,
      require:true
    })
    len;
    @Prop({
      type: Object,
      require:true
    })
    conf;

    // get _conf(){
    //   return Object.assign({},this.conf)
    // }
    //
    // @Watch('_conf', {deep: true})
    // onChangeValue(newVal,oldVal){
    //   console.log('newVal is',newVal)
    // }

    @Watch('rowData', {deep: true})
    onChangeValue(newVal,oldVal){
      console.log('row change')
      this.$emit('change',{idx:this.idx,val:newVal})
    }

    delFn(){
      this.$emit('del',this.idx)
    }

    nextFn(){
      if(this.idx === this.len-1)return;
      this.$emit('next',this.idx)
    }

    preFn(){
      if(this.idx === 0)return;
      this.$emit('pre',this.idx)
      console.log(this.idx)
    }


    async created() {
      //不要引用传递
      this.rowData = Object.assign({},this.conf)
    }

  }
</script>
<style lang="less" scoped>
  .tr {
    text-align: center;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #EEEEEE;
    .td {
      height: 60px;
      line-height: 60px;
      font-size: 12px;
    }
  }

  .td {
    flex: 1;
    box-sizing: border-box;
    border-right: 1px solid #EEEEEE;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .width-220 {
    width: 220px
  }

  .width-148 {
    width: 148px
  }

  .width-120 {
    width: 120px;
  }


  .cursor {
    cursor: pointer
  }
  .border-right-none{border-right: 0px}

  .actions{
    /*justify-content: flex-start;*/
    //padding-left: 25px;
  }
  .handle-icon{
    margin-right: 15px;
    cursor: pointer;
    color: #444;
    &:last-child{
      margin-right: 0px;
    }
    &:hover{
      color: #409eff;
    }
    &.grayText2{
      color: #ccc;
    }
  }
</style>
