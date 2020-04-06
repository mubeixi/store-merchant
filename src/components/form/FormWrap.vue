<template>
  <div>
    <div class="table-fun">
      <div class="th">
        <div class="td">字段类型</div>
        <div class="td">字段名称</div>
        <div class="td">初始内容</div>
        <div class="td">描述</div>
        <div class="td">是否必填</div>
        <div class="td border-right-none">操作</div>
      </div>
      <form-row
        v-for="(row,idx) in formData"
        :key="idx"
        :len="formData.length"
        :idx="idx"
        :conf="row"
        @del="rowDel"
        @next="rowNext"
        @pre="rowPre"
        @change="rowUpdate"
      ></form-row>

    </div>

  </div>
</template>
<script lang="ts">
  import {
    Component, Prop,
    Vue, Watch
  } from 'vue-property-decorator'
  import {
    Action,
    State
  } from 'vuex-class'
  import FormRow from "./FormRow.vue";
  @Component({
    components: {FormRow}
  })
  export default class FormWrap extends Vue {

    formData = [];
    @Prop({
      type:Array,
      default: ()=>[]
    })
    _conf;


    rowAdd({type='input',title='文本框'}){
      const ele = {
        type,
        title,
        label:'',
        desc: '',
        require:false,
        value: ''
      }
      this.formData.push({...ele})
    }

    //自己控制更新才可靠
    rowUpdate({idx,val}){
      this.$set(this.formData,idx,val)
    }

    rowDel(idx){
      this.formData.splice(idx,1)
    }

    rowNext(idx){
      const temp = Object.assign({},this.formData[idx+1])
      this.$set(this.formData,idx+1,this.formData[idx])
      this.$set(this.formData,idx,temp)
    }

    rowPre(idx){
      const temp = Object.assign({},this.formData[idx-1])
      console.log(idx,temp)
      this.$set(this.formData,idx-1,this.formData[idx])
      this.$set(this.formData,idx,temp)
    }

    @Watch('formData', {deep: true})
    onChangeValue(newVal,oldVal){
      this.$emit('change',newVal)
    }

    getData(){

    }

    setData(){

    }

    created() {
      this.formData = this._conf.concat([])
    }

  }
</script>
<style lang="less" scoped>

  .table-fun{
    margin-top: 20px;
    width: 1136px;
    box-sizing: border-box;
    border-top: 1px solid #EEEEEE;
    border-left: 1px solid #EEEEEE;
    .th{
      display: flex;
      text-align: center;
      box-sizing: border-box;
      border-bottom: 1px solid #EEEEEE;
      background: #F2F7FF;
      .td{
        flex: 1;
        height: 48px;
        line-height: 48px;
        font-size: 14px;
        color: #303133;
        font-weight: bold;
      }
    }
    .td{
      border-right: 1px solid #EEEEEE;
    }

  }
  .border-right-none{border-right: 0px}

</style>
