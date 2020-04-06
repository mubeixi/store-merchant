<template>
  <div class="selectPage">
    <el-dialog
      :visible.sync="innerVisible"
      title="商家类别"
      append-to-body
      @close="closeFun"
      class="innerDislog"
    >
      <div class="container">
        <el-tree
          :data="innerDialog.classify.data"
          :props="innerDialog.classify.defaultProps"
          @node-click="nodeClick"
          @check='nodeClick'
          node-key='id'
          :check-strictly="strictly"
          :expand-on-click-node='false'
          default-expand-all
          check-on-click-node
          show-checkbox
          ref='treeForm'
        ></el-tree>
      </div>

      <span slot="footer" class="dialog-footer">
                <el-button @click="closeFun">取 消</el-button>
                <el-button type="primary" @click="selectPage">确 定</el-button>
            </span>
    </el-dialog>

  </div>
</template>

<script>
  import { bizIndustryList } from '@/common/fetch';
  import { deepCopy } from '@/common/utils';
  import { get_arr_column, objTranslate } from '../common/utils';

  function refreshCateData(arr) {

    for (var v of arr) {
      //只展示顶级和一级
      if(v.pid<=0){
        v.id = v.id;
        v.label = v.industry_name;
        //v.path = `/product/list?cate_id=${v.id}`;
        //v.type = 'default';

        if (v.child) {
          v.children = refreshCateData(v.child);
        }
      }else{
        return
      }
    }
    console.log(arr)
    return arr;

  }

  function noop() {
  }

  export default {
    name: 'BindBizCateComponents',
    props: {
      has:{
        type:Array,
        default:()=>[],
      },
      multiple: {
        type: Boolean,
        default: false,
      },
      mode:{
        type:String,
        default:'productAdd'
      },
      strictly: {
        type: Boolean,
        default: true,
      },
      pageEl: {
        type: Object
      },
      idx2: {
        default: -1,
      },
      show: {
        type: Boolean,
        default: false
      },
      data: {
        type: Object,
        default: () => ({})
      },
      checkedIndex: {
        type: Object,
        default: undefined
      },
      onSuccess: {
        type: Function,
        default: noop,
      },
    },
    watch: {
      data(val) {
        this.config = deepCopy(this.config, val);
      },

      innerVisible(val) {
        this.$emit('input', val);
        let $ref = this.$refs.treeForm;

        //关闭页面的时候
        if (val) return;

        //获取已经选中的节点
        let keys = $ref.getCheckedKeys();

        //初始化的时候清空
        for (var key of keys) {
          $ref.setChecked(key, false, true);
        }
      },
      show: {
        immediate: true,
        handler(val) {
          this.innerVisible = val;
          if (!val) return;
          let self = this
          if(!this.innerDialog.classify.isHasData){
            bizIndustryList().then(res => {
              this.innerDialog.classify.isHasData = true;
              let list = [
                {
                  id: 0,
                  industry_name: "顶级目录",
                  pid: -1,
                  child:res.data
                }
              ]
              let orogin_cate_list = objTranslate(list);
              this.innerDialog.classify.orogin_cate_list = orogin_cate_list;
              let data = refreshCateData(list);
              this.innerDialog.classify.data.push(...data);

              let pids = []


              let ids = get_arr_column(this.has,'id')

              for (var cate of orogin_cate_list){
                if(cate.child)pids.push(cate.id)
              }

              for(var idx in ids){
                if(pids.indexOf(ids[idx])!=-1){
                  ids.splice(idx,1)
                }
              }

              console.log(pids,ids)

              self.$nextTick().then(res=>{
                self.setHasFn(ids)
              })

            });
          }else{

            let orogin_cate_list = this.innerDialog.classify.orogin_cate_list;

            let pids = []
            let ids = get_arr_column(this.has,'Category_ID')
            for (var cate of orogin_cate_list){
              if(cate.child)pids.push(cate.Category_ID)
            }
            for(var idx in ids){
              if(pids.indexOf(ids[idx])!=-1){
                ids.splice(idx,1)
              }
            }
            console.log(pids,ids)
            self.$nextTick().then(res=>{
              self.setHasFn(ids)
            })

          }



        }
      },
    },
    data() {
      return {
        innerVisible: false,
        innerDialog: {
          classify: {
            data: [],
            index: 0,
            orogin_cate_list:[],
            i: 0,
            defaultProps: {
              children: 'children',
              label: 'label'
            },
            isHasData: false
          }
        },
        config: {
          page: {
            show: true,
            classify: {
              show: true
            }
          }
        }

      };
    },
    computed: {

    },
    methods: {
      setHasFn(ids){
        let $ref = this.$refs.treeForm;
        if(!$ref)return;
        //初始化已经存在的数据
        //has
        $ref.setCheckedKeys(ids)

      },
      closeFun() {
        // console.log('触发关闭BindCateComponents');
        this.$emit('cancel');
      },
      getDataKeyArr(data, key, value, childname = 'childlist') {
        let obj = {};
        for (let i in data) {
          let item = data[i];
          if (item[key] === value) {
            obj = item;
            break;
          } else {
            if (item[childname]) {
              obj = this.getDataKeyArr(item[childname], key, value, childname);
              if (JSON.stringify(obj) !== '{}') {
                break;
              }
            }
          }
        }
        return obj;
      },

      nodeClick(data, checked, node) {
        if(this.multiple)return;//如果是多选的，就先不管
        this.$refs.treeForm.setCheckedNodes([data]);
      },
      selectPage() {
        let path = '';
        let tooltip = '';
        let dataItem = {};
        let type = '';
        let ext = null;
        if(this.multiple){

          var arr = this.$refs.treeForm.getCheckedNodes();
          console.log(arr)
          if (arr.length<1) return this.$message('请先选择分类');
          let nameArr = arr.map(item=>item.label)
          let idArr = arr.map(item=>item.id)
          path = idArr.join(';');
          tooltip = `多个分类：`+nameArr.join(';');
          dataItem = arr;
          type = 'multiple_cate';

          if(this.mode==='productAdd'){
            ext = this.innerDialog.classify.data
          }

        }else{
          var data = this.$refs.treeForm.getCheckedNodes()[0];
          if (!data) return this.$message('请先选择分类');
          path = data.path;
          tooltip = `分类：${data.label}`;
          dataItem = data;
          type = 'cate';
        }

        let dataType = '';
        this.onSuccess.call(this, dataType, type, path, tooltip, dataItem, this.pageEl, this.idx2,ext);
      }

    }
  };
</script>
<style lang="less">

</style>
