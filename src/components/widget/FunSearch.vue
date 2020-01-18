<template>
  <div class="fun-search-plugin" v-if="columnsData.length>0">
      <div class="row">
        <template  v-for="(col,index) in columnsData">
          <div class="col" v-if="col.search!==false">
            <div class="label graytext" :style="{fontSize:fontSizeFn(size)}" >{{col.label}}</div>
              <template v-if="col.search.type === 'select'">
                <el-select :size="size" v-model="col.value" :placeholder="col.search.placeholder||'请选择'">
                  <el-option
                    v-for="item in col.search.option"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
              <template v-if="col.search.type === 'input'">
                <el-input :size="size" v-model="col.value"/>
              </template>
              <template v-if="col.search.type === 'date'">
                <el-date-picker
                  :size="size"
                  v-model="col.value"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"/>
              </template>
              <template v-if="col.search.type === 'between'">
                <el-input
                  :size="size"
                  style="width: 100px"
                  placeholder="最低价"
                  v-model="col.value[0]" />
                  <span style="margin-left: 5px;margin-right: 5px">一</span>
                <el-input
                  :size="size"
                  placeholder="最高价"
                  style="width: 100px"
                  v-model="col.value[1]" />
              </template>

          </div>
        </template>
        <!--有自己想加的元素-->
        <!--<slot></slot>-->
        <div style="width: 20px"></div>
        <div class="col">
          <div>
            <el-button :size="size" @click="submit" type="primary">搜索</el-button>
            <el-button :size="size" @click="resets">重置</el-button>
          </div>
        </div>
      </div>

  </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';


    @Component({
        filters:{

        }
    })
    export default class FunSearch extends Vue {

        @Prop({
            type: Array,
            default: () => []
        })
        columns

        @Prop({
            type: String,
            default: 'default'
        })
        size

        columnsData = []
        filter = {}
        op = {}

        fontSizeFn(val){

            if(val==='default') return '16px'
            if(val==='small') return '14px'
            if(val==='mini') return '12px'
        }

        //每次都回重新重置 重置选中的数据有问题
        resets(){
            this.$emit('reset');
        }
        reset(is_init) {
            //重置没反应
            //this.$emit('reset');
            this.columnsData = []

            this.columns.map(v => {
                if (v.search !== false) {
                    if (!v.search) {
                        this.$set(v, 'search', {operate: '='})
                    }
                    // if (typeof v.search === 'string') {
                    //     this.$set(v, 'search', {operate: v.search})
                    // }
                    // if (!v.search.operate) {
                    //     this.$set(v.search, 'operate', '=')
                    // }
                    v.search.operate = v.search.operate.toUpperCase();
                    if (!v.search.type) {
                        this.$set(v.search, 'type', 'input')
                    }
                    let value = v.search.operate === 'BETWEEN' ? [] : '';
                    this.$set(v, 'value', value);
                    // if (v.search.type === 'date') {
                    //     v.search.operate = 'RANGE';
                    //     this.$set(v, 'opened', false);
                    // }

                    this.columnsData.push(v)
                }
                //return v;
            })


            // if(!is_init){
            //     this.$emit('reset');
            // }


        }

        submit() {
            let filter = {};
            let op = {};
            for (let item of this.columnsData) {
                let val = item.value;
                if (typeof val === 'object') {
                    let n = false;
                    for (let inp of val) {
                        if (inp) {
                            n = true;
                            break;
                        }
                    }
                    val = n ? val.join(',') : '';
                }
                if (!val) {
                    continue;
                }
                filter[item.name] = val;
                op[item.name] = item.search.operate;
            }
            this.$emit('submit', {filter: filter, op: op});
        }


        mounted() {
            this.reset(true);
        }


    }
</script>

<style lang="less" scoped>
  .fun-search-plugin{
    padding: 15px;
    margin-bottom: 10px;
    background: #f8f8f8;
  }
  .row {
    display: flex;
    flex-wrap: wrap;

    .col {
      display: flex;
      align-items: center;

      .label {
        white-space: nowrap;
        padding-right: 6px;
        width: 90px;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: right;
      }

    }
  }
</style>
