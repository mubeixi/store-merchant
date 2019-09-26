<template>
  <div class="uploadImg flex">
    <el-upload
      class="upload avatar-uploader"
      :class="{mini:mini}"
      v-if="type === 'avatar'"
      :multiple="multiple"
      :limit="limit"
      :name="name"
      :data.sync='ajaxData'
      :action="baseURL+'/api/little_program/shopconfig.php'"
      list-type="picture-card"
      :show-file-list='false'
      :on-preview="onPreview"
      :on-success='success'
      :on-error="error"
      :on-remove="onRemove"
      :before-upload='beforeUpload'
      :on-change='change'>
      <div v-if="imgUrl">
        <img class="avatar" :style="{height:parseInt(this.cropperOption.aspectRatio*100)+'%'}"  :src="imgUrl | domain"/>

      </div>

      <i v-else class="el-icon-plus"></i>
    </el-upload>
    <!--/api/frontend/ajax/upload-->
    <el-upload
      v-else
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
    </el-upload>

    <span class="graytext font12 tip" >{{tip}}</span>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { baseApiUrl } from '@/common/env';
import {get_Users_ID,createToken} from '@/common/fetch';

function noop() {
}

export default {
  props: {
    mini: {
      type: Boolean,
    },
    idx2: {
      default: -1,
    },
    data: {
      type: Object,
      default: () => ({
      }),
    },
    name: {
      type: String,
      default: 'image',
    },
    tip:{
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
    cropperOption:{
      type: Object,
      default: () => ({aspectRatio:0.5})
    },
    cropper:{
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      baseURL: baseApiUrl,
      // ajaxData: {
      //   act:'upload_image',
      //   ...this.data,
      // },
    };
  },
  computed: {
    activeAttr: {
      get() { return this.$store.state.activeAttr; },
      set: () => {},
    },
    ajaxData(){
      let param = { Users_ID:get_Users_ID(),act:'upload_image'}

      let ajaxData = createToken(param)
      console.log(ajaxData)
      return ajaxData;
    }

  },
  methods: {
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
      this.activeAttr.isSendAjax = false;
    },
    beforeUpload() {


      this.activeAttr.isSendAjax = true;
    },
    success(...params) {
      console.log(params)
      this.onSuccess.call(this,params[0],this.idx2);
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
        /*height: 100%;*/
      }
    }
  }
  .tip{
    margin-top 110px
    margin-left 10px
  }



</style>
