<template>
<!--  <textarea name="content" id="editor"></textarea>-->
  <div class="wrap">
<!--    :value="content"-->
    <ckeditor tag-name="textarea"  :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
    <div class="font12 graytext">您已输入<span id="js-word" style="color: #409EFF">0</span>行,共<span style="color: #409EFF" id="js-characters">0</span>字</div>
  </div>
</template>
<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import CKEditor from '@ckeditor/ckeditor5-vue';
    //
    // import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
    import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
    import "@ckeditor/ckeditor5-build-classic/build/translations/zh-cn.js";


    import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';
    import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';
    import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
    import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor';

    import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
    import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
    import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
    import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
    import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';

    import Image from '@ckeditor/ckeditor5-image/src/image';
    import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
    import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
    import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
    import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
    import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
    import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';

    import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
    import Indent from '@ckeditor/ckeditor5-indent/src/indent';
    import Table from '@ckeditor/ckeditor5-table/src/table';
    import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';

    // import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter';
    import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
    import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount';







    import {myUploadLoader} from './myUploadLoader';
    const myUpload = (e)=>{
        console.log(e)

        // 使用 CKeditor 提供的 API 修改上传适配器
        e.plugins.get("FileRepository").createUploadAdapter = loader => new myUploadLoader(loader);
    }


    const wordCountPlugin = (e)=>{

        // 使用 CKeditor 提供的 API 修改上传适配器
        e.plugins.get("WordCount").on( 'update', ( evt, stats ) => {
            console.log(stats)
            // Prints the current content statistics.
            document.getElementById('js-word').innerHTML = stats.words
            document.getElementById('js-characters').innerHTML = stats.characters
            console.log( `Characters: ${ stats.characters }\nWords:      ${ stats.words }` );
        } );

    }

    const toolbar = {
        items: [
            'bold', 'italic', 'link', 'undo', 'redo',
            '|',
            'fontFamily','fontSize','fontColor','fontBackgroundColor',
            '|',
            'blockQuote',"indent", "outdent","insertTable",
            '|',
            'imageUpload','mediaEmbed',

        ]
    }
    // const toolbar = ['heading', '|', 'fontFamily','fontSize','fontColor','fontBackgroundColor','bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote','image',"undo", "redo","indent", "outdent", '|',"imageUpload",
    //     // "ckfinder",
    //     "mediaEmbed", "insertTable", "tableColumn", "tableRow", "mergeTableCells"]


    // const Source = (e)=>{
    //     // 使用 CKeditor 提供的 API 修改上传适配器
    //     e.plugins.get("FileRepository").createUploadAdapter = loader => new myUploadLoader(loader);
    // }


    @Component({
        components:{
            // Use the <ckeditor> component in this view.
            ckeditor: CKEditor.component
        },
        props:{
            content:{
                type:String,
                default:''
            }
        },
        watch:{
            editorData:{
                handler(val){
                    // console.log(val)
                    this.$emit('on-content-change',val)
                    // this.ckeditorInstance && this.ckeditorInstance.setData(val)
                }
            }
        },
    })

    export default class WzwEditor extends Vue{

        editor = ClassicEditor
        Characters = 0
        Words = 0
        editorData =  '<p>请输入内容.</p>'
        editorConfig = {
            language: "zh-cn",
            toolbar:toolbar,
            plugins:[
                EssentialsPlugin, BoldPlugin, ItalicPlugin, LinkPlugin, ParagraphPlugin,
                FontFamily,FontBackgroundColor,FontColor,FontSize,
                SimpleUploadAdapter,WordCount,
                Image, ImageToolbar, ImageCaption, ImageStyle, ImageResize,ImageUpload,MediaEmbed,
                BlockQuote,Indent, Table, TableToolbar
            ],
            extraPlugins: [
                myUpload,wordCountPlugin
            ], // 添加自定义图片上传适配插件

            image:{
                toolbar: [
                    'imageStyle:full',
                    'imageStyle:side',
                    '|',
                    'imageTextAlternative'
                ],
                upload:{
                    types:[ 'jpeg', 'png', 'gif', 'bmp']
                }
            },
            fontFamily: {
                // options: [
                //     'default',
                //     'Ubuntu, Arial, sans-serif',
                //     'Ubuntu Mono, Courier New, Courier, monospace'
                // ]
            },
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
            },
            table: {
                contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
            }
        }
        ckeditorInstance = null

        getData(){
            this.ckeditorInstance.getData()
        }

        setData(txt){
            console.log(txt)
            this.editorData = txt
        }

        mounted() {

            // this.editorData = this.content;
            // ClassicEditor
            //   .create(document.querySelector('#editor'),{
            //     toolbar:toolbar,
            //     extraPlugins: [myUpload], // 添加自定义图片上传适配插件
            //     language: "zh-cn",
            //     heading: {
            //       options: [
            //         { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            //         { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            //         { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            //         { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            //         { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            //         { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
            //         { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
            //       ]
            //     },
            //     mediaEmbed: {
            //       extraProviders: [
            //         {
            //           name: 'allow-all',
            //           url: /^.+/
            //         }
            //       ],
            //       // providers: [
            //       //
            //       // ]
            //     }
            //   })
            //   .then((editor) => {
            //     this.ckeditorInstance = editor
            //     // editor.execute( 'mediaEmbed', { url: 'http://player.video.iqiyi.com/dfb21df8db2e3533914de3f815d71663/0/0/v_19runini50.swf-albumId=10342436600-tvId=10342436600-isPurchase=0-cnId=undefined' } );
            //   })
            //   .catch((error) => {
            //     console.error(error);
            //   });
        }

    }
</script>

<style scoped>

</style>
