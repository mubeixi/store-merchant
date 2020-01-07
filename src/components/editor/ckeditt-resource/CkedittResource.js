
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Command from '@ckeditor/ckeditor5-core/src/command';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
import CkedittResourceCommand from './CkedittResourceCommand'

const PLUGIN_NAME = 'CkedittResource'


/**
 * The InsertImg feature for the editor.
 * 手动上传或者选择素材库中图片，加入到富文本
 */
export default class CkedittResource extends Plugin {


  /**
   * @inheritDoc
   */
  static get pluginName() {
    return PLUGIN_NAME;
  }

  constructor( editor ) {
    super( editor );
  }

  /**
   * @inheritDoc
   */
  init() {

    const editor = this.editor;
    // const doc = editor.model.document;
    // const schema = editor.model.schema;
    // const conversion = editor.conversion;
    // const fileRepository = editor.plugins.get(FileRepository);
    console.log(444444444444)
    editor.commands.add('openResource', new CkedittResourceCommand( editor ) );
  }



}
