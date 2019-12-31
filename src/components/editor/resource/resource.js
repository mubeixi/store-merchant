
// import imageIcon2 from '@ckeditor/ckeditor5-core/theme/icons/image.svg'
// import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
// import { createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import {PLUGIN_NAME} from './resourceUi';
import ResourceUi from './resourceUi';
import ResourceEditing from './resourceEditing';
import CkedittResource from '../ckeditt-resource/CkedittResource';
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
