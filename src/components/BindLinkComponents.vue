<template>
  <div class="selectPage">
    <el-dialog
      :visible.sync="innerVisible"
      @close="closeFun"
      title="设置点击跳转的页面"
      append-to-body
      class="innerDislog"
    >
      <div class="container">
        <el-tabs v-model="innerDialog.index" tab-position="left" class="leftMenuEl">
          <el-tab-pane label="跳转网页" name="customize" :disabled="!config.customize.show">
            <el-input v-model="innerDialog.customizeLink" placeholder="在此输入链接地址">
              <template slot="prepend">
                <el-select style="width: 90px" v-model="innerDialog.customizeStart"  placeholder="请选择">
                  <el-option label="http://" value="http://"></el-option>
                  <el-option label="https://" value="https://"></el-option>
                </el-select>
              </template>
            </el-input>
          </el-tab-pane>
          <el-tab-pane label="跳转微信小程序" name="mini" :disabled="!config.mini.show">
            <div class="line10"><el-input v-model="innerDialog.mini.innerText" placeholder="在此输入链接地址"></el-input></div>
            <div class="line10"><el-input v-model="innerDialog.mini.appid" placeholder="在此输入小程序appid（小程序跳转)"></el-input></div>
            <div class="line10"><el-input v-model="innerDialog.mini.origin_id" placeholder="在此输入小程序原始id(app跳转)"></el-input></div>
            <div class="line10"><el-input v-model="innerDialog.mini.url" placeholder="在此输入备用跳转地址(低版本时将跳转到此网址)"></el-input></div>
          </el-tab-pane>
          <el-tab-pane label="选择页面" name="page" :disabled="!config.page.show">
            <el-tabs class="tabs-child" v-model="innerDialog.customizeIndex">
              <el-tab-pane label="系统页面" name="1" :disabled="!config.page.system.show">
                <el-radio-group v-model="innerDialog.system.checked" class="systemPage">
                  <el-radio style="padding-bottom: 4px;" class="pageBlock" :label="item.path"
                            v-for="(item, index) in innerDialog.system.data"
                            :key="index" @change="saveSystem(item)">{{ item.text }}
                  </el-radio>
                </el-radio-group>
              </el-tab-pane>

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

              <el-tab-pane label="产品详情" name="3" :disabled="!config.page.product.show">
                <div class="goods-search padding15">
                  <el-input size="small" placeholder="请输入内容" v-model="goods_search_title" class="input-with-select">
                    <el-button @click="searchGooodsFun" slot="append" icon="el-icon-search"></el-button>
                  </el-input>
                </div>
                <el-radio-group v-model="innerDialog.product.checked" class="systemPage">
                  <el-radio style="padding-bottom: 4px;" class="pageBlock" :label="item.path"
                            v-for="(item, index) in innerDialog.product.data"
                            :key="index" @change="saveProduct(item)">{{ item.text }}
                  </el-radio>
                </el-radio-group>
              </el-tab-pane>

              <el-tab-pane label="自定义URL" name="4" :disabled="!config.page.customer.show">
                <el-radio-group v-model="innerDialog.customer.checked" class="systemPage">
                  <el-radio style="padding-bottom: 4px;" class="pageBlock" :label="item.path"
                            v-for="(item, index) in innerDialog.customer.data"
                            :key="index" @change="saveDiyUrl(item)">{{ item.text }}
                  </el-radio>
                </el-radio-group>
              </el-tab-pane>

              <el-tab-pane label="自定义页面" name="5" :disabled="!config.page.diy.show">
                <el-radio-group v-model="innerDialog.diy.checked" class="systemPage">
                  <el-radio style="padding-bottom: 4px;" class="pageBlock" :label="item.path"
                            v-for="(item, index) in innerDialog.diy.data"
                            :key="index" @change="saveDiyPage(item)">{{ item.text }}
                  </el-radio>
                </el-radio-group>
              </el-tab-pane>

              <el-tab-pane label="文章" name="6" :disabled="!config.page.article.show">
                <el-radio-group v-model="innerDialog.article.checked" class="systemPage">
                  <el-radio style="padding-bottom: 4px;" class="pageBlock" :label="item.path"
                            v-for="(item, index) in innerDialog.article.data"
                            :key="index" @change="saveArticlePage(item)">{{ item.text }}
                  </el-radio>
                </el-radio-group>
              </el-tab-pane>

              <el-tab-pane label="大转盘" name="7" :disabled="!config.page.rotate.show">
                <el-radio-group v-model="innerDialog.rotate.checked" class="systemPage">
                  <el-radio style="padding-bottom: 4px;" class="pageBlock" :label="item.path"
                            v-for="(item, index) in innerDialog.rotate.data"
                            :key="index" @change="saveRotate(item)">{{ item.text }}
                  </el-radio>
                </el-radio-group>
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
  import {
    getProductCategory, getProductList,getDiyPageList,getSystemUrl,getDiyUrl,systemArticleUrl,getTurns
  } from "../common/fetch";
  import { deepCopy } from '@/common/utils';
  import {fun} from '../common';

  function refreshCateData(arr) {

    if (!arr) return arr;
    for (var v of arr) {
      v.id = v.Category_ID;
      v.label = v.Category_Name;
      v.path = `/pages/classify/result?Cate_ID=${v.Category_ID}`;
      v.type = 'classify';

      if (v.child) {
        v.children = refreshCateData(v.child);
      }

    }

    return arr;

  }

  function noop() {
  }

  export default {
    name: 'BindLinkComponents',
    props: {
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

    data() {
      return {
        goods_search_title:'',
        innerVisible: false,
        innerDialog: {
          mini:{
            innerText:'',
            appid:'',
            url:'',
            origin_id:''
          },
          data: ['手动输入', '选择页面'],
          index: 'customize',
          customizeLink: '',
          customizeStart: 'http://',
          customizeIndex: '0',
          system: {
            data:[],
            isHasData: false,
            checked: '',
            checkedObj: {}
          },
          product: {
            data: [],
            checked: '',
            isHasData: false,
            checkedObj: {}
          },
          customer: {
            data: [],
            checked: '',
            isHasData: false,
            checkedObj: {}
          },
          diy: {
            data: [],
            checked: '',
            isHasData: false,
            checkedObj: {}
          },
          article: {
              data: [],
              checked: '',
              isHasData: false,
              checkedObj: {}
          },
          classify: {
            data: [],
            index: 0,
            i: 0,
            defaultProps: {
              children: 'children',
              label: 'label'
            },
            isHasData: false
          },
          rotate:{
            data: [],
            checked: '',
            isHasData: false,
            checkedObj: {}
          }
        },
        config: {
          mini:{
            show:true,
          },
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
            },
            customer:{
              show:true
            },
            diy:{
              show:true
            },
            article:{
              show:true
            },
            rotate:{
              show:true
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
            data.push('跳转网页');
          }
          if (this.config.page.show !== false) {
            data.push('选择页面');
          }
          if (this.config.mini.show !== false) {
            data.push('跳转小程序');
          }
        }
        return data;
      }
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

        //关闭页面的时候
        if (val) return;

        let $ref = this.$refs.treeForm;

        //获取已经选中的节点
        let keys = $ref.getCheckedKeys();

        //初始化的时候清空
        for (var key of keys) {
          $ref.setChecked(key, false, true);
        }

      },
      'innerDialog.index':{
        immediate: true,
        handler(val) {
          if(val=='page'){
            this.innerDialog.customizeIndex='1'
          }
        }
      },
      show: {
        immediate: true,
        handler(val) {
          this.innerDialog.customizeLink = ''
          this.innerVisible = val;


        }
      },
      'innerDialog.customizeIndex':{
        immediate:true,
        handler(val) {

          if (!this.innerVisible) return;

          if (val === '1' && !this.innerDialog.system.isHasData) {
            getSystemUrl()
              .then(res => {
                this.innerDialog.system.isHasData = true;
                let data = res.data.map((v,idx) => {
                  v.id = idx;
                  v.text = `[系统页面] ${v.name}`;
                  v.path = v.url;
                  v.type = 'default';
                  return v;
                });
                this.innerDialog.system.data.push(...data);
              });
          }

          if (val === '2' && !this.innerDialog.classify.isHasData) {
            getProductCategory()
              .then(res => {
                this.innerDialog.classify.isHasData = true;
                let data = refreshCateData(res.data);
                this.innerDialog.classify.data.push(...data);
              });
          }
          if (val === '3' && !this.innerDialog.product.isHasData) {
            getProductList({ pageSize: 9999 })
              .then(res => {
                this.innerDialog.product.isHasData = true;
                let data = res.data.map(v => {
                  v.text = `[商品] ${v.Products_Name}`;
                  v.path = `/pages/detail/detail?Products_ID=${v.Products_ID}`;
                  v.type = 'default';
                  return v;
                });
                this.innerDialog.product.data.push(...data);
              });

          }

          if (val === '4' && !this.innerDialog.customer.isHasData) {
            getDiyUrl({ pageSize: 999 })
              .then(res => {
                this.innerDialog.customer.isHasData = true;
                let data = res.data.map(v => {
                  v.text = `[自定义URL] ${v.Url_Name}`;
                  v.path = v.Url_Value;
                  v.type = 'default';
                  return v;
                });
                this.innerDialog.customer.data.push(...data);
              });

          }

          if (val === '5' && !this.innerDialog.diy.isHasData) {
            getDiyPageList({ pageSize: 999 })
              .then(res => {
                this.innerDialog.diy.isHasData = true;
                let data = res.data.map(v => {
                  v.text = `[自定义页面] ${v.Home_Name}`;
                  v.path = `/pages/page/page?Home_ID=${v.Home_ID}`;
                  v.type = 'default';
                  return v;
                });
                this.innerDialog.diy.data.push(...data);
              });

          }
          if (val === '6' && !this.innerDialog.article.isHasData) {
            systemArticleUrl({ pageSize: 999 })
              .then(res => {
                this.innerDialog.article.isHasData = true;
                let data = res.data.map(v => {
                  v.text = `[文章] ${v.Article_Title}`;
                  v.path = `/pages/common/article?Article_ID=${v.Article_ID}`;
                  v.type = 'article';
                  return v;
                });
                this.innerDialog.article.data.push(...data);
              });

          }

          if (val === '7' && !this.innerDialog.rotate.isHasData) {
            getTurns({ pageSize: 999 })
              .then(res => {
                this.innerDialog.rotate.isHasData = true;
                let data = res.data.map(v => {
                  v.text = `[大转盘] ${v.title}`;
                  v.path = `/pagesA/marketing/rotate?activity_id=${v.id}`;
                  v.type = 'rotate';
                  return v;
                });
                this.innerDialog.rotate.data.push(...data);
              });

          }




        }
      }
    },
    methods: {
      //按名字搜索
      searchGooodsFun(){
        if(!this.goods_search_title){
          fun.error({msg:'请输入关键字'})
          return;
        }
        let Products_Name = this.goods_search_title

        this.innerDialog.product.isHasData = false
        getProductList({ pageSize: 9999,Products_Name})
          .then(res => {
            this.innerDialog.product.isHasData = true;
            let data = res.data.map(v => {
              v.text = `[商品] ${v.Products_Name}`;
              v.path = `/pages/detail/detail?Products_ID=${v.Products_ID}`;
              v.type = 'default';
              return v;
            });
            this.innerDialog.product.data = data;
          });

      },
      closeFun() {
        console.log('触发关闭BindLinkComponents');
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
      saveDiyUrl(item){
        this.innerDialog.customer.checkedObj = item;
      },
      saveProduct(item) {
        this.innerDialog.product.checkedObj = item;
      },
      saveDiyPage(item) {
        this.innerDialog.diy.checkedObj = item;
      },
      saveRotate(item){
        this.innerDialog.rotate.checkedObj = item;
      },
      saveArticlePage(item){
          this.innerDialog.article.checkedObj = item;
      },
      nodeClick(data, checked, node) {
        this.$refs.treeForm.setCheckedNodes([data]);
      },
      selectPage() {
        let path = '';
        let tooltip = '';
        let dataItem = {};
        let type = '';
        if (this.innerDialog.index === 'customize') {
          path = this.innerDialog.customizeStart + this.innerDialog.customizeLink;
          tooltip = `跳转网页：${path}`;
          type = 'third';
        } else if (this.innerDialog.index === 'mini'){

          if(!this.innerDialog.mini.innerText){
            fun.error({msg:'小程序地址必填'})
            return;
          }

          if(!this.innerDialog.mini.appid){
            fun.error({msg:'appid必填'})
            return;
          }

          if(!this.innerDialog.mini.origin_id){
            fun.error({msg:'原始id必填'})
            return;
          }

          if(!this.innerDialog.mini.url){
            fun.error({msg:'备用地址必填'})
            return;
          }

          if(this.innerDialog.mini.url.indexOf('http')==-1){
            fun.error({msg:'备用地址必须包含http(https)'})
            return;
          }
          path = this.innerDialog.mini.innerText
          tooltip = `小程序：${path}`;
          type = 'mini';
          dataItem = {url:this.innerDialog.mini.url,appid:this.innerDialog.mini.appid,origin_id:this.innerDialog.mini.origin_id}

        }else if (this.innerDialog.index === 'page') {
          switch (this.innerDialog.customizeIndex) {
            case '1':
              path = this.innerDialog.system.checked;
              if (path === '') return this.$message('请先选择系统页面');
              tooltip = `系统页面：${this.innerDialog.system.checkedObj.name}`;
              dataItem = this.innerDialog.system.checkedObj;
              type = 'page';
              break;
            case '2':
              var data = this.$refs.treeForm.getCheckedNodes()[0];
              if (!data) return this.$message('请先选择分类');
              path = data.path;
              tooltip = `分类：${data.label}`;
              dataItem = data;
              type = 'cate';
              break;
            case '3':
              path = this.innerDialog.product.checked;
              if (path === '') return this.$message('请先选择产品');
              tooltip = `产品：${this.innerDialog.product.checkedObj.Products_Name}`;
              dataItem = this.innerDialog.product.checkedObj;
              type = 'product';
              break;
            case '4':
              path = this.innerDialog.customer.checked;
              if (path === '') return this.$message('请先选择url');
              tooltip = `自定义URL：${this.innerDialog.customer.checkedObj.Url_Name}`;
              dataItem = this.innerDialog.customer.checkedObj;
              type = 'diyurl';
              break;

              // v.text = `[自定义页面] ${v.Home_Name}`;
              // v.path = `/pages/page/page?Home_ID=${v.Home_ID}`;
              // v.type = 'default';
            case '5':
              path = this.innerDialog.diy.checked;
              if (path === '') return this.$message('请先选择页面');
              tooltip = `自定义页面：${this.innerDialog.diy.checkedObj.Home_Name}`;
              dataItem = this.innerDialog.diy.checkedObj;
              type = 'diypage';
              break;

              case '6':
                  path = this.innerDialog.article.checked;
                  if (path === '') return this.$message('请先选择文章');
                  tooltip = `文章：${this.innerDialog.article.checkedObj.Article_Title}`;
                  dataItem = this.innerDialog.article.checkedObj;
                  type = 'article';
              break;
            case '7':
              path = this.innerDialog.rotate.checked;
              if (path === '') return this.$message('请先选择大转盘活动');
              tooltip = `大转盘：${this.innerDialog.rotate.checkedObj.title}`;
              dataItem = this.innerDialog.rotate.checkedObj;
              type = 'rotate';
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
          dataItem, this.pageEl, this.idx2);

        this.innerDialog.customizeLink = '';//重置手动输入链接为空
        this.innerDialog.mini.url = ''
        this.innerDialog.mini.appid = ''
        this.innerDialog.mini.origin_id = ''
        this.innerDialog.mini.innerText = ''
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
<style lang="less"  scoped>

</style>
