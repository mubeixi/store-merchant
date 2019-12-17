<template>
  <textarea name="content" id="editor"></textarea>
</template>

<script>
  import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
  import "@ckeditor/ckeditor5-build-classic/build/translations/zh-cn";
  import {myUploadLoader} from './myUploadLoader';

  const myUpload = (e)=>{
    // 使用 CKeditor 提供的 API 修改上传适配器
    e.plugins.get("FileRepository").createUploadAdapter = loader => new myUploadLoader(loader);
  }

  const toolbar = ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote','image',"undo", "redo","indent", "outdent", '|',"imageUpload",
    // "ckfinder",
     "mediaEmbed", "insertTable", "tableColumn", "tableRow", "mergeTableCells"]

  export default {
    name: 'WzwEditor',
    props:{
      content:{
        type:String,
        default:''
      }
    },
    data(){
      return {
        ckeditorInstance:null
      }
    },
    computed:{
      content_(){
        return this.content
      }
    },
    watch:{
      content_:{
        immediate:true,
        deep:true,
        handler(val){
          this.ckeditorInstance && this.ckeditorInstance.setData(val)
        }
      }
    },
    methods:{
      getData(){
        this.ckeditorInstance.getData()
      }
    },
    mounted() {
      ClassicEditor
        .create(document.querySelector('#editor'),{
          toolbar:toolbar,
          extraPlugins: [myUpload], // 添加自定义图片上传适配插件
          language: "zh-cn",
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
              { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
              { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
              { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
            ]
          },
          mediaEmbed: {
            extraProviders: [
              {
                name: 'allow-all',
                url: /^.+/
              }
            ],
            // providers: [
            //
            // ]
          }
        })
        .then((editor) => {
          this.ckeditorInstance = editor
          // editor.execute( 'mediaEmbed', { url: 'http://player.video.iqiyi.com/dfb21df8db2e3533914de3f815d71663/0/0/v_19runini50.swf-albumId=10342436600-tvId=10342436600-isPurchase=0-cnId=undefined' } );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
</script>

<style scoped>

</style>
