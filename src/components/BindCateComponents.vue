<template>
  <div class="selectPage">
    <el-dialog
      :visible.sync="innerVisible"
      title="选择商品类别"
      append-to-body
      @close="closeFun"
      class="innerDislog"
    >
      <div class="container">
        <el-tabs v-model="innerDialog.index" tab-position="left" class="leftMenuEl">
          <!--          <el-tab-pane label="自定义链接" name="customize" :disabled="!config.customize.show">-->
          <!--            <el-input v-model="innerDialog.customizeLink" placeholder="在此输入链接地址">-->
          <!--              <el-select v-model="innerDialog.customizeStart" slot="prepend" placeholder="请选择">-->
          <!--                <el-option label="http://" value="http://"></el-option>-->
          <!--                <el-option label="https://" value="https://"></el-option>-->
          <!--              </el-select>-->
          <!--            </el-input>-->
          <!--          </el-tab-pane>-->
          <el-tab-pane label="选择页面" name="page" :disabled="!config.page.show">
            <el-tabs class="tabs-child" v-model="innerDialog.customizeIndex">
              <!--              <el-tab-pane label="系统页面" name="1" :disabled="!config.page.system.show">-->
              <!--                <el-radio-group v-model="innerDialog.system.checked" class="systemPage">-->
              <!--                  <el-radio class="pageBlock" :label="item.path"-->
              <!--                            v-for="(item, index) in innerDialog.system.data"-->
              <!--                            :key="index" @change="saveSystem(item)">{{ item.text }}-->
              <!--                  </el-radio>-->
              <!--                </el-radio-group>-->
              <!--              </el-tab-pane>-->

              <el-tab-pane label="商品分类" name="2" :disabled="!config.page.classify.show">
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
              </el-tab-pane>

            </el-tabs>
          </el-tab-pane>
        </el-tabs>
      </div>

      <span slot="footer" class="dialog-footer">
                <el-button @click="closeFun">取 消</el-button>
                <el-button type="primary" @click="selectPage">确 定</el-button>
            </span>
    </el-dialog>

  </div>
</template>

