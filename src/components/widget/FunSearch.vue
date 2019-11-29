<template>
  <div class="fun-search-plugin">
    <el-row :gutter="12" >

        <template v-for="(col,index) in columnsData">

            <el-col v-if="col.search !== false" :sm="6" :md="4" :lg="3">

              <div class="label">{{col.label}}</div>
              <template v-if="col.search.type === 'select'">
                <el-select v-model="col.value" :placeholder="col.search.placeholder||'请选择'">
                  <el-option
                    v-for="item in col.search.option"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>

              </template>

              <template v-if="col.search.type === 'input'">
                <el-input v-model="col.value"/>
              </template>

              <template v-if="col.search.type === 'date'">
                <el-date-picker
                  v-model="col.value"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right" />
              </template>

            </el-col>

        </template>
        <!--有自己想加的元素-->
        <!--<slot></slot>-->
        <el-col :sm="6" :md="4" :lg="3">
          <div>
            <el-button @click="submit" type="primary">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </el-col>

      </el-row>
  </div>
</template>

<script lang="ts">
    import {
        Component,
        Vue,
        Prop
    } from 'vue-property-decorator';
    import {
        mapState
    } from 'vuex';



    @Component
    export default class FunSearch extends Vue {

        @Prop({
            type: Array,
            default: () => []
        })
        columns

        columnsData = []
        filter =  {}
        op = {}

        reset() {
            this.columnsData = this.columns.map(v => {
                if (v.search !== false) {
                    // if (!v.search) {
                    //     this.$set(v, 'search', {operate: '='})
                    // }
                    // if (typeof v.search === 'string') {
                    //     this.$set(v, 'search', {operate: v.search})
                    // }
                    // if (!v.search.operate) {
                    //     this.$set(v.search, 'operate', '=')
                    // }
                    // v.search.operate = v.search.operate.toUpperCase();
                    // if (!v.search.type) {
                    //     this.$set(v.search, 'type', 'input')
                    // }
                    // let value = v.search.operate === 'BETWEEN' ? [] : '';
                    // this.$set(v, 'value', value);
                    // if (v.search.type === 'date') {
                    //     v.search.operate = 'RANGE';
                    //     this.$set(v, 'opened', false);
                    // }
                }
                return v;
            })
        }

        submit() {
            let filter = {};
            let op = {};
            // for (let item of this.columnsData) {
            //     let val = item.value;
            //     if (typeof val === 'object') {
            //         let n = false;
            //         for (let inp of val) {
            //             if (inp) {
            //                 n = true;
            //                 break;
            //             }
            //         }
            //         val = n ? val.join(',') : '';
            //     }
            //     if (!val) {
            //         continue;
            //     }
            //     filter[item.name] = val;
            //     op[item.name] = item.search.operate;
            // }
            this.$emit('submit', {filter: filter, op: op});
        }


        mounted(){
            this.reset();
        }




    }
</script>

<style lang="less" scoped>

</style>
