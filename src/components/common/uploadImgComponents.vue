<template>
  <div class="uploadImg">
    <el-upload
      class="upload"
      v-if="type === 'avatar'"
      :multiple="multiple"
      :limit="limit"
      :data='ajaxData'
      :action="baseURL+'admin/ajax/upload'"
      list-type="picture-card"
      :show-file-list='false'
      :on-preview="onPreview"
      :on-success='success'
      :on-error="error"
      :on-remove="onRemove"
      :before-upload='beforeUpload'
      :on-change='change'>
      <img class="avatar" v-if="imgUrl" :src="imgUrl | http"/>
      <i v-else class="el-icon-plus"></i>
    </el-upload>
    <!--/api/frontend/ajax/upload-->
    <el-upload
      v-else
      :multiple="multiple"
      :limit="limit"
      class="upload"
      :data='ajaxData'
      :action="baseURL+'admin/ajax/upload'"
      list-type="picture-card"
      :show-file-list='showFileList'
      :on-preview="onPreview"
      :on-success='success'
      :on-error="error"
      :on-remove="onRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
  import {baseApiUrl} from '@/common/env';
  import {mapState,mapActions} from 'vuex';

  function noop() {
  }

  export default {
    props: {
      data: {
        type: Object,
        default: () => ({
          _ajax: 2
        })
      },
      imgUrl: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: ''
      },
      multiple: {
        type: Boolean,
        default: false
      },
      limit: {
        type: Number,
        default: 1
      },
      'onPreview': {
        type: Function,
        default: noop
      },
      showFileList: {
        type: Boolean,
        default: true
      },
      'onSuccess': {
        type: Function,
        default: noop
      },
      'onRemove': {
        type: Function,
        default: noop
      }
    },
    data() {
      return {
        baseURL: baseApiUrl,
        ajaxData: {
          _ajax: 2,
          ...this.data
        }
      }
    },
    computed: {
      activeAttr:{
        get:function(){return this.$store.state.activeAttr},
        set:()=>{}
      }

    },
    methods: {
      error(err, file, fileList){
        this.$fun.error({
          msg:JSON.stringify(err),
          title:'上传失败'
        })
        //写死试一下
        const mock = {
          data:{
            url:'https://knowledges.qd101.net/uploads/20190921/183707ef00bcaa47dc813d3dd50c0061.jpg'
          }
        };
        this.onSuccess.apply(this, mock)
      },
      change() {
        this.activeAttr.isSendAjax = false
      },
      beforeUpload() {
        this.activeAttr.isSendAjax = true
      },
      success(...params) {

        try {
          let needLogin = params[0].data.need_login && params[0].data.need_login.toString();
          if (needLogin === '1') {
            this.$message('请先登录');
            return this.$router.push('/login')
          }
        } catch (err) {
          this.$alert(err.message)
        }

        this.onSuccess.apply(this, params)
      }
    },
    created() {
    }
  }
</script>

<style lang="stylus" scoped>
  .uploadImg {
    .upload {
      .avatar {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
