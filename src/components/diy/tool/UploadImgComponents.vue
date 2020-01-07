<template>
  <div class="uploadImg flex" :class="{miniwrap:mini}">
    <!--    :limit="limit"-->
    <el-upload
      ref="upload"
      class="upload avatar-uploader"
      :class="{mini:mini,small:small,isHas:imgUrl}"
      v-if="type === 'avatar'"
      :multiple="multiple"
      :name="name"
      :data.sync='ajaxData'
      :action="baseURL+'/api/little_program/shopconfig.php'"
      list-type="picture-card"
      :show-file-list='false'
      :on-preview="onPreview"
      :on-success='success'
      :on-error="error"
      :on-exceed="exceedFunc"
      :on-remove="onRemove"
      :before-upload='beforeUpload'
      :on-change='change'>
      <!--        :style="{height:parseInt(this.cropperOption.aspectRatio*100)+'%'}"-->
      <template v-if="imgUrl">
        <div class="avatar" :style="{backgroundImage:'url('+domainFunc(imgUrl)+')'}"></div>
      </template>
      <i v-else class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip ">{{tip}} <i @click="remove" style="position: absolute;right: 0;top: 0;font-size: 22px;cursor: pointer;" v-if="showDelIcon && imgUrl" class="el-icon-circle-close del-icon"></i> </div>
    </el-upload>
    <!--/api/frontend/ajax/upload-->
    <el-upload
      v-else
      ref="upload"
      :multiple="multiple"
      :limit="limit"
      :name="name"
      class="upload avatar-uploader"
      :class="{mini:mini}"
      :data.sync='ajaxData'
      :action="baseURL+'/api/little_program/shopconfig.php'"
      list-type="picture-card"
      :show-file-list='showFileList'
      :on-preview="onPreview"
      :on-success='success'
      :on-error="error"
      :on-remove="onRemove">
      <i class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip ">{{tip}}</div>
    </el-upload>

  </div>
</template>

<script>
  import { baseApiUrl } from '@/common/env';
  import { createToken, get_Users_ID } from '@/common/fetch';
  import { domain } from '@/common/utils';

  function noop() {
  }

  export default {
    props: {
      mini: {
        type: Boolean,
      },
      showDelIcon:{
        type:Boolean
      },
      small: {
        type: Boolean,
      },
      idx2: {
        default: -1,
      },
      data: {
        type: Object,
        default: () => ({}),
      },
      name: {
        type: String,
        default: 'image',
      },
      tip: {
        type: String,
        default: '',
      },
      imgUrl: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: '',
      },
      multiple: {
        type: Boolean,
        default: false,
      },
      limit: {
        type: Number,
        default: 1,
      },
      onPreview: {
        type: Function,
        default: noop,
      },
      showFileList: {
        type: Boolean,
        default: true,
      },
      onSuccess: {
        type: Function,
        default: noop,
      },
      onRemove: {
        type: Function,
        default: noop,
      },
      cropperOption: {
        type: Object,
        default: () => ({ aspectRatio: 1 })
      },
      cropper: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        fileList: [],
        baseURL: baseApiUrl,
        // ajaxData: {
        //   act:'upload_image',
        //   ...this.data,
        // },
      };
    },
    computed: {
      activeAttr: {
        get() {
          return this.$store.state.activeAttr;
        },
        set: () => {
        },
      },
      ajaxData() {
        let param = {
          Users_ID: get_Users_ID(),
          act: 'upload_image',
          env : 'wx_mp'
        };

        let ajaxData = createToken(param);
        //console.log(ajaxData);
        return ajaxData;
      }

    },
    methods: {
      remove(){
        this.onSuccess.call(this,{data:{path:''}}, this.idx2);
      },
      domainFunc(url) {
        return domain(url);
      },
      exceedFunc() {
        this.$fun.error({ msg: '最多上传' + this.limit + '个文件' });
      },
      error(err, file, fileList) {
        this.$fun.error({
          msg: JSON.stringify(err),
          title: '上传失败',
        });
        // 写死试一下
        const mock = {
          data: {
            path: 'https://knowledges.qd101.net/uploads/20190921/183707ef00bcaa47dc813d3dd50c0061.jpg',
          },
        };
        this.onSuccess.apply(this, mock);
      },
      change() {
        console.log(22222222);
        this.activeAttr.isSendAjax = false;
      },
      beforeUpload() {

        console.log(33);

        this.activeAttr.isSendAjax = true;
      },
      success(...params) {
        console.log(params);
        //这里其实等于，上传了很多图片。但是只是不显示而已，如果后续有必要可以考虑每次上传成功清空文件列表。
        //this.$refs.upload.clearFiles()
        this.onSuccess.call(this, params[0], this.idx2);
      },
    },
    created() {
    },
  };
</script>

<style lang="stylus" scoped>
  .uploadImg {
    .upload {
      .avatar {
        width: 100%;
        height: 100%;
        background-size contain
        background-repeat no-repeat
        background-position center
        background-color #f8f8f8
      }
    }
  }

  .miniwrap .tip {
    margin-top 0;
    line-height 80px;
  }

  .tip {
    margin-top 110px
    margin-left 10px
  }


</style>
