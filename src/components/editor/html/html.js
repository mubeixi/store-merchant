import htmldataprocessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';

/**
 * The InsertImg feature for the editor.
 * 手动上传或者选择素材库中图片，加入到富文本
 */
export default class InsertImage extends Plugin {

  static get requires() {
    return [ CkedittResource,ResourceUi,ResourceEditing ];
  }

  /**
   * @inheritDoc
   */
  static get pluginName() {
    return PLUGIN_NAME;
  }

}