<script>
  import { getProductCategory } from '@/common/fetch';
  import { deepCopy } from '@/common/utils';
  import { get_arr_column, objTranslate } from '../common/utils';

  function refreshCateData(arr) {

    for (var v of arr) {
      v.id = v.Category_ID;
      v.label = v.Category_Name;
      v.path = `/product/list?cate_id=${v.Category_ID}`;
      v.type = 'default';

      if (v.child) {
        v.children = refreshCateData(v.child);
      }

    }

    return arr;

  }

  function noop() {
  }

  export default {
    name: 'BindCateComponents',
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
      checkedIndex: function (val) {
        if (typeof val === 'undefined' || typeof val.type === 'undefined') {
          this.innerDialog.system.checked = '';
          try {
            this.$refs.treeForm.setCheckedNodes([]);
          } catch (err) {
            try {
              setTimeout(() => this.$refs.treeForm && this.$refs.treeForm.setCheckedNodes([]), 0);
            } catch (err) {
              console.log(err);
            }
          }
          // this.$refs.treeForm.setCheckedNodes([])
          this.innerDialog.product.checked = '';
          return;
        }
        let { type, id } = val;
        let data = type.split('&&');
        this.innerDialog.index = data[0];
        if (data[0] === 'page' && data.length >= 2) {
          this.innerDialog.customizeIndex = data[1];
          if (id) {
            switch (this.innerDialog.customizeIndex) {
              case '1':
                this.innerDialog.system.data.map(v => {
                  let checkedId = parseInt(v.id);
                  id = parseInt(id);
                  if (checkedId === id) {
                    this.innerDialog.system.checked = v.path;
                  }
                });
                break;
              case '2':
                var checkItem = this.getDataKeyArr(this.innerDialog.classify.data, 'id', id);
                this.$refs.treeForm && this.$refs.treeForm.setCheckedNodes([checkItem]);
                break;
              case '3':
                if (data[2]) {
                  this.innerDialog.product.data.map(v => {
                    let checkedId = parseInt(v.id);
                    if (data[2] === v.type) { // 专栏与课程的区分
                      id = parseInt(id);
                      if (checkedId === id) {
                        this.innerDialog.product.checked = v.path;
                      }
                    }
                  });
                } else {
                  this.innerDialog.product.data.map(v => {
                    let checkedId = parseInt(v.id);
                    id = parseInt(id);
                    if (checkedId === id) {
                      this.innerDialog.product.checked = v.path;
                    }
                  });
                }
                break;
            }
          } else {
            this.innerDialog.system.checked = '';
            try {
              this.$refs.treeForm.setCheckedNodes([]);
            } catch (err) {
              console.log(err);
            }
            this.innerDialog.product.checked = '';
          }
        }
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
          if (this.innerDialog.customizeIndex === '2') {

            if(!this.innerDialog.classify.isHasData){

              getProductCategory()
                .then(res => {
                  this.innerDialog.classify.isHasData = true;

                  let orogin_cate_list = objTranslate(res.data);
                  this.innerDialog.classify.orogin_cate_list = orogin_cate_list;
                  let data = refreshCateData(res.data);
                  this.innerDialog.classify.data.push(...data);

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


        }
      },
      // 'innerDialog.customizeIndex': {
      //   immediate: true,
      //   handler: function (val) {
      //
      //     if(!this.innerVisible)return;
      //
      //     if (val === '2' && !this.innerDialog.classify.isHasData) {
      //       getProductCategory()
      //         .then(res => {
      //           this.innerDialog.classify.isHasData = true;
      //           let data = refreshCateData(res.data);
      //           this.innerDialog.classify.data.push(...data);
      //
      //         });
      //     }
      //     if (val === '3' && !this.innerDialog.product.isHasData) {
      //       getProductList({ pageSize: 999 })
      //         .then(res => {
      //           this.innerDialog.product.isHasData = true;
      //           let data = res.data.map(v => {
      //             v.text = `[商品] ${v.Products_Name}`;
      //             v.path = `/product/detail?id=${v.Products_ID}`;
      //             v.type = 'default';
      //             return v;
      //           });
      //           this.innerDialog.product.data.push(...data);
      //         });
      //
      //     }
      //
      //   }
      // }
    },
    data() {
      return {

        innerVisible: false,
        innerDialog: {
          data: ['自定义链接', '选择页面'],
          index: 'page',
          customizeLink: '',
          customizeStart: 'http://',
          customizeIndex: '2',
          system: {
            data: [
              {
                id: 1,
                text: '个人中心',
                path: 'personal'
              },
              {
                id: 2,
                text: '分销中心',
                path: 'personal/distribution'
              },
              {
                id: 3,
                text: '我的团队',
                path: 'personal/distribution/team'
              },
              {
                id: 4,
                text: '提现',
                path: 'personal/distribution/withDraw'
              },
              {
                id: 5,
                text: '消息通知',
                path: 'notice'
              },
              {
                id: 6,
                text: '分享海报',
                path: 'Share'
              }
            ],
            checked: '',
            checkedObj: {}
          },
          product: {
            data: [],
            checked: '',
            isHasData: false,
            checkedObj: {}
          },
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
          customize: {
            show: true
          },
          page: {
            show: true,
            system: {
              show: true
            },
            classify: {
              show: true
            },
            product: {
              show: true
            }
          }
        }

      };
    },
    computed: {
      leftMenuData() {
        let data = [];
        if (this.config.customize) {
          if (this.config.customize.show !== false) {
            data.push('自定义链接');
          }
          if (this.config.page.show !== false) {
            data.push('选择页面');
          }
        }
        return data;
      }
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
        console.log('触发关闭BindCateComponents');
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
      saveSystem(item) {
        this.innerDialog.system.checkedObj = item;
      },
      saveProduct(item) {
        this.innerDialog.product.checkedObj = item;
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
        if (this.innerDialog.index === 'customize') {
          path = this.innerDialog.customizeStart + this.innerDialog.customizeLink;
          tooltip = `自定义链接：${path}`;
        } else if (this.innerDialog.index === 'page') {
          switch (this.innerDialog.customizeIndex) {
            case '1':
              path = this.innerDialog.system.checked;
              if (path === '') return this.$message('请先选择系统页面');
              tooltip = `系统页面：${this.innerDialog.system.checkedObj.text}`;
              dataItem = this.innerDialog.system.checkedObj;
              type = 'page';
              break;
            case '2':

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

                if(this.mode=='productAdd'){
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


              break;
            case '3':
              path = this.innerDialog.product.checked;
              if (path === '') return this.$message('请先选择产品');
              tooltip = `产品：${this.innerDialog.product.checkedObj.text}`;
              dataItem = this.innerDialog.product.checkedObj;
              type = 'product';
              break;
          }
        }


        //this.innerVisible = false;


        // let type = this.innerDialog.index;
        // if (type === 'page') {
        //     type += '&&' + this.innerDialog.customizeIndex + '&&' + dataItem.type
        // }

        let dataType = '';
        // if (dataItem.type === 'topic') {
        //     dataType = dataItem.type
        // } else if (dataItem.type === 'subject') {
        //     dataType = dataItem.media_type
        // }
        // console.log({
        //   dataType,
        //   type,
        //   path,
        //   tooltip,
        //   dataItem
        // })

        this.onSuccess.call(this, dataType,
          type,
          path,
          tooltip,
          dataItem, this.pageEl, this.idx2,ext);
        // this.$emit('change', {
        //     dataType,
        //     type,
        //     path,
        //     tooltip,
        //     dataItem
        // })
      }

    }
  };
</script>
<style lang="less">
/*.container{*/
/*  max-height: calc(100vh - 300px);*/
/*  overflow-y: scroll;*/
/*}*/
</style>
